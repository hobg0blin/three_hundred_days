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
import { morph} from '../components/Three/morph.js'
import {createControls, addToGUI} from '../components/Three/controls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import {raycastSelector, onPointerMove} from '../components/Three/raycastSelector'
import {initPhysics, createPhysicsObjects, initInput, updatePhysics} from '../components/Three/Physics/PhysicsUtils.js'
import {orbit} from '../components/Three/Physics/orbit.js'
import { importFBXModel } from '../components/Three/importFBXModel.js'
import { importGLTFModel } from '../components/Three/importGLTFModel.js'
import { createWater} from '../components/Three/water.js'
import { getRandomInt } from '../components/utils/RandomInt.js'
const clock = new THREE.Clock()
let mouse = new THREE.Vector2()

let inc = true

// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Texture {
    constructor() {
      this.render = this.render.bind(this) //bind to class instead of window object
      this.setup = this.setup.bind(this)
      this.addObjects = this.addObjects.bind(this)
      this.addBody = this.addBody.bind(this)
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
//        this.initPhysics()
 //       this.createPhysicsObjects()
  //      this.initInput(this.raycaster)
        this.render()
      })


        //GROUND
//        document.addEventListener('mouseclick', onDocumentMouseClick, false)

}

setup() {
  // CAMERA
        // fov, aspect, near, far

        this.camera = createCamera()
  this.camera.lookAt(-45, 0, 0)
   //     this.camera.up.set(0, 0, -1)
        // SCENE & RENDER
        this.renderer = createRenderer()
        this.scene = new THREE.Scene();
        this.raycaster = new THREE.Raycaster()
        document.addEventListener('mousemove', onPointerMove)

        //LIGHTS
        const color = 0xFFFFFF
        const intensity = 1.0
        this.light = createLights({color: color, intensity: intensity})
        this.light[0].position.set(0, 30, 50)
 //       this.light[0].target.position.set(0, 0, 0)
//        this.scene.add(this.light[0].target)
//        this.light[0].position.setScalar(1)
      this.scene.add( new THREE.AmbientLight(color, 0.5))
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
  this.controls = createControls(this.camera, this.renderer)
  let water = createWater()
  this.scene.add(water.baseMesh)
  let reflector = new Reflector(water.baseMesh.geometry, {color: 0x91e4ff,    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio})
  reflector.rotation.x = Math.PI * -0.5
//  this.scene.add(reflector)
    }


    addObjects() {
      let geometry = new RoundedBoxGeometry(2, 2, 4, 4, 0.7)
      let mat = new THREE.MeshPhongMaterial({color: 'white'})

                //animations
      this.mixers = []
      this.models = []
      this.modX = -25
      this.modZ = 0
      this.animNum = 0
      const localPlane = new THREE.Plane( new THREE.Vector3( 0, - 1, 0 ), 14 );
      const globalPlane = new THREE.Plane( new THREE.Vector3( - 1, 0, 0 ), 0.1 );
		// ***** Clipping setup (renderer): *****
      const globalPlanes = [ globalPlane ],
      Empty = Object.freeze( [] );
      this.renderer.clippingPlanes = Empty; // GUI sets it to globalPlanes
      this.renderer.localClippingEnabled = true;
      this.bodyMat = new THREE.MeshPhongMaterial({ color: 'hotpink', clippingPlanes: [localPlane], clipShadows: true, shininess: 100})

      for (let i = 0; i < 7; i++) {
        importFBXModel('models/AnimatedHuman/FBX/AnimatedHumanColors.fbx',this.addBody)
      }
// clipping GUI
      //
      const renderer = this.renderer
      const material = this.bodyMat
const gui = new GUI(),
					folderLocal = gui.addFolder( 'Local Clipping' ),
					propsLocal = {

						get 'Enabled'() {

							return renderer.localClippingEnabled;

						},
						set 'Enabled'( v ) {

							renderer.localClippingEnabled = v;

						},

						get 'Shadows'() {

							return material.clipShadows;

						},
						set 'Shadows'( v ) {

							material.clipShadows = v;

						},

						get 'Plane'() {

							return localPlane.constant;

						},
						set 'Plane'( v ) {

							localPlane.constant = v;

						}

					},

					folderGlobal = gui.addFolder( 'Global Clipping' ),
					propsGlobal = {

						get 'Enabled'() {

							return renderer.clippingPlanes !== Empty;

						},
						set 'Enabled'( v ) {

							renderer.clippingPlanes = v ? globalPlanes : Empty;

						},

						get 'Plane'() {

							return globalPlane.constant;

						},
						set 'Plane'( v ) {

							globalPlane.constant = v;

						}

					};
        this.localPlane = localPlane

				folderLocal.add( propsLocal, 'Enabled' );
				folderLocal.add( propsLocal, 'Shadows' );
				folderLocal.add( propsLocal, 'Plane', 1, 10 );

				folderGlobal.add( propsGlobal, 'Enabled' );
				folderGlobal.add( propsGlobal, 'Plane', - 0.4, 3 );

				// Start

        }

    render(time, i) {
        this.renderer.setAnimationLoop(() => {

        const xSpd = time * 0.00015
            //TODO: update to proper animation loop per https://discoverthreejs.com/book/first-steps/animation-loop/#timing-in-the-animation-system

//            console.log('camera pos: ', this.camera.position)
            let delta = clock.getDelta()
          if (this.mixers.length > 0) {
              for (let mixer of this.mixers) {
              mixer.update(delta)
              }
            }
        if  (this.models.length > 0) {
          if (this.localPlane) {
            console.log('localPlane', this.localPlane.constant)
          if (this.localPlane.constant > 14) {
            inc = false
            this.localPlane.constant = 13.9
          }
          if (this.localPlane.constant < 2) {
            inc = true
          }
          inc ? this.localPlane.constant+=0.01 : this.localPlane.constant-=0.01;
        }

          for (let model of this.models) {
            model.traverse(child => {
              if (child.geometry  != undefined) {
                morph(child.geometry, 50)
              }
            })
          }
        }

//            this.updatePhysics(delta)
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
    model.children.splice(2, 1)
    model.children.splice(3, 1)
    model.scale.set(0.01, 0.01, 0.01)//
    this.models.push(model)
//    let mixer = new THREE.Animation//Mixer(model)
//    this.mixers.push(mixer)
//    let newAnim = mixer.clipAction(//model.animations[2])
////    newAnim.setEffectiveTimeScale(0.5)
//    newAnim.play()
    this.scene.add(model)
    return model
  }
  addBody(output) {
    console.log('output: ', output)

    let model = output
    model.traverse(child => {
      if (child.geometry != undefined) {
        child.material = this.bodyMat

      }
    })
    model.position.y = 1
    model.scale.set(0.02, 0.02, 0.02)
    model.position.x = this.modX
    model.position.z = this.modZ
      this.modX+=5
    model.rotation.y = THREE.MathUtils.degToRad(-45)
    model.orbitRadius = getRandomInt(20, 40)
    this.model = model
    //remove prebuilt lighting
//    this.model.children.splice(3, 1)
//    model.scale.set(0.001, 0.001, 0.001)
    let mixer = new THREE.AnimationMixer(model)
    let newAnim = mixer.clipAction(output.animations[this.animNum])
//    newAnim.setLoop(THREE.LoopOnce)
//    newAnim.clampWhenFinished = true
    this.mixers.push(mixer)
    newAnim.setEffectiveTimeScale(0.5)
    newAnim.play()
    this.models.push(model)
    this.scene.add(model)
    this.animNum++
    return model
}
}



function onDocumentMouseClick(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    console.log('mouse pos:', mouse)
}

