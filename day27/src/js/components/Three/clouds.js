import { BufferGeometry,  SphereGeometry, MeshPhongMaterial, Mesh, Vector3 } from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}



function createCloud() {

  let tuft1 = new SphereGeometry(1.5,7,8)
  tuft1.translate(-2,0,0)

  const tuft2 = new SphereGeometry(1.5,7,8)
  tuft2.translate(2,0,0)
  tuft1 = BufferGeometryUtils.mergeBufferGeometries([tuft2, tuft1])

  const tuft3 = new SphereGeometry(2.0,7,8)
  tuft3.translate(0,0,0)
  tuft1 = BufferGeometryUtils.mergeBufferGeometries([tuft3, tuft1])
 // tuft1.computeBoundingSphere()
  const map = (val, smin, smax, emin, emax) => (emax-emin)*(val-smin)/(smax-smin) + emin
const jitter = (geo,per) => {
    for (let i = 0; i < geo.attributes.position.array.length; i++) {
    geo.attributes.position.setX(i, geo.attributes.position.getX(i) + map(Math.random(),0,1,-per,per))
    geo.attributes.position.setY(i, geo.attributes.position.getY(i) + map(Math.random(),0,1,-per,per))
    geo.attributes.position.setZ(i, geo.attributes.position.getZ(i) + map(Math.random(),0,1,-per,per))
  }
}
const chopBottom = (geo,bottom) => {
  for (let i = 0; i < geo.attributes.position.array.length; i++) {
  geo.attributes.position.setY(i, Math.max(geo.attributes.position.getY(i),bottom))
  }
}
  console.log('tuft1: ', tuft1.attributes)
  jitter(tuft1, 0.2)
  chopBottom(tuft1,-0.5)
  tuft1.attributes.position.needsUpdate = true
  tuft1.computeVertexNormals()

  const cloud = new Mesh(
    tuft1,
    new MeshPhongMaterial({
        color:'white',
        flatShading: true
    }))
let plusOrMinus = Math.random() < 0.5 ? -100 : 100;
let plusOrMinus2 = Math.random() < 0.5 ? -100 : 100;
  let xRange1 = 5*plusOrMinus
  let xRange2 = 0*plusOrMinus
  let yRange1 = 5* plusOrMinus
  let yRange2 = 0
  let zRange1 = 6 * plusOrMinus2
  let zRange2 = 5* plusOrMinus2
  cloud.receiveShadow = true
  cloud.castShadow = true
  cloud.position.set(randomNumber(xRange1, xRange2), randomNumber(yRange1, yRange2), randomNumber(zRange1, zRange2))
//  cloud.frustumCulled = false
  return cloud
}

export { createCloud }
