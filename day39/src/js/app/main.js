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
      let ski = new THREE.PlaneGeometry(2, 20)
      let skiMat = new THREE.MeshPhongMaterial({color: 'red', wireframe: true})
      let ski1 = new THREE.Mesh(ski, skiMat)
      let ski2 = ski1.clone()
      this.skier = [ski1, ski2]
      this.scene.add(ski1, ski2)
        ski1.rotation.x = -Math.PI /2
        ski2.rotation.x = -Math.PI /2
        ski1.position.set(3, -175, -95)
        ski2.position.set(16, -175, -95)

            let myGuy = importGLTFModel('models/AnimatedHuman/AnimatedHuman.glb', this.addBody)
      let jump = new THREE.PlaneGeometry(20, 400, 1, 20)
      console.log('skier: ', this.skier)
      let jumpInc = 10
      console.log('jump loop')
      for (let i = 10; i >=0 ; i-=1) {
        console.log('loop')
        let oldPosY = jump.attributes.position.getY(41-i)
        let oldPosX = jump.attributes.position.getX(41-i)
        let oldPosZ = jump.attributes.position.getZ(41-i)
        console.log('old pos 1: ', oldPosY)
        if (i %2) {
         jump.attributes.position.setY(41-i, oldPosY + jumpInc/2)
    } else {

         jump.attributes.position.setY(41-i, oldPosY + jumpInc/2 - 10)
    }
         jump.attributes.position.setZ(41-i, oldPosZ + jumpInc)
        jumpInc += 10
      }
      jump.attributes.position.needsUpdate = true
      jump.computeVertexNormals()
      let jumpMesh = new THREE.Mesh(jump, skiMat)
      jumpMesh.position.set(10, -300, 15)
      jumpMesh.rotation.x = THREE.Math.degToRad(-45)
      console.log('jump mesh: ', jumpMesh)

      this.scene.add(jumpMesh)

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
          if( this.model != undefined) {
for (let obj of this.skier) {
    if (obj.position.z < 85) {
      obj.position.y -= (1.1)
      inc += 0.001
    } else if (obj.position.z < 230) {
      obj.position.y += 0.5 + inc/10
    } else {
      obj.position.y -= (0.7 + inc)
      inc += 0.01
    }
    obj.position.z += 0.75 + inc
  }
  }
    if (this.anim != undefined) {
//            this.mixer.update(clock.getDelta())


    }
 //            this.floor.rotation.y += xSpd
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
  this.skier.push(model)
   model.position.y = -175
   model.position.z = -95
    model.position.x = 10 - inc
  model.rotation.y = THREE.Math.degToRad(65)

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

