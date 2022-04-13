// Global imports -
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { randomColor } from 'randomcolor'
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
import { createParticles} from '../components/Three/particleSystem.js'
import { deadTree} from '../components/Three/deadtree.js'
import { createLowPolyTerrain } from '../components/Three/lowPolyTerrain.js'
import { morph} from '../components/Three/morph.js'
import {createControls, addToGUI} from '../components/Three/controls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import {raycastSelector, onPointerMove} from '../components/Three/raycastSelector'
import {initPhysics, createPhysicsObjects, initInput, updatePhysics} from '../components/Three/Physics/PhysicsUtils.js'
import {orbit} from '../components/Three/Physics/orbit.js'
import {createBall} from '../components/Three/ball.js'
import {createFloor} from '../components/Three/Floor.js'
import randomstring from 'randomstring'

//PostProcessing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js';

//masking
import { TexturePass } from 'three/examples/jsm/postprocessing/TexturePass.js';
import { ClearPass } from 'three/examples/jsm/postprocessing/ClearPass.js';
import { MaskPass, ClearMaskPass } from 'three/examples/jsm/postprocessing/MaskPass.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';

//Effects
import { AnaglyphEffect } from 'three/examples/jsm/effects/AnaglyphEffect.js';

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
        this.camera.focalLength = 3
   //     this.camera.up.set(0, 0, -1)
        // SCENE & RENDER
        this.renderer = createRenderer()
        this.scene = new THREE.Scene();
        this.raycaster = new THREE.Raycaster()
        document.addEventListener('mousemove', onPointerMove)

        //LIGHTS
        const color = 0xFFFFFF
        const intensity = 1
        this.light = createLights({color: color, intensity: intensity})
        this.light[0].position.set(0, 100, 5)
 //       this.light[0].target.position.set(0, 0, 0)
//        this.scene.add(this.light[0].target)
//        this.light[0].position.setScalar(1)
//        this.scene.add( new THREE.AmbientLight(color, 0.5))
//        this.scene.add( this.light[0])
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
        let hankTex = new THREE.CubeTextureLoader().load(['textures/hank.jpg', 'textures/hank.jpg','textures/hank.jpg','textures/hank.jpg','textures/hank.jpg','textures/hank.jpg',])
        this.scene.background = hankTex

//        this.scene.fog = createFog(0xfcba03, 1, 1000)
        // CONTROLS
  this.controls = createControls(this.camera, this.renderer, {center: {x: 0, y: 0, z: 0}, autorotate: true})
         }


    addObjects() {
//      createSun(this.scene, this.renderer)

      const geometry = new THREE.SphereGeometry( 25, 32, 16 );
        this.spheres = []
      // 500 reflectors: a bad time
				for ( let i = 0; i < 5; i ++ ) {

          const mesh = new Reflector( geometry, {color: 'blue', textureWidth: window.innerWidth*window.devicePixelratio, textureHeight: window.innerHeight*window.devicePixelRatio} );

					mesh.position.x = Math.random() * 100 - 5;
					mesh.position.y = Math.random() * 100 - 5;
					mesh.position.z = Math.random() * 100 - 5;

					mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 4 + 1;

					this.scene.add( mesh );

					this.spheres.push( mesh );

				}

				this.object = new THREE.Object3D();
				this.scene.add( this.object );
            // test reflector
 //     let floor = createFloor({width: 100, height: 100, segments: 25, range:10})
//        this.scene.add(floor)
      //        Effects

				const width = window.innerWidth || 2;
				const height = window.innerHeight || 2;

				this.anaEffect = new AnaglyphEffect( this.renderer );
				this.anaEffect.setSize( width, height );

      // PostProcessing
      const parameters = {
					stencilBuffer: true
				};
				const renderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, parameters );
				this.composer = new EffectComposer( this.renderer, renderTarget );
				this.composer.addPass( new RenderPass( this.scene, this.camera ) );



    }
    animate() {

				const timer = 0.0001 * Date.now();
				for ( let i = 0, il = this.spheres.length; i < il; i ++ ) {

					const sphere = this.spheres[ i ];

					sphere.position.x = 25 * Math.cos( timer + i );
					sphere.position.y = 105 * Math.cos( timer + i );
//					sphere.position.z = 25 * Math.sin( timer + i * 1.1 );

				}

        this.controls.update()
//        this.renderer.clear()
        this.render()
    }


    render() {
          // weird - postproc has to be in separate function from composer.render - some weird dependency/flow stuff going on there
          this.composer.render()
        this.anaEffect.render(this.scene, this.camera)
//          this.renderer.render(this.scene, this.camera)
          requestAnimationFrame(this.animate)

            //TODO: update to proper animation loop per https://discoverthreejs.com/book/first-steps/animation-loop/#timing-in-the-animation-system

//            console.log('camera pos: ', this.camera.position)
  //animate shaders
    //            this.updatePhysics(delta)
          //j:w

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

