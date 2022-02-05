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
import { importModel } from '../components/Three/importModel.js'
import { createParticles } from '../components/Three/particleSystem.js'
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
        this.scene.background = backgroundColor
        this.scene.fog = createFog(0xffea4d, 50, 650)
        // CONTROLS
        createControls(this.camera, this.renderer)
        //GROUND
            this.render = this.render.bind(this) //bind to class instead of window object
        let mat = new THREE.MeshPhongMaterial({color:0xfa98cb })
        function addBrain(brain, mat) {
            console.log('brain: ', brain)
            let brainMesh = new THREE.Mesh(brain, mat)
            brainMesh.scale.set(0.05, 0.05, 0.05)
            brainMesh.rotation.z = Math.PI
            this.scene.add(brainMesh)
        }
        this.addBrain = addBrain.bind(this)
    importModel('models/brain-lh.stl', mat, this.addBrain).then('c')
        importModel('models/brain-rh.stl', mat, this.addBrain)
        this.particles = createParticles(10000, 0xFFFFFF, 3, {x:5, y: 5, z: 5}, {x: 0, y: 0, z:0})
        this.scene.add(this.particles.mesh)
    }
    render(time, i) {

        this.renderer.setAnimationLoop(() => {
        const xSpd = time * 0.15
            this.particles.animate(xSpd)
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
