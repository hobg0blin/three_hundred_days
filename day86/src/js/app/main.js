// Global imports -
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import {getRandomInt} from '../components/utils/RandomInt.js'
import {createSun} from '../components/Three/sun.js'
import {createText} from '../components/Three/createText.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'
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
import {createBall} from '../components/Three/ball.js'
import randomstring from 'randomstring'

//PostProcessing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';


import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { DotScreenShader } from 'three/examples/jsm/shaders/DotScreenShader.js';

const clock = new THREE.Clock()
let mouse = new THREE.Vector2()

let oldTime = 0
let inc = true

// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Texture {
    constructor() {
      this.render = this.render.bind(this) //bind to class instead of window object
      this.setup = this.setup.bind(this)
      this.animate = this.animate.bind(this)
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
        const intensity = 1.5
        this.light = createLights({color: color, intensity: intensity})
        this.light[0].position.set(0, 100, 50)
 //       this.light[0].target.position.set(0, 0, 0)
//        this.scene.add(this.light[0].target)
//        this.light[0].position.setScalar(1)
        this.scene.add( new THREE.AmbientLight(color, 2.5))
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
				const blueLight = new THREE.PointLight( 'aqua', 1.25, 1000 );
				blueLight.position.set( 0, 0, 150 );
//				this.scene.add( blueLight );
//
        //BACKGROUND & FOG
        let backgroundColor = new THREE.Color(0xfcba03)
//       this.scene.background = backgroundColor
        this.textureLoader = new THREE.TextureLoader()
        let backgroundImg = this.textureLoader.load('studio-bg.jpg')
//        this.scene.background = backgroundImg
//        this.scene.fog = createFog(0xfcba03, 1, 1000)
        // CONTROLS
  this.controls = createControls(this.camera, this.renderer)
         }


    addObjects() {

				this.object = new THREE.Object3D();
				this.scene.add( this.object );
        // Make compy386
        let monitorGeo = new RoundedBoxGeometry(2, 2, 2.5)
        let monitorMat = new THREE.MeshPhongMaterial({color: 'grey', shininess:10000})
		    let monitor = new THREE.Mesh(monitorGeo, monitorMat)
        this.object.add(monitor)
        let screenGeo = new THREE.PlaneGeometry(1.75, 1.75)
      let screen = new Reflector(screenGeo, {
            color: 0x91e4ff,
            textureWidth: window.innerWidth * window.devicePixelRatio,
            textureHeight: window.innerHeight * window.devicePixelRatio,
            clipBias: 0.003,
            recursion: 2
        })
        screen.rotation.x = Math.PI*2
        screen.position.z = 1.251
        this.object.add(screen)
        let standNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1, 4), monitorMat)
        standNeck.position.set(0, -1, -0.5)
        this.object.add(standNeck)
        let base = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 3), monitorMat)
        base.position.y = -1.5
        this.object.add(base)

          this.object.scale.set(4, 4, 4)
        // test reflector
        let test =  createBall(1, 4, 'red')
        test.position.z = 4
//        this.object.add(test)

				this.composer = new EffectComposer( this.renderer );
				this.composer.addPass( new RenderPass( this.scene, this.camera ) );

				const effect1 = new ShaderPass( DotScreenShader );
				effect1.uniforms[ 'scale' ].value = 30;
				this.composer.addPass( effect1 );

				this.effect2 = new ShaderPass( RGBShiftShader );
				this.effect2.uniforms[ 'amount' ].value = 0.004;
 				this.composer.addPass( this.effect2 );
      console.log('camera: ', this.camera)
//      const effect3 = new BokehPass( this.scene, this.camera, {maxblur: 50, aspect: 1, focus: 4, aperture: 0.00002});
   //  this.composer.addPass( effect3 );
      let charX = -10
      let charY = -1
      this.characters = []
      let charMat = new THREE.MeshPhongMaterial({color: 'lime', shininess: 100})
      for (let i = 0; i < 199; i++) {
        let char = randomstring.generate({length: 1, charset: 'hex'})
        let charMesh = createText(char, helvetiker, charMat)
        charMesh.position.x = charX
        charMesh.position.y = charY - 5
        charMesh.position.z = 10
        charMesh.scale.set(0.04, 0.04, 0.04)
        charY += 1.5
        if (charY > 14.5) {
          charY = getRandomInt(1, 3)*1
          charX += 1
        }
      this.scene.add(charMesh)
      this.characters.push(charMesh)
      }
      const effect4 = new AfterimagePass(0.6)
       this.composer.addPass( effect4 );



    }
    animate() {
        this.object.rotation.y += 0.005
       // this.object.rotation.x += 0.0005
        for (let character of this.characters) {
          if (character.position.y < -5) {
            character.position.y = 10
          } else {
            character.position.y -= Math.random() *  0.5
          }
        }


        this.render()
    }


    render(time, i) {
          // weird - postproc has to be in separate function from composer.render - some weird dependency/flow stuff going on there
          requestAnimationFrame(this.animate)
          this.renderer.render(this.scene, this.camera)
          this.composer.render()
            //TODO: update to proper animation loop per https://discoverthreejs.com/book/first-steps/animation-loop/#timing-in-the-animation-system

//            console.log('camera pos: ', this.camera.position)
  //animate shaders
    //            this.updatePhysics(delta)
          //j:w
          //this.controls.update()

 //            this.floor.rotation.y += xSpd
//      raycastSelector(this.camera, this.scene, this.raycaster)
    }

   addBody(output) {

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

