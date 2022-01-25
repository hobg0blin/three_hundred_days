import { FontLoader, TextGeometry, MeshBasicMaterial, Color, Mesh} from 'three'
import randomColor from 'randomcolor'
const loader = new FontLoader()
let currentGoalColor = new Color
let currentColor = new Color

function createText(text, font) {
    font = loader.parse(font)
    console.log('font: ', font)
    const geo = new TextGeometry(text, {font: font})
    geo.center()
    const material = new MeshBasicMaterial({color: currentColor})
    return new Mesh(geo, material)
}
function lerpColor(textObj, time) {
    if (Math.round(textObj.material.color.r*100)/100 == Math.round(currentGoalColor.r*100)/100 || time == 20){
        currentGoalColor = new Color(randomColor({format: 'rgb'}))
    }
    textObj.material.color.set(currentColor.lerpColors(textObj.material.color, currentGoalColor, 0.03))
    time *= 0.0005
    textObj.rotation.y += time;
 //   textObj.rotation.y = time

}
export { createText, lerpColor }
