// Global imports -
import * as THREE from 'three';
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js'
import {createSun} from '../components/Three/sun.js'

import {createCamera} from '../components/Three/camera.js'
import {createLights} from '../components/Three/lights.js'
import {createRenderer} from '../components/Three/renderer.js'
import { createFog} from '../components/Three/fog.js'
import {createControls} from '../components/Three/controls.js'
import { importSTLModel } from '../components/Three/importSTLModel.js'
import { importFBXModel } from '../components/Three/importFBXModel.js'
import randomColor from 'randomcolor'

const clock = new THREE.Clock()

// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Texture {
    constructor() {
        // set up scene
        // CAMERA
        // fov, aspect, near, far
      this.camera = createCamera()
        this.camera.up.set(0, 0, -1)
//      this.camera.lookAt(new THREE.Vector3(5000,200, 20000))
        // SCENE & RENDER
        this.renderer = createRenderer()
        this.scene = new THREE.Scene();
//        this.camera.lookAt(this.scene.position)

        //LIGHTS
        const color = 0xFFFFFF
        const intensity = 1.5
       this.light = createLights({color: color, intensity: intensity})
  //      console.log('light: ', this.light)
        this.light[0].position.set(5, 50, -50)
        this.light[0].position.setScalar(1)
        this.scene.add(this.light[0], new THREE.AmbientLight(color, 2.2))
//        this.scene.add(this.light[1])
        //BACKGROUND & FOG
        let backgroundColor = new THREE.Color(0x34c9eb)
        this.scene.background = backgroundColor
//        this.scene.fog = createFog(0xffea4d, 50, 650)
        // CONTROLS
        this.controls = createControls(this.camera, this.renderer, null, this.brain, true)
        //GROUND
            this.render = this.render.bind(this) //bind to class instead of window object
             this.mixer = new THREE.AnimationMixer
            this.anim = undefined
        let mat = new THREE.MeshPhongMaterial({color:0xfa98cb })
        function addBrain(brain, mat) {
            let brainMesh = new THREE.Mesh(brain, mat)
            brainMesh.scale.set(0.03, 0.03, 0.03)
            brainMesh.position.x = 2
            brainMesh.position.z = 4
            brainMesh.rotation.x = THREE.Math.degToRad(180)

            brainMesh.rotation.y = THREE.Math.degToRad(30)
            brainMesh.rotation.z = -Math.PI/2

            this.scene.add(brainMesh)
       }
         function addBody(model) {
             console.log('foo')
            console.log('model: ', model)

      //      let bodyMesh = new THREE.Mesh(model, mat)
           this.scene.add(model)
             model.position.y = 0
             model.position.z = 35
             model.position.x = 2
             model.rotation.x = THREE.Math.degToRad(-90)
         //    model.rotation.y = THREE.Math.degToRad(5)
             model.rotation.y = THREE.Math.degToRad(-95)
            model.scale.set(0.07, 0.07,0.07)
             this.mixer = new THREE.AnimationMixer(model)
             this.anim = this.mixer.clipAction(model.animations[8])
            this.anim.play()

             this.legs = model
        }

        this.addBrain = addBrain.bind(this)
        this.addBody = addBody.bind(this)
        this.legs
        console.log("addbody: ", this.addBody)
    importSTLModel('models/brain-lh.stl', mat, this.addBrain)
        importSTLModel('models/brain-rh.stl', mat, this.addBrain)
        console.log('poo poo')
  let human =   importFBXModel('models/AnimatedHuman/FBX/AnimatedHuman.fbx', this.addBody)
        console.log('human: ', human)
        let groundBase = new THREE.PlaneGeometry(1000, 1000)
        let groundMat = new THREE.MeshBasicMaterial({color:0x0b9e5e , transparent : true, opacity:0.9})
        let groundBaseMesh = new THREE.Mesh(groundBase, groundMat)
        groundBaseMesh.position.z = 36
            groundBaseMesh.rotation.x = Math.PI
        this.scene.add(groundBaseMesh)

    }
    render(time, i) {

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
            this.controls.update()
            this.renderer.render(this.scene, this.camera)
        })
    }
}
