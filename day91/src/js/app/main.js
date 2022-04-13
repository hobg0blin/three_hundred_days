// Global imports -
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { randomColor } from 'randomcolor'
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import {getRandomInt} from '../components/utils/RandomInt.js'
import {createCamera} from '../components/Three/camera.js'
import {createLights} from '../components/Three/lights.js'
import {createRenderer} from '../components/Three/renderer.js'
import { createFog} from '../components/Three/fog.js'
import { deadTree} from '../components/Three/deadtree.js'
import { createLowPolyTerrain } from '../components/Three/lowPolyTerrain.js'
import { morph} from '../components/Three/morph.js'
import {createControls, addToGUI} from '../components/Three/controls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import {initPhysics, createPhysicsObjects, initInput, updatePhysics} from '../components/Three/Physics/PhysicsUtils.js'
import {orbit} from '../components/Three/Physics/orbit.js'
import {createBall} from '../components/Three/ball.js'
import {createFloor} from '../components/Three/Floor.js'
import {createTransmissiveMaterial} from '../components/Three/transmissiveMaterial.js'
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
        //BACKGROUND & FOG
        let backgroundColor = new THREE.Color(0xfcba03)
//       this.scene.background = backgroundColor
        this.textureLoader = new THREE.TextureLoader()
//        let backgroundImg = this.textureLoader.load('textures/backrooms.png')
//        this.scene.background = backgroundImg

//        this.scene.fog = createFog(0xfcba03, 1, 1000)
        // CONTROLS
  this.controls = createControls(this.camera, this.renderer, {center: {x: 0, y: 0, z: 0}, autorotate: true})
     }


    addObjects() {
      //background
      let backrooms = this.textureLoader.load('textures/backrooms.png')
      let bgPlane = new THREE.PlaneGeometry(500, 500)
      let bgMat = new THREE.MeshStandardMaterial({emissiveMap: backrooms, emissive: 0xFFFFFF, emissiveIntensity: 1})
      let bgMesh = new THREE.Mesh(bgPlane, bgMat)
      bgMesh.position.set(0, 0, -200)

      //bgMesh.rotation.x = THREE.MathUtils.degToRad(-14)
      this.scene.add(bgMesh)

      let transmissiveMat = createTransmissiveMaterial({ opacity: 0.9, specularIntensity: 2, thickness: 1, transmission: 1, exposure: 0.1})
        this.tree = deadTree(2,transmissiveMat, 4)
        this.tree.position.set(15, -48, -150)
        this.scene.add(this.tree)
				this.composer = new EffectComposer( this.renderer);
				this.composer.addPass( new RenderPass( this.scene, this.camera ) );
        this.effect1 = new FilmPass(0.5, 0.5, 8, 0)
        this.composer.addPass(this.effect1)


    }
    animate() {

				const timer = 0.0001 * Date.now();
        this.tree.rotation.y += 0.01
        this.camera.position.z -= 0.2
        if (this.camera.position.x < 15) {
          this.camera.position.x += 0.06
        }
        if (this.camera.position.y > -48) {
          this.camera.position.y -= 0.06
        }
        if (parseInt(this.camera.rotation.x) > -10) {
          console.log('rotating')
        console.log('x rotation: ', this.camera.rotation.x)
//          this.camera.rotation.x -= 0.0001
        console.log('x rotation: ', this.camera.rotation.x)
        }
        //this.controls.update()
//        this.renderer.clear()
        this.render()
    }


    render() {
          // weird - postproc has to be in separate function from composer.render - some weird dependency/flow stuff going on there
          requestAnimationFrame(this.animate)
//          this.renderer.render(this.scene, this.camera)
          //composer rendering pass also has to take place after initial rendering pass
      // ok don't need regular rendering pass at all if using composer lol
          this.composer.render()
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

