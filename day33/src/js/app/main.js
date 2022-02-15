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

import {createFloor } from '../components/Three/Floor.js'
import { importSTLModel } from '../components/Three/importSTLModel.js'
import { importFBXModel } from '../components/Three/importFBXModel.js'
import { createCloud } from '../components/Three/clouds.js'
import randomColor from 'randomcolor'
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const clock = new THREE.Clock()
let mouse = new THREE.Vector2()

// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Texture {
    constructor() {
      console.log('foo')
        // set up scene
        // CAMERA
        // fov, aspect, near, far
      this.camera = createCamera()
   //     this.camera.up.set(0, 0, -1)
//      this.camera.lookAt(new THREE.Vector3(5000,200, 20000))
        // SCENE & RENDER
        this.renderer = createRenderer()
        this.scene = new THREE.Scene();
        this.camera.lookAt(this.scene.position)

        //LIGHTS
        const color = 0xFFFFFF
        const intensity = 2.5
       this.light = createLights({color: color, intensity: intensity})
  //      console.log('light: ', this.light)
        this.light[0].position.set(5, 500, 1000)
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
//        let groundMesh = createSphere({width: 550, height: 500, segments: 15, range: 0})
//        this.scene.add(groundMesh)
        let rainCount = 5000
      console.log('rain count: ', rainCount)
        let rainGeo = new THREE.BufferGeometry();
        let rainArr = []
    for(let i=0;i<rainCount;i++) {
      console.log('i: ', i)
      let rainDrop = new THREE.Vector3(Math.random() * 400 -200, Math.random() * 500 - 250, Math.random() * 400 - 200);
      console.log('rainDrop: ', rainDrop)
      rainArr.push(rainDrop.x, rainDrop.y, rainDrop.z);
    }
      console.log('rainArr: ', rainArr)
    rainGeo.setAttribute('position', new THREE.Float32BufferAttribute(rainArr, 3))
      console.log('raingeo pos: ', rainGeo.attributes.position)
    let rainMaterial = new THREE.PointsMaterial({
  color: 0xaaaaaa,
  size: 0.1,
//  transparent: true
});
    let rain = new THREE.Points(rainGeo,rainMaterial);
this.rainGeo = rainGeo
      console.log('rain: ', rain)
this.scene.add(rain);
for (let i = 0; i < 40; i++) {
let cloud = createCloud()
cloud.scale.set(10, 10, 10)
this.scene.add(cloud)
cloud.position.set(getRandomInt(-200, 200), getRandomInt(180, 200),getRandomInt(-200,200))
}
let floor = createFloor({width: 1000, height: 1000, segments: 25, range: 10})
floor.position.y = -200
this.scene.add(floor)

            this.render = this.render.bind(this) //bind to class instead of window object
        //if I need mouse pos
//        document.addEventListener('mouseclick', onDocumentMouseClick, false)

}
    render(time, i) {
   //   console.log('foo')
        let range = 1
        this.renderer.setAnimationLoop(() => {
        const xSpd = time * 0.00015
  for (let i = 0; i < this.rainGeo.attributes.position.array.length; i++) {
          let velocity = -10
  let p = this.rainGeo.attributes.position.getY(i)
  velocity -= 0.1 + Math.random() * 0.1
    if (p == undefined || p < -200) {

    this.rainGeo.attributes.position.setY(i, getRandomInt(190, 210))
    } else {
  this.rainGeo.attributes.position.setY(i, p += velocity)
}
    }
this.rainGeo.attributes.position.needsUpdate = true
            //TODO: update to proper animation loop per https://discoverthreejs.com/book/first-steps/animation-loop/#timing-in-the-animation-system

            console.log('camera pos: ', this.camera.position)

    //        this.text.material.needsUpdate = true
         //   this.camera.position.x -= xSpd/2
//              this.camera.rotation.z -= xSpd
    //          this.camera.position.z -= xSpd
          //    this.camera.rotation.y += xSpd
    //        this.text.rotation.x += xSpd
//            this.controls.update()

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

