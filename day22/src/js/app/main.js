// Global imports -
import * as THREE from 'three';
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js'
import {Water} from 'three/examples/jsm/objects/Water2.js'

import {createCamera} from '../components/Three/camera.js'
import {createLights} from '../components/Three/lights.js'
import {createRenderer} from '../components/Three/renderer.js'
import { createFog} from '../components/Three/fog.js'
import {createControls} from '../components/Three/controls.js'
import {createFloor} from '../components/Three/ProceduralFloor/Floor.js'
import {createSun} from '../components/Three/sun.js'
import randomColor from 'randomcolor'

const clock = new THREE.Clock()

// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Texture {
    constructor() {
        // set up scene
        // CAMERA
        // fov, aspect, near, far
      this.camera = createCamera()
//      this.camera.lookAt(new THREE.Vector3(5000,200, 20000))
        // SCENE & RENDER
        this.renderer = createRenderer()
        this.scene = new THREE.Scene();
//        this.camera.lookAt(this.scene.position)

        //LIGHTS
        const color = 0xFFFFFF
        const intensity = 2.5
       this.light = createLights({color: color, intensity: intensity})
  //      console.log('light: ', this.light)
        this.light[0].position.set(5, 50, -50)
        this.light[0].position.setScalar(1)
        this.scene.add(this.light[0]/* new THREE.AmbientLight(color, 0.25)*/)
//        this.scene.add(this.light[1])
        //BACKGROUND & FOG
        let backgroundColor = new THREE.Color(0xf54568)
//        this.scene.background = backgroundColor
        this.scene.fog = createFog(0xffea4d, 50, 650)
        // CONTROLS
        createControls(this.camera, this.renderer)
        //GROUND
        const ground = new THREE.PlaneGeometry(1000, 400, 10, 10)
        createSun(this.scene, this.renderer)
//        this.scene.add(ground)
        // shapes & textures
        //        this.camera.lookAt(this.keyboard[18])
        let groundMesh = createFloor({width: 1000, height: 400, segments: 25, range: 60})
        groundMesh.position.y = 25
        this.scene.add(groundMesh)
 //       this.camera.lookAt(groundMesh)
        const textureLoader = new THREE.TextureLoader()
        const flowMap = textureLoader.load('textures/Water_1_M_Flow.jpg')
        const normalMap0 = textureLoader.load('textures/Water_1_M_Normal.jpg')
        const normalMap1 = textureLoader.load('textures/Water_2_M_Normal.jpg')


        const waterGeo = new THREE.PlaneGeometry(1000, 400)
        let water = new Water(waterGeo, {scale: 2, textureWidth: 1024, textureHeight: 1024, flowMap: flowMap, normalMap0: normalMap0, normalMap1: normalMap1, flowDirection: new THREE.Vector2(1, 1), color: '#ffffff'})
            water.position.y = 1
            water.rotation.x = Math.PI * -0.5
        let waterBase = new THREE.PlaneGeometry(1000, 400)
        let waterMat = new THREE.MeshBasicMaterial({color: 0x91e4ff, transparent : true, opacity:0.9})
        let waterBaseMesh = new THREE.Mesh(waterBase, waterMat)
        waterBaseMesh.position.y = 0.8
            waterBaseMesh.rotation.x = Math.PI * -0.5
        this.scene.add(water, waterBaseMesh)
            this.render = this.render.bind(this) //bind to class instead of window object

    }
    render(time, i) {

        this.renderer.setAnimationLoop(() => {
        const xSpd = time * 0.15
            //TODO: update to proper animation loop per https://discoverthreejs.com/book/first-steps/animation-loop/#timing-in-the-animation-system

//            console.log('camera pos: ', this.camera.position)

    //        this.text.material.needsUpdate = true
    //        this.train.rotation.y += xSpd
    //          this.camera.position.x -= xSpd
    //          this.camera.position.z -= xSpd
    //          this.camera.position.y -= xSpd/2
    //        this.text.rotation.x += xSpd
            this.renderer.render(this.scene, this.camera)
        })
    }
}
