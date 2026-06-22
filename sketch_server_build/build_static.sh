#!/bin/bash
set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUTPUT_DIR="$PROJECT_DIR/static"
LOG_DIR="$PROJECT_DIR/build_logs"

export NODE_OPTIONS="--openssl-legacy-provider"

mkdir -p "$OUTPUT_DIR" "$LOG_DIR"

echo "=== Building three_js_sketch_server for static hosting ==="
echo ""

cd "$PROJECT_DIR"

# Step 1: Patch package.json for Node 22 compatibility
echo "[1/5] Patching package.json for Node 22 compatibility..."

# Pin postcss to 8.4.31 to avoid ERR_PACKAGE_PATH_NOT_EXPORTED with css-loader 5.x
sed -i 's/"postcss": "^8.4.5"/"postcss": "8.4.31"/' package.json

# Bump three.js to 0.150 for RenderPixelatedPass support
sed -i 's/"three": "^0.144.0"/"three": "^0.150.0"/' package.json

echo "   Done."

# Step 2: Install dependencies
echo "[2/5] Installing dependencies..."
# --ignore-scripts avoids phantomjs install failure on Node 22
npm install --legacy-peer-deps --ignore-scripts > "$LOG_DIR/npm_install.log" 2>&1

# Install url-loader/file-loader for image handling
npm install url-loader file-loader --save-dev --legacy-peer-deps --ignore-scripts >> "$LOG_DIR/npm_install.log" 2>&1
echo "   Done."

# Step 3: Run webpack build
echo "[3/5] Running webpack production build (all 33 sketches)..."
npx webpack --config webpack.static.js --env NODE_ENV=prod --progress 2>&1 | tee "$LOG_DIR/webpack_build.log"
BUILD_STATUS=${PIPESTATUS[0]}

if [ $BUILD_STATUS -ne 0 ]; then
    echo ""
    echo "   WARNING: Webpack build exited with status $BUILD_STATUS"
    echo "   Check $LOG_DIR/webpack_build.log for details"
    echo ""
fi

# Step 4: Fix asset paths in built files
echo "[4/5] Fixing asset paths for static hosting..."

# Fix /three/ paths in HTML files to use relative ../assets/ paths
find "$OUTPUT_DIR" -name "index.html" -exec sed -i \
    -e 's|src="/three/js/ammo.js"|src="../assets/js/ammo.js"|g' \
    -e 's|"/three/textures/|"../assets/textures/|g' \
    -e 's|"/three/models/|"../assets/models/|g' \
    -e 's|"/three/fonts/|"../assets/fonts/|g' \
    -e 's|"/three/studio-bg.jpg"|"../assets/studio-bg.jpg"|g' \
    {} \;

# Fix /three/ paths in JS bundles
find "$OUTPUT_DIR" -name "*.js" -path "*/sketch_*" -exec sed -i \
    -e 's|/three/textures/|../assets/textures/|g' \
    -e 's|/three/models/|../assets/models/|g' \
    -e 's|/three/fonts/|../assets/fonts/|g' \
    -e 's|/three/studio-bg.jpg|../assets/studio-bg.jpg|g' \
    -e 's|/three/js/|../assets/js/|g' \
    {} \;

echo "   Done."

# Step 5: Create index page
echo "[5/5] Creating landing page..."

SKETCHES=$(ls -d "$OUTPUT_DIR"/sketch_*/ 2>/dev/null | xargs -I{} basename {} | sort)
SKETCH_COUNT=$(echo "$SKETCHES" | wc -l)

cat > "$OUTPUT_DIR/index.html" << 'INDEX_EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Three.js Sketches</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #111;
      color: #eee;
      min-height: 100vh;
      padding: 2rem;
    }
    h1 {
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2rem;
      font-weight: 300;
      letter-spacing: 0.1em;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 0.75rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .grid a {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.25rem 0.5rem;
      background: #222;
      color: #ccc;
      text-decoration: none;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 500;
      transition: background 0.15s, color 0.15s;
      text-align: center;
    }
    .grid a:hover {
      background: #444;
      color: #fff;
    }
  </style>
</head>
<body>
  <h1>Three.js Sketches</h1>
  <div class="grid">
INDEX_EOF

for sketch in $SKETCHES; do
    display_name=$(echo "$sketch" | sed 's/sketch_//;s/_/ /g')
    echo "    <a href=\"$sketch/index.html\">$display_name</a>" >> "$OUTPUT_DIR/index.html"
done

cat >> "$OUTPUT_DIR/index.html" << 'INDEX_EOF'
  </div>
</body>
</html>
INDEX_EOF

echo ""
echo "=== Build complete ==="
echo "Output directory: $OUTPUT_DIR"
echo "Sketches built: $SKETCH_COUNT"
echo ""
du -sh "$OUTPUT_DIR"
echo ""
echo "To test locally: cd $OUTPUT_DIR && python3 -m http.server 8080"
