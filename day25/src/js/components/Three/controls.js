import { Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import ColorGUIHelper from '../../utils/ColorGUIHelper.js'

function createControls(camera, renderer, light, center, autorotate) {
   // camera
            const controls = new OrbitControls(camera, renderer.domElement)
  if (center) {
    controls.center = new THREE.Vector3(center.position.x, center.position.y, center.position.z)
  }
  if (autorotate) {
    controls.autoRotate = true
  }
        controls.target.set(0, 0, 0)
        controls.update()
        //light gui
      if (light != undefined) {
        const gui = new GUI()
        gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
        gui.add(light, 'intensity', 0, 2, 0.01)
   }
  return controls
}

export {createControls}
