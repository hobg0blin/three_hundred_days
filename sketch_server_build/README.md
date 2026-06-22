# Static Build for three_js_sketch_server

These files are for building the `sketches` branch of
https://github.com/hobg0blin/three_js_sketch_server into static files.

## Usage

1. Clone the repo and checkout the `sketches` branch:
   ```
   git clone https://github.com/hobg0blin/three_js_sketch_server.git
   cd three_js_sketch_server
   git checkout sketches
   ```

2. Copy these files into the repo root:
   ```
   cp build_static.sh webpack.static.js /path/to/three_js_sketch_server/
   ```

3. Run the build:
   ```
   ./build_static.sh
   ```

4. Output lands in `static/` - upload that entire folder to your server.

## What it does

- Patches package.json for Node 22 compatibility (pins postcss, bumps three.js to 0.150)
- Builds all 33 sketches with webpack in production mode
- Copies shared assets (textures, models, fonts) to `static/assets/`
- Rewrites `/three/` asset paths to relative `../assets/` paths
- Generates an index.html landing page

## Known missing asset

- `earth_wireframe.stl` - referenced in code but not present in the repo

## Output structure

```
static/
  index.html              (landing page)
  assets/
    textures/             (shared textures)
    models/               (shared 3D models)
    fonts/                (typeface JSON files)
    js/ammo.js            (physics engine)
    studio-bg.jpg         (background texture)
  sketch_11_3/
    index.html
    sketch_11_3.js
  sketch_falling_leaves/
    index.html
    sketch_falling_leaves.js
  ... (33 sketches total)
```
