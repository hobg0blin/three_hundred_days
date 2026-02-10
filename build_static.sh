#!/bin/bash
#
# Build all 100 Three.js sketches into static files for hosting.
#
# Output structure:
#   static/
#     index.html              (landing page)
#     shared/                 (deduplicated assets)
#       js/ammo.js, dat.gui.min.js, rStats.js, rStats.extras.js
#       fonts/*.typeface.json
#       models/               (merged from all days)
#       textures/             (merged from all days)
#       studio-bg.jpg, hank.jpg, thomas.png, meow_1.wav, meow_2.wav
#     day1/index.html         (sketch 1 - references ../shared/)
#     day2/index.html         (sketch 2)
#     ...
#
# Usage: ./build_static.sh [start_day] [end_day]
#   e.g. ./build_static.sh         # build all 100
#   e.g. ./build_static.sh 5 10    # build day5 through day10

set -euo pipefail

# Needed for older webpack versions on Node 17+ (MD4 hash removed from OpenSSL 3)
export NODE_OPTIONS="--openssl-legacy-provider"

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
STATIC_DIR="$ROOT_DIR/static"
LOG_DIR="$ROOT_DIR/build_logs"
SHARED_DIR="$STATIC_DIR/shared"

START_DAY="${1:-1}"
END_DAY="${2:-100}"

mkdir -p "$STATIC_DIR"
mkdir -p "$LOG_DIR"

SUCCESSES=()
FAILURES=()

log() {
  echo "[$(date '+%H:%M:%S')] $1"
}

# Patch package.json for Node 22 compatibility:
# 1. Replace node-sass with sass (dart sass) - node-sass has no Node 22 binaries
# 2. Pin postcss to 8.4.31 to avoid exports restriction that breaks css-loader 5.x
# 3. Bump three.js 0.126.x to 0.137.5 - some sketches import APIs not in 0.126.x
patch_package_json() {
  local pkg="$1"

  # Replace node-sass with sass (drop-in replacement via sass-loader)
  if grep -q '"node-sass"' "$pkg"; then
    sed -i 's/"node-sass":[[:space:]]*"[^"]*"/"sass": "^1.49.0"/' "$pkg"
  fi

  # Pin postcss in dependencies if present
  if grep -q '"postcss":[[:space:]]*"\^' "$pkg"; then
    sed -i 's/"postcss":[[:space:]]*"\^[^"]*"/"postcss": "8.4.31"/' "$pkg"
  fi

  # If postcss isn't in devDependencies, add it
  if grep -q '"devDependencies"' "$pkg" && ! grep -q '"postcss"' <(sed -n '/"devDependencies"/,/}/p' "$pkg"); then
    sed -i '/"devDependencies": {/a\    "postcss": "8.4.31",' "$pkg"
  fi

  # Bump three.js from ^0.126.x to ^0.137.5 - the sketches import modules
  # (e.g. lil-gui) that only exist in later three.js versions, indicating they
  # were developed against a newer version than what package.json specifies
  if grep -q '"three":[[:space:]]*"\^0\.12' "$pkg"; then
    sed -i 's/"three":[[:space:]]*"\^0\.12[^"]*"/"three": "^0.137.5"/' "$pkg"
  fi

  # If postcss.config.js requires tailwindcss but it's not in package.json, add it
  local dir
  dir=$(dirname "$pkg")
  if [ -f "$dir/postcss.config.js" ] && grep -q "tailwindcss" "$dir/postcss.config.js" && ! grep -q "tailwindcss" "$pkg"; then
    sed -i '/"dependencies": {/a\    "tailwindcss": "^3.0.17",' "$pkg"
  fi
}

build_day() {
  local day_num=$1
  local day_dir="$ROOT_DIR/day${day_num}"
  local log_file="$LOG_DIR/day${day_num}.log"

  if [ ! -d "$day_dir" ]; then
    log "day${day_num}: directory not found, skipping"
    return 1
  fi

  log "day${day_num}: starting build..."

  # Determine output type based on webpack config
  local output_type="dist"
  if [ "$day_num" -le 13 ]; then
    output_type="build"
  fi

  (
    cd "$day_dir"

    # Patch package.json for Node 22 compatibility
    patch_package_json package.json

    # Remove node_modules and lockfile for clean install
    rm -rf node_modules package-lock.json

    # Install dependencies
    npm install --legacy-peer-deps 2>&1

    # Clean previous build output
    rm -rf build dist

    if [ "$output_type" = "build" ]; then
      # Days 1-13: webpack outputs to build/js, build/css, build/index.html
      mkdir -p build

      # Copy assets if they exist
      if [ -d "src/public/assets" ]; then
        mkdir -p build/assets
        cp -r src/public/assets/* build/assets/ 2>/dev/null || true
      fi

      # Copy any other static files from src/public (excluding index.html and
      # webpack dev output dirs js/ and css/)
      for item in src/public/*; do
        local bname
        bname=$(basename "$item")
        if [ "$bname" != "index.html" ] && [ "$bname" != "js" ] && [ "$bname" != "css" ] && [ "$bname" != "assets" ]; then
          cp -r "$item" "build/$bname" 2>/dev/null || true
        fi
      done

      # For day13, run the tailwind CSS preprocessor if needed
      if [ "$day_num" -eq 13 ]; then
        npx postcss src/css/assets/tailwind.css -o src/css/assets/main.css 2>/dev/null || true
      fi

      # Run webpack production build
      npx webpack --env NODE_ENV=prod --stats errors-only 2>&1

    else
      # Days 14-100: webpack outputs to dist/
      # First, copy all static files from src/public/ to dist/
      mkdir -p dist

      if [ -d "src/public" ]; then
        # Copy everything from src/public except index.html (webpack generates it)
        for item in src/public/*; do
          local bname
          bname=$(basename "$item")
          if [ "$bname" != "index.html" ]; then
            cp -r "$item" "dist/$bname" 2>/dev/null || true
          fi
        done
      fi

      # Run webpack production build (creates dist/index.html, dist/bundle.js, etc.)
      npx webpack --env NODE_ENV=prod --stats errors-only 2>&1
    fi
  ) > "$log_file" 2>&1

  local exit_code=$?

  if [ $exit_code -ne 0 ]; then
    # Clean up even on failure to save disk space
    rm -rf "$day_dir/node_modules" "$day_dir/build" "$day_dir/dist" "$day_dir/package-lock.json"
    log "day${day_num}: BUILD FAILED (see $log_file)"
    return 1
  fi

  # Copy output to static directory
  local src_dir="$day_dir/$output_type"
  local dest_dir="$STATIC_DIR/day${day_num}"

  if [ ! -d "$src_dir" ]; then
    log "day${day_num}: no output directory ($output_type/) found after build"
    return 1
  fi

  rm -rf "$dest_dir"
  cp -r "$src_dir" "$dest_dir"

  # Remove source maps and license files from static output (not needed for hosting)
  find "$dest_dir" -name "*.map" -delete 2>/dev/null || true
  find "$dest_dir" -name "*.LICENSE.txt" -delete 2>/dev/null || true

  # For dist-type days, clean up webpack dev artifacts from copied js/ dir
  # (old dev bundles that aren't needed - the prod bundle.js is at the root)
  if [ "$output_type" = "dist" ] && [ -d "$dest_dir/js" ]; then
    rm -f "$dest_dir/js/main.bundle.js" 2>/dev/null || true
    rm -f "$dest_dir/js/vendors.bundle.js" 2>/dev/null || true
    rm -f "$dest_dir/js/runtime.bundle.js" 2>/dev/null || true
    rm -f "$dest_dir/js/styles.bundle.js" 2>/dev/null || true
    rm -f "$dest_dir/js/"*.LICENSE.txt 2>/dev/null || true
  fi

  # Clean up node_modules, build/, dist/ to save disk space (~165MB per day)
  rm -rf "$day_dir/node_modules" "$day_dir/build" "$day_dir/dist" "$day_dir/package-lock.json"

  log "day${day_num}: build successful"
  return 0
}

# =============================================================================
# SHARED ASSET DEDUPLICATION
# =============================================================================
# After all days are built, move common assets to shared/ and update paths
# in the built HTML/JS output. This reduces ~7.8GB to ~800MB.

dedup_shared_assets() {
  log "Starting shared asset deduplication..."

  rm -rf "$SHARED_DIR"
  mkdir -p "$SHARED_DIR/js" "$SHARED_DIR/fonts" "$SHARED_DIR/models" "$SHARED_DIR/textures"

  # -------------------------------------------------------------------------
  # 1. Populate shared/ from the most complete day (day100)
  # -------------------------------------------------------------------------
  local ref_day="$STATIC_DIR/day100"

  # JS libraries (ammo.js, dat.gui, rStats)
  for jsfile in ammo.js dat.gui.min.js rStats.js rStats.extras.js; do
    if [ -f "$ref_day/js/$jsfile" ]; then
      cp "$ref_day/js/$jsfile" "$SHARED_DIR/js/$jsfile"
    fi
  done

  # Fonts
  if [ -d "$ref_day/fonts" ]; then
    cp -r "$ref_day/fonts/"* "$SHARED_DIR/fonts/" 2>/dev/null || true
  fi

  # Models - merge from all days to get the complete set
  for day_dir in "$STATIC_DIR"/day*/; do
    if [ -d "$day_dir/models" ]; then
      cp -rn "$day_dir/models/"* "$SHARED_DIR/models/" 2>/dev/null || true
    fi
  done

  # Textures - merge from all days
  for day_dir in "$STATIC_DIR"/day*/; do
    if [ -d "$day_dir/textures" ]; then
      cp -rn "$day_dir/textures/"* "$SHARED_DIR/textures/" 2>/dev/null || true
    fi
  done

  # Root-level shared files
  for rootfile in studio-bg.jpg hank.jpg thomas.png meow_1.wav meow_2.wav; do
    for day_dir in "$STATIC_DIR"/day*/; do
      if [ -f "$day_dir/$rootfile" ]; then
        cp "$day_dir/$rootfile" "$SHARED_DIR/$rootfile"
        break
      fi
    done
  done

  # Early days (1-13) have assets in assets/ subdirectory
  for day_dir in "$STATIC_DIR"/day{1,2,3,4,5,6,7,8,9,10,11,12,13}/; do
    if [ -d "$day_dir/assets/models" ]; then
      cp -rn "$day_dir/assets/models/"* "$SHARED_DIR/models/" 2>/dev/null || true
    fi
    if [ -d "$day_dir/assets/textures" ]; then
      cp -rn "$day_dir/assets/textures/"* "$SHARED_DIR/textures/" 2>/dev/null || true
    fi
  done

  # Water textures are also referenced via textures/water/ subpath by THREE.js Water2
  if [ -d "$SHARED_DIR/textures" ]; then
    mkdir -p "$SHARED_DIR/textures/water"
    cp "$SHARED_DIR/textures/Water_"*.jpg "$SHARED_DIR/textures/water/" 2>/dev/null || true
  fi

  log "Shared directory populated."

  # -------------------------------------------------------------------------
  # 2. Update paths in each day's HTML and JS, then remove per-day copies
  # -------------------------------------------------------------------------
  for day_dir in "$STATIC_DIR"/day*/; do
    [ -d "$day_dir" ] || continue
    local dayname
    dayname=$(basename "$day_dir")

    # --- Fix HTML files: ammo.js script src ---
    if [ -f "$day_dir/index.html" ]; then
      sed -i 's|src="js/ammo\.js"|src="../shared/js/ammo.js"|g' "$day_dir/index.html"
      sed -i 's|src="js/dat\.gui\.min\.js"|src="../shared/js/dat.gui.min.js"|g' "$day_dir/index.html"
    fi

    # --- Fix JS bundles: asset path replacements ---
    # Find all JS files in the day dir (bundle.js, main.bundle.js, vendors.bundle.js)
    for jsfile in "$day_dir"/*.js "$day_dir"/js/*.js; do
      [ -f "$jsfile" ] || continue
      local jsbase
      jsbase=$(basename "$jsfile")

      # Skip shared libraries themselves
      case "$jsbase" in
        ammo.js|dat.gui.min.js|rStats.js|rStats.extras.js) continue ;;
      esac

      # Model paths (both quote styles)
      # "./models/" or "models/" or "/models/" → "../shared/models/"
      sed -i \
        -e 's|"\./models/|"../shared/models/|g' \
        -e "s|'\\./models/|'../shared/models/|g" \
        -e 's|"/models/|"../shared/models/|g' \
        -e "s|'/models/|'../shared/models/|g" \
        -e 's|"models/|"../shared/models/|g' \
        -e "s|'models/|'../shared/models/|g" \
        "$jsfile"

      # Early-day asset paths: "./assets/models/" and "./assets/textures/"
      sed -i \
        -e 's|"\./assets/models/|"../shared/models/|g' \
        -e "s|'\\./assets/models/|'../shared/models/|g" \
        -e 's|"\./assets/textures/|"../shared/textures/|g' \
        -e "s|'\\./assets/textures/|'../shared/textures/|g" \
        "$jsfile"

      # Texture paths
      sed -i \
        -e 's|"textures/|"../shared/textures/|g' \
        -e "s|'textures/|'../shared/textures/|g" \
        -e 's|"\./textures/|"../shared/textures/|g' \
        -e "s|'\\./textures/|'../shared/textures/|g" \
        "$jsfile"

      # Font paths
      sed -i \
        -e 's|"fonts/|"../shared/fonts/|g' \
        -e "s|'fonts/|'../shared/fonts/|g" \
        -e 's|"\./fonts/|"../shared/fonts/|g' \
        -e "s|'\\./fonts/|'../shared/fonts/|g" \
        "$jsfile"

      # Root-level image/audio assets (exact matches to avoid false positives)
      sed -i \
        -e 's|"studio-bg\.jpg"|"../shared/studio-bg.jpg"|g' \
        -e "s|'studio-bg\\.jpg'|'../shared/studio-bg.jpg'|g" \
        -e 's|"\./studio-bg\.jpg"|"../shared/studio-bg.jpg"|g' \
        -e "s|'\\./studio-bg\\.jpg'|'../shared/studio-bg.jpg'|g" \
        -e 's|"hank\.jpg"|"../shared/hank.jpg"|g' \
        -e "s|'hank\\.jpg'|'../shared/hank.jpg'|g" \
        -e 's|"\./hank\.jpg"|"../shared/hank.jpg"|g' \
        -e "s|'\\./hank\\.jpg'|'../shared/hank.jpg'|g" \
        -e 's|"thomas\.png"|"../shared/thomas.png"|g' \
        -e "s|'thomas\\.png'|'../shared/thomas.png'|g" \
        -e 's|"meow_1\.wav"|"../shared/meow_1.wav"|g' \
        -e "s|'meow_1\\.wav'|'../shared/meow_1.wav'|g" \
        -e 's|"meow_2\.wav"|"../shared/meow_2.wav"|g' \
        -e "s|'meow_2\\.wav'|'../shared/meow_2.wav'|g" \
        "$jsfile"

      # stone-granite texture referenced at root level in some days
      sed -i \
        -e 's|"stone-granite-1-TEX\.png"|"../shared/textures/stone-granite-1-TEX.png"|g' \
        -e "s|'stone-granite-1-TEX\\.png'|'../shared/textures/stone-granite-1-TEX.png'|g" \
        "$jsfile"
    done

    # --- Remove per-day copies of shared assets ---
    rm -rf "$day_dir/models" 2>/dev/null || true
    rm -rf "$day_dir/textures" 2>/dev/null || true
    rm -rf "$day_dir/fonts" 2>/dev/null || true
    rm -rf "$day_dir/assets" 2>/dev/null || true
    rm -f "$day_dir/studio-bg.jpg" 2>/dev/null || true
    rm -f "$day_dir/hank.jpg" 2>/dev/null || true
    rm -f "$day_dir/thomas.png" 2>/dev/null || true
    rm -f "$day_dir/meow_1.wav" 2>/dev/null || true
    rm -f "$day_dir/meow_2.wav" 2>/dev/null || true
    rm -f "$day_dir/stone-granite-1-TEX.png" 2>/dev/null || true

    # Remove per-day JS libraries (now in shared/js/)
    rm -f "$day_dir/js/ammo.js" 2>/dev/null || true
    rm -f "$day_dir/js/dat.gui.min.js" 2>/dev/null || true
    rm -f "$day_dir/js/rStats.js" 2>/dev/null || true
    rm -f "$day_dir/js/rStats.extras.js" 2>/dev/null || true

    # Remove empty js/ and css/ dirs
    rmdir "$day_dir/js" 2>/dev/null || true
    rmdir "$day_dir/css" 2>/dev/null || true

    log "$dayname: deduplicated"
  done

  # Report savings
  local shared_size
  shared_size=$(du -sh "$SHARED_DIR" | cut -f1)
  local total_size
  total_size=$(du -sh "$STATIC_DIR" | cut -f1)
  log "Deduplication complete."
  log "  Shared assets: $shared_size"
  log "  Total static output: $total_size"
}

# =============================================================================
# MAIN
# =============================================================================

# Main build loop
log "Starting static build for days $START_DAY through $END_DAY"
log "Output directory: $STATIC_DIR"
echo ""

for day_num in $(seq "$START_DAY" "$END_DAY"); do
  if build_day "$day_num"; then
    SUCCESSES+=("day${day_num}")
  else
    FAILURES+=("day${day_num}")
  fi
  echo ""
done

# Print build summary
echo "========================================="
echo "BUILD SUMMARY"
echo "========================================="
echo ""
echo "Successful: ${#SUCCESSES[@]} / $((END_DAY - START_DAY + 1))"
if [ ${#SUCCESSES[@]} -gt 0 ]; then
  echo "  ${SUCCESSES[*]}"
fi
echo ""
echo "Failed: ${#FAILURES[@]} / $((END_DAY - START_DAY + 1))"
if [ ${#FAILURES[@]} -gt 0 ]; then
  echo "  ${FAILURES[*]}"
  echo ""
  echo "Check build logs in $LOG_DIR/ for details."
fi
echo ""

# Deduplicate shared assets
if [ "$START_DAY" -eq 1 ] && [ "$END_DAY" -eq 100 ]; then
  dedup_shared_assets
fi

# Copy landing page
if [ -f "$ROOT_DIR/static_index.html" ]; then
  cp "$ROOT_DIR/static_index.html" "$STATIC_DIR/index.html"
fi

echo ""
echo "Static files are in: $STATIC_DIR/"
