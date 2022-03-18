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
      const textureLoader = new THREE.TextureLoader()

      //Fan Blades
      this.pivot = new THREE.Group()
      this.pivot.position.set(0, 0, 0)
      let numBlades = 3

      this.blades = []
      this.bladeRadius = 30
      for (let i =0; i < numBlades; i++) {
        let coneGeo = new THREE.ConeGeometry(this.bladeRadius, 10, 3)
        console.log('cone Geo: ', coneGeo)
        let coneMat = new THREE.MeshPhongMaterial({ color: 'black'})
        let coneMesh = new THREE.Mesh(coneGeo, coneMat)
        console.log('cone mesh: ', coneMesh)
        this.pivot.add(coneMesh)
        this.blades.push(coneMesh)
      }
      this.blades[0].position.set(-30, 0, 0)
      this.blades[0].rotation.y = THREE.MathUtils.degToRad(90)
this.blades[0].rotation.x = Math.PI/2
      this.blades[1].position.set(15, 26, 0)
      this.blades[1].rotation.y = THREE.MathUtils.degToRad(90)
this.blades[1].rotation.x = Math.PI/2
      this.blades[2].position.set(15, -26, 0)
      this.blades[2].rotation.y = THREE.MathUtils.degToRad(90)
this.blades[2].rotation.x = Math.PI/2
      let pivotPoint = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 8), new THREE.MeshStandardMaterial({color: 'red'}))
      let innerRadius = 40
      let outerRadius = 50
      let thetaSegments = 20
      const ringGeo = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments)
      const ringMat = new THREE.MeshPhongMaterial({color: 'silver'})
      const ringMesh = new THREE.Mesh(ringGeo, ringMat)
      this.scene.add(ringMesh)
      this.scene.add(pivotPoint)
      this.scene.add(this.pivot)
    }

    render(time, i) {
   //   console.log('foo')
        let range = 1
        this.renderer.setAnimationLoop(() => {
        const xSpd =  -0.08

         let elapsedTime = clock.getElapsedTime()
          let randPos = xSpd
          let genRand = false
          if (Math.round(elapsedTime) % 2 == 0) {
          randPos = xSpd
            genRand = false
          } else  if (Math.round(elapsedTime) % 3 == 0){
            genRand = true
}
      if (genRand) {
        randPos = Math.random()*0.4 * (Math.random() > 0.5 ? -1 : 1)
      }
      this.pivot.rotation.z += randPos
//      this.camera.position.z += 0.1
//            this.controls.update()

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

