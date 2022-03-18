import { Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import ColorGUIHelper from '../../utils/ColorGUIHelper.js'
let gui;

function createControls(camera, renderer, options = {}) {
   // camera
            const controls = new OrbitControls(camera, renderer.domElement)
  console.log('controls: ', controls)
  if (options.center) {
    controls.center = new Vector3(options.center.position.x, options.center.position.y, options.center.position.z)
  }
  if (options.autorotate) {
    controls.autoRotate = true
  }

        //light gui
  if (options.light != undefined) {
    if (gui == undefined) {
      gui = new GUI()
    }

        gui.addColor(new ColorGUIHelper(options.light, 'color'), 'value').name('color')
        gui.add(options.light, 'intensity', 0, 2, 0.01)
 }
  return controls
}
function addToGUI(objects, folderName) {
  if (gui == undefined) {
    gui = new GUI()
  }
  console.log('gui: ', gui)
  for (let object of objects) {
    const newFolder = gui.addFolder(folderName + ' ' + objects.indexOf(object))
    for (const [key, value] of Object.entries(object)) {
      if (typeof(value) == 'boolean'){
      newFolder.add(object, key, value)
      }
    }
  newFolder.close()
  }
}

export {createControls, addToGUI}
