import {BufferGeometry, Vector3, Float32BufferAttribute, PointsMaterial, Points} from 'three'
import {getRandomInt} from '../utils/RandomInt.js'

function createRain(rainCount) {
        let rainGeo = new BufferGeometry();
        let rainArr = []
    for(let i=0;i<rainCount;i++) {
      let rainDrop = new Vector3(Math.random() * 400 -200, Math.random() * 500 - 250, Math.random() * 400 - 200);
      rainArr.push(rainDrop.x, rainDrop.y, rainDrop.z);
    }
    rainGeo.setAttribute('position', new Float32BufferAttribute(rainArr, 3))
    let rainMaterial = new PointsMaterial({
  color: 0xaaaaaa,
  size: 0.1,
//  transparent: true
});
    let rain = new Points(rainGeo,rainMaterial);
  return rain
}
function animateRain(rainGeo) {
  for (let i = 0; i < rainGeo.attributes.position.array.length; i++) {
          let velocity = -10
  let p = rainGeo.attributes.position.getY(i)
  velocity -= 0.1 + Math.random() * 0.1
    if (p == undefined || p < -200) {

    rainGeo.attributes.position.setY(i, getRandomInt(190, 210))
    } else {
  rainGeo.attributes.position.setY(i, p += velocity)
}
    }
rainGeo.attributes.position.needsUpdate = true

}

export {createRain, animateRain}
