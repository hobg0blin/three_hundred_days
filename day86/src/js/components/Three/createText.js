import {MeshPhongMaterial, Color, Mesh} from 'three'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import randomColor from 'randomcolor'
let loader = new FontLoader()
let currentGoalColor = new Color
let currentColor = new Color

function createText(text, font, mat) {
    font = loader.parse(font)
    console.log('font: ', font)
    const geo = new TextGeometry(text, {font: font})
    geo.center()
  geo.scale(0.2, 0.2, 0.2)
    geo.attributes.position.array.needsUpdate = true
    geo.computeVertexNormals()
    return new Mesh(geo, mat)
}
function lerpColor(textObj, time) {
    if (Math.round(textObj.material.color.r*100)/100 == Math.round(currentGoalColor.r*100)/100 || time == 20){
        currentGoalColor = new Color(randomColor({format: 'rgb'}))
    }
    textObj.material.color.set(currentColor.lerpColors(textObj.material.color, currentGoalColor, 0.03))
    time *= 0.0005
//    textObj.rotation.y += time;

}
export { createText, lerpColor }
