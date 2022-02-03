import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import ColorGUIHelper from '../../utils/ColorGUIHelper.js'

function createControls(camera, renderer, light) {
   // camera
            const controls = new OrbitControls(camera, renderer.domElement)
        controls.target.set(0, 5, 0)
        controls.update()
        //light gui
      if (light != undefined) {
        const gui = new GUI()
        gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
        gui.add(light, 'intensity', 0, 2, 0.01)
   }
}

export {createControls}
