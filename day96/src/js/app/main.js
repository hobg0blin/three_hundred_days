// Global imports -
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { randomColor } from 'randomcolor'
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import {getRandomInt} from '../components/utils/RandomInt.js'
import {createSky} from '../components/Three/sun.js'
import {createText} from '../components/Three/createText.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'
import {createCamera} from '../components/Three/camera.js'
import {createLights} from '../components/Three/lights.js'
import {createRenderer} from '../components/Three/renderer.js'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'
import { createFog} from '../components/Three/fog.js'
import { proceduralTree} from '../components/Three/proceduralTree.js'
import { morph} from '../components/Three/morph.js'
import {createControls, addToGUI} from '../components/Three/controls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import {raycastSelector, onPointerMove} from '../components/Three/raycastSelector'
import {initPhysics, createPhysicsObjects, initInput, updatePhysics} from '../components/Three/Physics/PhysicsUtils.js'
import {orbit} from '../components/Three/Physics/orbit.js'
import {createBall} from '../components/Three/ball.js'
import {createParticles, animate} from '../components/Three/particleSystem.js'
import {createSphere} from '../components/Three/ProceduralSphere/Sphere.js'
import randomstring from 'randomstring'

//PostProcessing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';


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
      this.addGUI = this.addGUI.bind(this)
      this.guiChanged = this.guiChanged.bind(this)
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
        this.camera.position.set(0, 25, 100)
        this.camera.lookAt(0, 0, 0)
   //     this.camera.up.set(0, 0, -1)
        // SCENE & RENDER
        this.renderer = createRenderer()
        this.scene = new THREE.Scene();
        this.raycaster = new THREE.Raycaster()

        //LIGHTS
        const color = 0xFFFFFF
        const intensity = 1
        this.light = createLights({color: color, intensity: intensity})
        this.light[0].position.set(0, 100, -80)
 //       this.light[0].target.position.set(0, 0, 0)
        this.scene.add(this.light[0])
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
				const blueLight = new THREE.PointLight( 'aqua', 1.25, 1000 );
				blueLight.position.set( 0, 0, 150 );
//				this.scene.add( blueLight );
//
        //BACKGROUND & FOG
        let backgroundColor = new THREE.Color(0xfcba03)
//       this.scene.background = backgroundColor
        this.textureLoader = new THREE.TextureLoader()
        let backgroundImg = this.textureLoader.load('studio-bg.jpg')
        this.scene.background = backgroundImg
//        this.scene.fog = createFog(0xfcba03, 1, 1000)
        // CONTROLS
  this.controls = createControls(this.camera, this.renderer)
         }


    addObjects() {
        const radius = 5;  // ui: radius
        const tubeRadius = 2;  // ui: tubeRadius
        const radialSegments = 8;  // ui: radialSegments
        const tubularSegments = 24;  // ui: tubularSegments
        const geometry = new THREE.TorusGeometry(
          radius, tubeRadius,
        radialSegments, tubularSegments);
        const mat = new THREE.MeshPhongMaterial({color: 'gold', shininess: 1000})
        let mesh = new THREE.Mesh(geometry, mat)
        let posX = 0;
        let posY = 0;
        for (let i = 0; i < 200; i++) {
          let newMesh = mesh.clone()
          newMesh.position.set(posX, posY, 0)
          if (i < 80) {
            posY -= 5
          } else if (i < 90) {
            posY -= 2.5
            posX += 5
          } else if (i < 100) {
            posY += 2.5
            posX += 5
          } else if (i < 180) {
            posY += 5
          } else if ( i < 190) {
            posY += 2.5
            posX -= 5
          } else {
            posY -= 2.5
            posX -= 5
          }
          this.scene.add(newMesh)


        }
                // test reflector
				this.composer = new EffectComposer( this.renderer );
				this.composer.addPass( new RenderPass( this.scene, this.camera ) );
        // (noise intensity, scanline intensity, scanline count, grayscale)
        this.effect1 = new AfterimagePass(0.99)
//        this.composer.addPass(this.effect1)
        this.addGUI()

    }
    addGUI() {

				/// GUI
        // sky FX
				this.effectController = {
					turbidity: 0.01,
					rayleigh: 0,
					mieCoefficient: 0.069,
					mieDirectionalG: 0.307,
					elevation: 5.5,
					azimuth: -180,
					exposure: this.renderer.toneMappingExposure
				};
//				const gui = new GUI();
//				gui.add( this.effectController, 'turbidity', 0.0, 20.0, 0.1 ).onChange( this.guiChanged );
//				gui.add( this.effectController, 'rayleigh', 0.0, 4, 0.001 ).onChange( this.guiChanged );
//				gui.add( this.effectController, 'mieCoefficient', 0.0, 0.1, 0.001 ).onChange( this.guiChanged );
//				gui.add( this.effectController, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( this.guiChanged );
//				gui.add( this.effectController, 'elevation', 0, 90, 0.1 ).onChange( this.guiChanged );
//				gui.add( this.effectController, 'azimuth', - 180, 180, 0.1 ).onChange( this.guiChanged );
//				gui.add( this.effectController, 'exposure', 0, 1, 0.0001 ).onChange( this.guiChanged );

//				this.guiChanged();
    }
    guiChanged() {

					const uniforms = this.sky.material.uniforms;
					uniforms[ 'turbidity' ].value = this.effectController.turbidity;
					uniforms[ 'rayleigh' ].value = this.effectController.rayleigh;
					uniforms[ 'mieCoefficient' ].value = this.effectController.mieCoefficient;
					uniforms[ 'mieDirectionalG' ].value = this.effectController.mieDirectionalG;

					const phi = THREE.MathUtils.degToRad( 90 - this.effectController.elevation );
					const theta = THREE.MathUtils.degToRad( this.effectController.azimuth );

					this.sun.setFromSphericalCoords( 1, phi, theta );

					uniforms[ 'sunPosition' ].value.copy( this.sun );

					this.renderer.toneMappingExposure = this.effectController.exposure;

				}

    animate() {

        this.render()
    }


    render(time, i) {
          // weird - postproc has to be in separate function from composer.render - some weird dependency/flow stuff going on there
          requestAnimationFrame(this.animate)
          this.renderer.render(this.scene, this.camera)
//			this.renderer.outputEncoding = THREE.sRGBEncoding;
//				this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
//				this.renderer.toneMappingExposure = 0.5;
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

