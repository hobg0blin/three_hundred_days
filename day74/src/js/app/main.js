// Global imports -
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import {createSun} from '../components/Three/sun.js'
import {createCamera} from '../components/Three/camera.js'
import {createLights} from '../components/Three/lights.js'
import {createRenderer} from '../components/Three/renderer.js'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'
import { createFog} from '../components/Three/fog.js'
import {createControls, addToGUI} from '../components/Three/controls.js'
import {raycastSelector, onPointerMove} from '../components/Three/raycastSelector'
import {initPhysics, createPhysicsObjects, initInput, updatePhysics} from '../components/Three/Physics/PhysicsUtils.js'
import {orbit} from '../components/Three/Physics/orbit.js'
import { importFBXModel } from '../components/Three/importFBXModel.js'
import { createWater} from '../components/Three/water.js'
import { getRandomInt } from '../components/utils/RandomInt.js'
const clock = new THREE.Clock()
let mouse = new THREE.Vector2()

// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Texture {
    constructor() {
      this.render = this.render.bind(this) //bind to class instead of window object
      this.setup = this.setup.bind(this)
      this.addObjects = this.addObjects.bind(this)
      this.addWhale = this.addWhale.bind(this)
      this.addBird = this.addBird.bind(this)
      this.initPhysics = initPhysics.bind(this)
      this.createPhysicsObjects = createPhysicsObjects.bind(this)
      this.initInput = initInput.bind(this)
      this.updatePhysics = updatePhysics.bind(this)
        // set up scene
      Ammo().then(AmmoLib => {
        Ammo = AmmoLib
        this.setup()
        this.addObjects()
        this.initPhysics()
        this.createPhysicsObjects()
        this.initInput(this.raycaster)
        this.render()
      })


        //GROUND
//        document.addEventListener('mouseclick', onDocumentMouseClick, false)

}

setup() {
  // CAMERA
        // fov, aspect, near, far

        this.camera = createCamera()
   //     this.camera.up.set(0, 0, -1)
        // SCENE & RENDER
        this.renderer = createRenderer()
        this.scene = new THREE.Scene();
        this.raycaster = new THREE.Raycaster()
        document.addEventListener('mousemove', onPointerMove)

        //LIGHTS
        const color = 0xFFFFFF
        const intensity = 1.5
        this.light = createLights({color: color, intensity: intensity})
        this.light[0].position.set(0, 30, -50)
 //       this.light[0].target.position.set(0, 0, 0)
//        this.scene.add(this.light[0].target)
//        this.light[0].position.setScalar(1)
//      this.scene.add( new THREE.AmbientLight(color, 0.1))
      this.scene.add( this.light[0])
        const helper = new THREE.DirectionalLightHelper(this.light[0], 5, 0xff0008)
//      this.scene.add(helper)

				// lights
//				const mainLight = new THREE.PointLight(0xfcba03,  1.25, 1 );
//				mainLight.position.set(0, 50, 0);
////				this.scene.add( mainLight );
//				const greenLight = new THREE.PointLight( 0x00ff00, 1.25, 1000 );
//				greenLight.position.set( 50, 0, 0 );
//				this.scene.add( greenLight );
//
//				const redLight = new THREE.PointLight( 'hotpink', 1.25, 1000 );
//				redLight.position.set( - 50, 0, 0 );
//				this.scene.add( redLight );
//
//				const blueLight = new THREE.PointLight( 'aqua', 1.25, 1000 );
//				blueLight.position.set( 0, 0, 150 );
//				this.scene.add( blueLight );
//
        //BACKGROUND & FOG
        let backgroundColor = new THREE.Color(0xfcba03)
//       this.scene.background = backgroundColor
        let textureLoader = new THREE.TextureLoader()
       let backgroundImg = textureLoader.load('studio-bg.jpg')
      this.scene.background = backgroundImg
//        this.scene.fog = createFog(0xfcba03, 20, 200)
        // CONTROLS
  this.controls = createControls(this.camera, this.renderer, {center: {position: { x: 0, y: 0, z: -10}}, autorotate: true})
    }

    addObjects() {
      let geometry = new RoundedBoxGeometry(2, 2, 4, 4, 0.7)
      let mat = new THREE.MeshPhongMaterial({color: 'white'})

                //animations
      this.mixers = []
      this.models = []
      for (let i = 0; i < 5; i++) {
      }

      let tooth = new THREE.Mesh(geometry, mat)
      for (let i = -10; i < 10; i++) {
        let newTooth = tooth.clone()
        if (i % 2 == 0) {
          newTooth.position.set(i + 2, 0, 4)
        } else {
          newTooth.position.set(i + 1, 0, -4)
        }
        this.scene.add(newTooth)
      }

      let lips = new THREE.Mesh(new THREE.TorusGeometry(8, 2, 24, 12), new THREE.MeshPhongMaterial({color: 'red'}))
      lips.scale.set(1.5, 1, 1)
      lips.rotateX(THREE.MathUtils.degToRad(90))
      this.scene.add(lips)
    }

    render(time, i) {
        this.renderer.setAnimationLoop(() => {

        const xSpd = time * 0.00015
            //TODO: update to proper animation loop per https://discoverthreejs.com/book/first-steps/animation-loop/#timing-in-the-animation-system

//            console.log('camera pos: ', this.camera.position)
            let delta = clock.getDelta()
          if (this.mixers.length > 0) {
//              console.log('model: ', this.model)
              for (let mixer of this.mixers) {
               mixer.update(delta)
              }
              for (let model of this.models) {

               orbit(model, model.orbitRadius, model.orbitSpeed, 0, clock.getElapsedTime())
              }
            }

            this.updatePhysics(delta)
          //j:w
          //this.controls.update()

 //            this.floor.rotation.y += xSpd
      raycastSelector(this.camera, this.scene, this.raycaster)
            this.renderer.render(this.scene, this.camera)
        })
    }
  addBird(model) {
    model.position.y = getRandomInt(10, 20)
    model.position.z = getRandomInt(-5, 5)
    model.rotation.y = THREE.MathUtils.degToRad(-45)
    model.orbitSpeed = Math.random()
    model.orbitRadius = getRandomInt(20, 60)
    //remove prebuilt lighting
    model.children.splice(1,1)
    console.log('bird children: ', model.children)
    model.children.splice(2, 1)
    model.children.splice(3, 1)
    model.scale.set(0.01, 0.01, 0.01)
    this.models.push(model)
    let mixer = new THREE.AnimationMixer(model)
    this.mixers.push(mixer)
    let newAnim = mixer.clipAction(model.animations[2])
//    newAnim.setEffectiveTimeScale(0.5)
    newAnim.play()
    this.scene.add(model)
    return model
  }
  addWhale(model) {
    model.position.y = 1
    model.position.x = Math.random() * 20
    model.rotation.y = THREE.MathUtils.degToRad(-45)
    model.orbitRadius = getRandomInt(20, 40)
    this.model = model
    //remove prebuilt lighting
    this.model.children.splice(0,1)
    this.model.children.splice(3, 2)
    model.orbitSpeed = Math.random() / 2
//    this.model.children.splice(3, 1)
    model.scale.set(0.001, 0.001, 0.001)
    let mixer = new THREE.AnimationMixer(model)
    let newAnim = mixer.clipAction(model.animations[1])
    this.mixers.push(mixer)
    newAnim.setEffectiveTimeScale(0.5)
    newAnim.play()
    this.models.push(model)
    this.scene.add(model)
    return model
}
}



function onDocumentMouseClick(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    console.log('mouse pos:', mouse)
}

