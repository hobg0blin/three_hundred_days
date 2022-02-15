// Global imports -
import * as THREE from 'three';
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import {createSun} from '../components/Three/sun.js'
import {Water} from 'three/examples/jsm/objects/Water2.js'
import {createCamera} from '../components/Three/camera.js'
import {createLights} from '../components/Three/lights.js'
import {createRenderer} from '../components/Three/renderer.js'
import { createFog} from '../components/Three/fog.js'
import {createControls} from '../components/Three/controls.js'
import {createSphere, animateSphere} from '../components/Three/ProceduralSphere/Sphere.js'

import { importSTLModel } from '../components/Three/importSTLModel.js'
import { importFBXModel } from '../components/Three/importFBXModel.js'
import { createCloud } from '../components/Three/clouds.js'
import randomColor from 'randomcolor'

const clock = new THREE.Clock()
let mouse = new THREE.Vector2()

// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Texture {
    constructor() {
        // set up scene
        // CAMERA
        // fov, aspect, near, far
      this.camera = createCamera()
   //     this.camera.up.set(0, 0, -1)
//      this.camera.lookAt(new THREE.Vector3(5000,200, 20000))
        // SCENE & RENDER
        this.renderer = createRenderer()
        this.scene = new THREE.Scene();
//        this.camera.lookAt(this.scene.position)

        //LIGHTS
        const color = 0xFFFFFF
        const intensity = 2.2
       this.light = createLights({color: color, intensity: intensity})
  //      console.log('light: ', this.light)
        this.light[0].position.set(5, 500, 2000)
//        this.light[0].position.setScalar(1)
      const helper = new THREE.DirectionalLightHelper(this.light[0], 5)
//      this.scene.add(helper)
        this.scene.add(this.light[0], new THREE.AmbientLight(color, 0.4))
//        this.scene.add(this.light[1])
        //BACKGROUND & FOG
//        let backgroundColor = new THREE.Color(0x34c9eb)
 //       this.scene.background = backgroundColor
        let loader = new THREE.TextureLoader()
        let backgroundImg = loader.load('studio-bg.jpg')
        this.scene.background = backgroundImg
//        this.scene.fog = createFog(0xffea4d, 50, 650)
        // CONTROLS
        this.controls = createControls(this.camera, this.renderer, null, this.brain, true)
        //GROUND
        this.floor = []
        let xPos = 0;
        let yPos = 0;
        let style = 0
        for (let i = 0; i < 2; i +=1) {
            console.log('xPos,', xPos)
        let terrainMesh = createSphere({width: 540, height: 500, segments: 119, range: 1})
    terrainMesh.position.y = yPos
    terrainMesh.position.x = xPos
    style = style == 0 ? 1 : 0
    if (xPos < 2400) {
     xPos += 1200
 } else {
        yPos += 1200
        xPos = 0
      }
    this.scene.add(terrainMesh)
            this.floor.push({mesh: terrainMesh, style: style })
}

//        let groundMesh = createSphere({width: 550, height: 500, segments: 15, range: 0})
//        this.scene.add(groundMesh)

            this.render = this.render.bind(this) //bind to class instead of window object
        //if I need mouse pos
//        document.addEventListener('mouseclick', onDocumentMouseClick, false)

    }
    render(time, i) {
        let range = 1
        this.renderer.setAnimationLoop(() => {
        const xSpd = time * 0.00015
            if (this.anim != undefined) {

            this.mixer.update(clock.getDelta())
            }
            //TODO: update to proper animation loop per https://discoverthreejs.com/book/first-steps/animation-loop/#timing-in-the-animation-system

//            console.log('camera pos: ', this.camera.position)

    //        this.text.material.needsUpdate = true
         //   this.camera.position.x -= xSpd/2
//              this.camera.rotation.z -= xSpd
    //          this.camera.position.z -= xSpd
          //    this.camera.rotation.y += xSpd
    //        this.text.rotation.x += xSpd
//            this.controls.update()
            for (let sphere of this.floor) {
                let mod = Math.random() >= 0.5 ? -1 : 1
//                if (mod > 0) {
                   // passing NaN as mod produces fun disappearing sphere effect
//                if (Math.round(clock.getElapsedTime())% 2 == 0) {
                    animateSphere(sphere.mesh.geometry, 1, sphere.style)
 //               }
//}
}
//            this.floor.rotation.y += xSpd
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

