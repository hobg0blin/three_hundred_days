// Global imports -
import * as THREE from 'three';
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import {createSun} from '../components/Three/sun.js'
import {createCamera} from '../components/Three/camera.js'
import {createLights} from '../components/Three/lights.js'
import {createRenderer} from '../components/Three/renderer.js'
import { createFog} from '../components/Three/fog.js'
import {createControls, addToGUI} from '../components/Three/controls.js'
import { getRandomInt} from '../utils/RandomInt.js'

const clock = new THREE.Clock()
let mouse = new THREE.Vector2()

// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Texture {
    constructor() {
      this.models = []
      this.render = this.render.bind(this) //bind to class instead of window object
      this.setup = this.setup.bind(this)
      this.addObjects = this.addObjects.bind(this)
        // set up scene
        this.setup()
        this.addObjects()
        this.render()


        //GROUND
//        document.addEventListener('mouseclick', onDocumentMouseClick, false)

}
setup() {
  // CAMERA
        // fov, aspect, near, far

      this.camera = createCamera()
    //get user camera
  //
        this.video = document.getElementById('video')
        this.videoTex = new THREE.VideoTexture(video)
   //     this.camera.up.set(0, 0, -1)
//      this.camera.lookAt(new THREE.Vector3(5000,200, 20000))
  //
        // SCENE & RENDER
        this.renderer = createRenderer()
        this.scene = new THREE.Scene();
//        this.camera.lookAt(this.scene.position)
        this.raycaster = new THREE.Raycaster()

        //LIGHTS
        const color = 0xFFFFFF
        const intensity = 1.5
       this.light = createLights({color: color, intensity: intensity})
        this.light[0].position.set(0, 100, 20)
      this.light[0].target.position.set(0, -5, 0)
      this.scene.add(this.light[0].target)
//        this.light[0].position.1etScalar(1)
        this.scene.add(this.light[0], new THREE.AmbientLight(color, 2))
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

        // CONTROLS
        this.controls = createControls(this.camera, this.renderer, {center: this.torusKnot, autorotate: true})
//        this.controls.target.set(0, 2, 0)
 //       this.controls.update()

    }

    addObjects() {
      //STUFF
      const numStreams = 40
      this.streams = new THREE.Group()
      for (let i = 0; i < numStreams; i++) {
        let sizeX = Math.random() * 40
        let sizeY= Math.random() * 40
        let sizeZ = Math.random() * 40
        let streamCube = new THREE.Mesh(new THREE.BoxGeometry(sizeX, sizeY, sizeZ), new THREE.MeshPhongMaterial({map: this.videoTex}))
        streamCube.position.set(Math.random()*40, Math.random() * 40, Math.random() * 40)
        console.log('stream cube: ', streamCube)
        this.streams.add(streamCube)
      }
      this.scene.add(this.streams)

    }

    render(time, i) {
   //   console.log('foo')
        let range = 1
        this.renderer.setAnimationLoop(() => {
        const xSpd =  -0.0008

       let elapsedTime = clock.getElapsedTime()
        this.streams.rotation.y += xSpd

    if (this.anim != undefined) {
            this.mixer.update(clock.getDelta())


    }
//      raycastSelector(this.camera, this.scene, this.raycaster)
          if (this.camera.target != undefined) {
          let worldPos = new THREE.Vector3()
 //         this.camera.target.getWorldPosition(worldPos)
//            this.camera.lookAt(worldPos)
          }
            this.renderer.render(this.scene, this.camera)
        })
    }
}


function onDocumentMouseClick(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    console.log('mouse pos:', mouse)
}

