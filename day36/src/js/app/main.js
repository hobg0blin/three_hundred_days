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
import randomColor from 'randomcolor'


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
        this.scene.fog = createFog(0x9ab3b2, 40, 450)
        // CONTRO4S
        //GROUND
//        let groundMesh = createSphere({width: 550, height: 500, segments: 15, range: 0})
//        this.scene.add(groundMesh)
this.rain = createRain(8000)
this.scene.add(this.rain);
for (let i = 0; i < 40; i++) {
let cloud = createCloud()
cloud.scale.set(getRandomInt(20, 30), getRandomInt(20, 30), getRandomInt(20, 30))
this.scene.add(cloud)
cloud.position.set(getRandomInt(-400, 400), getRandomInt(180, 220),getRandomInt(-400,400))
}
let floor = createFloor({width: 1000, height: 1000, segments: 25, range: 10})
floor.position.y = -202
this.addBody = this.addBody.bind(this)
console.log('addBody', this.addBody)
this.scene.add(floor)
  this.human =   importGLTFModel('models/AnimatedHuman/AnimatedHuman.glb', this.addBody)
this.trees = []
for (let i = 0; i < 19; i++) {
  let tree = createTree()
  this.scene.add(tree)
tree.scale.set(10, getRandomInt(15, 20), 10)
tree.position.y = -200
  tree.position.x = getRandomInt(-400, 400)
  tree.position.z = getRandomInt(-400, 400)
  tree.castShadow = true
  this.trees.push(tree)
}
  let tree = createTree()
    tree.scale.set(10, getRandomInt(25, 30), 10)
  tree.position.y = -205
  tree.position.x = 25
  tree.position.z = -40
  tree.castShadow = true
  console.log('tree: ', tree)
  this.scene.add(tree)


addToGUI(this.trees, 'Tree')
let water = createWater()
this.water = water
this.scene.add(water.water)
water.water.position.y  = -210
this.scene.add(water.baseMesh)
water.baseMesh.position.y = -210.5
this.controls = createControls(this.camera, this.renderer, {light: this.light[0]})
console.log('light: ', this.light[0])

      this.controls.target = new THREE.Vector3(0, -200, 0)
            this.render = this.render.bind(this) //bind to class instead of window object
        //if I need mouse pos
//        document.addEventListener('mouseclick', onDocumentMouseClick, false)

}
    render(time, i) {
   //   console.log('foo')
        let range = 1
        this.renderer.setAnimationLoop(() => {

        const xSpd = time * 0.00015
            //TODO: update to proper animation loop per https://discoverthreejs.com/book/first-steps/animation-loop/#timing-in-the-animation-system

//            console.log('camera pos: ', this.camera.position)

 //            this.controls.update()
    if (this.anim != undefined) {
            this.mixer.update(clock.getDelta())
//      this.model.position.z -= 0.3
 //   this.water.water.position.y += 0.015
  //    this.water.baseMesh.position.y += 0.015
    }
    animateRain(this.rain.geometry)
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
     model.position.y = -202
     model.position.z = -30
     model.position.x = 65
  model.rotation.y = THREE.Math.degToRad(-90)
     model.rotation.x = THREE.Math.degToRad(-15)
//             model.rotation.z = THREE.Math.degToRadk()
    model.scale.set(8.07, 8.07,8.07)
     this.mixer = new THREE.AnimationMixer(model)
     this.anim = this.mixer.clipAction(gltf.animations[3])
  this.anim.setEffectiveTimeScale(0.5)
//           this.anim.setLoop(THREE.LoopOnce)
//          this.anim.clampWhenFinished = true
    this.anim.play()

     this.legs = model
}

}


function onDocumentMouseClick(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    console.log('mouse pos:', mouse)
}

