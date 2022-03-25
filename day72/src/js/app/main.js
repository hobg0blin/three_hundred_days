// Global imports -
import * as THREE from 'three';
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
const clock = new THREE.Clock()
let mouse = new THREE.Vector2()

// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Texture {
    constructor() {
      this.render = this.render.bind(this) //bind to class instead of window object
      this.setup = this.setup.bind(this)
      this.addObjects = this.addObjects.bind(this)
      this.addBody = this.addBody.bind(this)
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
        const color = 0xfcba03
        const intensity = 0.5
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
				const mainLight = new THREE.PointLight(0xfcba03,  1.25, 1 );
				mainLight.position.set(0, 50, 0);
//				this.scene.add( mainLight );
				const greenLight = new THREE.PointLight( 0x00ff00, 1.25, 1000 );
				greenLight.position.set( 50, 0, 0 );
				this.scene.add( greenLight );

				const redLight = new THREE.PointLight( 0xff0000, 1.25, 1000 );
				redLight.position.set( - 50, 0, 0 );
				this.scene.add( redLight );

				const blueLight = new THREE.PointLight( 0x7f7fff, 1.25, 1000 );
				blueLight.position.set( 0, 0, 150 );
				this.scene.add( blueLight );

        //BACKGROUND & FOG
        let backgroundColor = new THREE.Color(0x34c9eb)
//       this.scene.background = backgroundColor
        let textureLoader = new THREE.TextureLoader()
       let backgroundImg = textureLoader.load('studio-bg.jpg')
      this.scene.background = backgroundImg
//        this.scene.fog = createFog(0x9ab3b2, 40, 450)
        // CONTROLS
  this.controls = createControls(this.camera, this.renderer, {center: {position: { x: 0, y: 0, z: -10}}, autorotate: true})
    }

    addObjects() {
        let geometry
				geometry = new THREE.CircleGeometry( 40, 64 );
				let groundMirror = new Reflector( geometry, {
					clipBias: 0.003,
					textureWidth: window.innerWidth * window.devicePixelRatio,
					textureHeight: window.innerHeight * window.devicePixelRatio,
					color: 0x777777
				} );
				groundMirror.position.y = 1;
				groundMirror.rotateX( - Math.PI / 2 );
				this.scene.add( groundMirror );
				const planeBottom = createWater();
				planeBottom.water.rotateX( - Math.PI / 2 );
        planeBottom.water.position.y = 1
				this.scene.add( planeBottom.water );

                //animations
      let model = importFBXModel('models/AnimalsPack/FBX/bird.fbx', this.addBody)
    }

    render(time, i) {
        this.renderer.setAnimationLoop(() => {

        const xSpd = time * 0.00015
            //TODO: update to proper animation loop per https://discoverthreejs.com/book/first-steps/animation-loop/#timing-in-the-animation-system

//            console.log('camera pos: ', this.camera.position)
            let delta = clock.getDelta()
            if (this.mixer != undefined) {
//              console.log('model: ', this.model)
               this.mixer.update(delta)
               orbit(this.model, 20, 0.5, 0, clock.getElapsedTime())
            }

            this.updatePhysics(delta)
          //j:w
          //this.controls.update()

 //            this.floor.rotation.y += xSpd
      raycastSelector(this.camera, this.scene, this.raycaster)
            this.renderer.render(this.scene, this.camera)
        })
    }
  addBody(model) {
    model.position.y = 5
    this.model = model
    //remove prebuilt lighting
    this.model.children.splice(1,1)
    this.model.children.splice(2, 1)
    this.model.children.splice(3, 1)
    model.scale.set(0.03, 0.03, 0.03)
    this.mixer = new THREE.AnimationMixer(model)
    this.anim = this.mixer.clipAction(model.animations[2])
//    this.anim.loop(THREE.LoopRepeat)
    this.anim.setEffectiveTimeScale(0.5)
    this.anim.play()
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

