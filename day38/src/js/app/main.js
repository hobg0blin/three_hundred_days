// Global imports -
import * as THREE from 'three';
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import {createSun} from '../components/Three/sun.js'
import {createCamera} from '../components/Three/camera.js'
import {createLights} from '../components/Three/lights.js'
import {createRenderer} from '../components/Three/renderer.js'
import { createFog} from '../components/Three/fog.js'
import {createControls, addToGUI} from '../components/Three/controls.js'
import {raycastSelector, onPointerMove} from '../components/Three/raycastSelector'
import {createSphere, animateSphere} from '../components/Three/ProceduralSphere/Sphere.js'
import {getRandomInt } from '../components/utils/RandomInt.js'
import {createFloor } from '../components/Three/Floor.js'
import {createWater } from '../components/Three/water.js'
import {createRain, animateRain} from '../components/Three/rain.js'
import {createTree} from '../components/Three/tree.js'
import { importSTLModel } from '../components/Three/importSTLModel.js'
import { importFBXModel } from '../components/Three/importFBXModel.js'
import { importGLTFModel } from '../components/Three/importGLTFModel.js'
import { createCloud } from '../components/Three/clouds.js'
import { Train } from '../components/Three/Train/Train.js'
import randomColor from 'randomcolor'
let inc = 0


const clock = new THREE.Clock()
let mouse = new THREE.Vector2()

// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Texture {
    constructor() {
      console.log('foo')
        // set up scene
        // CAMERA
        // fov, aspect, near, far
      this.camera = createCamera()
   //     this.camera.up.set(0, 0, -1)
//      this.camera.lookAt(new THREE.Vector3(5000,200, 20000))
        // SCENE & RENDER
        this.renderer = createRenderer()
        this.scene = new THREE.Scene();
        this.camera.lookAt(this.scene.position)
        this.raycaster = new THREE.Raycaster()
      document.addEventListener('mousemove', onPointerMove)

        //LIGHTS
        const color = 0xFFFFFF
        const intensity = 2.5
       this.light = createLights({color: color, intensity: intensity})
        console.log('light: ', this.light)
        this.light[0].position.set(-200, 0, 300)
      this.light[0].target.position.set(0, -200, 0)
      this.scene.add(this.light[0].target)
//        this.light[0].position.setScalar(1)
        this.scene.add(this.light[0], new THREE.AmbientLight(color, 0.9))
      const helper = new THREE.DirectionalLightHelper(this.light[0], 5, 0xff0008)
//      this.scene.add(helper)

//        this.scene.add(this.light[1])
        //BACKGROUND & FOG
//        let backgroundColor = new THREE.Color(0x34c9eb)
 //       this.scene.background = backgroundColor
        let loader = new THREE.TextureLoader()
        let backgroundImg = loader.load('studio-bg.jpg')
        this.scene.background = backgroundImg
//        this.scene.fog = createFog(0x9ab3b2, 40, 450)
        // CONTRO4S
        //GROUND
//        let groundMesh = createSphere({width: 550, height: 500, segments: 15, range: 0})
//        this.scene.add(groundMesh)
      //
  let roadGeo = new THREE.PlaneGeometry(1000, 20)
  let roadMat = new THREE.MeshPhongMaterial({color: 'black'})
  let road = new THREE.Mesh(roadGeo, roadMat)
road.position.y = -200
        road.rotation.x = -Math.PI /2
//this.scene.add(road)
    this.controls = createControls(this.camera, this.renderer)
      this.controls.target = new THREE.Vector3(0, -200, 0)
            this.render = this.render.bind(this) //bind to class instead of window object
      this.addBody = this.addBody.bind(this)
        //if I need mouse pos
            let harry = importGLTFModel('models/AnimatedHuman/Blend/harry.glb', this.addBody)
            let brent = importGLTFModel('models/AnimatedHuman/Blend/josie.glb', this.addBody)
      let josie = importGLTFModel('models/AnimatedHuman/Blend/josie.glb', this.addBody)
      let michael = importGLTFModel('models/AnimatedHuman/Blend/michael.glb', this.addBody)
      let zach = importGLTFModel('models/AnimatedHuman/Blend/zach.glb', this.addBody)
      let dice = new THREE.DodecahedronGeometry(5)
      let diceMat = new THREE.MeshLambertMaterial({color:'blue'})
      this.diceMesh = new THREE.Mesh(dice, diceMat)
      this.diceMesh.position.y = - 170
      this.scene.add(this.diceMesh)

      let table = new THREE.BoxGeometry(20, 1, 20)
      let tableLeg1 = new THREE.BoxGeometry(1,16, 1)
      let tableLeg2 = new THREE.BoxGeometry(1, 16, 1)
      let tableLeg3 = new THREE.BoxGeometry(1, 16, 1)
      let tableLeg4 = new THREE.BoxGeometry(1, 16, 1)
      let boxMat = new THREE.MeshPhongMaterial({color: 'brown'})
      let tableMesh = new THREE.Mesh(table, boxMat)
      let tableLeg1Mesh = new THREE.Mesh(tableLeg1, boxMat)
      let tableLeg2Mesh = new THREE.Mesh(tableLeg2, boxMat)
      let tableLeg3Mesh = new THREE.Mesh(tableLeg3, boxMat)
      let tableLeg4Mesh = new THREE.Mesh(tableLeg4, boxMat)
      this.scene.add(tableMesh, tableLeg1Mesh, tableLeg2Mesh, tableLeg3Mesh,tableLeg4Mesh)

      tableMesh.position.set(0, -175, 0)
      tableLeg1Mesh.position.set(-4, -185, 4)
      tableLeg2Mesh.position.set(-4, -185, -4)
      tableLeg3Mesh.position.set(4, -185, -4)
      tableLeg4Mesh.position.set(4, -185, 4)

//        document.addEventListener('mouseclick', onDocumentMouseClick, false)

}
    render(time, i) {
   //   console.log('foo')
        let range = 1
        this.renderer.setAnimationLoop(() => {

        const xSpd = time * 0.00015
            //TODO: update to proper animation loop per https://discoverthreejs.com/book/first-steps/animation-loop/#timing-in-the-animation-system

//            console.log('camera pos: ', this.camera.position)

            this.controls.update()
    if (this.anim != undefined) {
//            this.mixer.update(clock.getDelta())
//      this.model.position.z -= 0.3
 //   this.water.water.position.y += 0.015
  //    this.water.baseMesh.position.y += 0.015
    }
 //            this.floor.rotation.y += xSpd
          this.diceMesh.rotation.x += Math.random() *0.1
          this.diceMesh.rotation.y += Math.random() * 0.1
      raycastSelector(this.camera, this.scene, this.raycaster)
            this.renderer.render(this.scene, this.camera)
        })
    }
addBody(gltf) {
  let model = gltf.scene
  console.log('gltf: ', gltf)
  this.model = model
  model.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true
    }
  })
  addToGUI([this.model.children[0]], 'lil guy')

//      let bodyMesh = new THREE.Mesh(model, mat)
     this.scene.add(model)
     model.position.y = -202
  if (inc % 2 == 0 ) {
     model.position.z = -20
     model.position.x = 10 - inc
  model.rotation.y = THREE.Math.degToRad(0)
  } else {
   model.position.z = 25
    model.position.x = 10 - inc
  model.rotation.y = THREE.Math.degToRad(145)

  }
  inc += 5
     model.rotation.x = THREE.Math.degToRad(0)
//             model.rotation.z = THREE.Math.degToRadk()
    model.scale.set(8.07, 8.07,8.07)
  //   this.mixer = new THREE.AnimationMixer(model)
 //    this.anim = this.mixer.clipAction(gltf.animations[3])
//  this.anim.setEffectiveTimeScale(0.5)
//           this.anim.setLoop(THREE.LoopOnce)
//          this.anim.clampWhenFinished = true
//    this.anim.play()

     this.legs = model
  return model
}

}


function onDocumentMouseClick(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    console.log('mouse pos:', mouse)
}

