import { Color, Mesh, MeshPhongMaterial, TextureLoader, RepeatWrapping } from 'three'
import { importModel } from './importModel.js'
const loader = new TextureLoader()

function crabMode() {
  return new Promise((resolve) => {
  const tex = loader.load('./hank.jpg')
  tex.wrapS = RepeatWrapping
  tex.repeat.set(0.5, 0.5)
  tex.offset.set(0.5, 0.5)
    console.log('tex: ', tex)
  const materialCrab = new MeshPhongMaterial({
    color: 'red'
  })
  const materialYellow = new MeshPhongMaterial({
    color: 'yellow'
  })
  resolve(importModel('/models/Crab_t.stl', materialCrab, addCrabToScene))
  })
}

function addPipe() {
  return new Promise((resolve) => {
    const materialYellow = new MeshPhongMaterial({
    color: 'yellow'
  })
  resolve(importModel('/models/Corncob_Pipe.stl', materialYellow, addCrabToScene))
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
//  mesh.position.set(randPos(), randPos()/2 + 10, randPos())
//  mesh.rotation.set(randPos()/100, randPos()/100, randPos()/100)

//  scene.add(mesh)
  return mesh
}

export { crabMode, animateCrab, addPipe }
