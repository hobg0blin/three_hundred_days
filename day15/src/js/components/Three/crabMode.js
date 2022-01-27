import { Color, Mesh, MeshPhysicalMaterial} from 'three'
import { importModel } from './importModel.js'

function crabMode() {
  return new Promise((resolve) => {
  const material = new MeshPhysicalMaterial({
    color: new Color(Math.random() * 0xffffff),
      metalness: 0.25,
      roughness: 0.1,
      opacity: 0,
      transmission: 0.99,
      clearcoat: 1.0,
      clearcoatRoughness: 0.25
  })
  resolve(importModel('/models/Crab_t.stl', material, addCrabToScene))
  })
}

function animateCrab(crab,scene, idx, arr) {
  console.log('crab y: ', crab.position.y)
  crab.position.y -= 2
  if (crab.position.y <= -4000) {
        crab.geometry.dispose()
        crab.material.dispose()
        scene.remove(crab)
        arr.splice(idx, 1)
  }
}

function addCrabToScene(geometry, material, scene) {
  const mesh = new Mesh(geometry, material)
  mesh.scale.set(2, 2, 2)
  const range = 400
  const randPos = () => {
    let rand = Math.floor(Math.random() * ((0) - (-range)) + (-range))
    let pos = Math.random() > 0.5 ? 1 : -1
    return rand * pos
  }
  console.log('randPos', randPos())
  mesh.position.set(randPos(), randPos()/2 + 10, randPos())
  mesh.rotation.set(randPos()/100, randPos()/100, randPos()/100)

//  scene.add(mesh)
  return mesh
}

export { crabMode, animateCrab }
