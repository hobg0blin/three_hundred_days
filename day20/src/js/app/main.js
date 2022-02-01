// Global imports -
import * as THREE from 'three';
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import {createCamera} from '../components/Three/camera.js'
import {createLights} from '../components/Three/lights.js'
import {createRenderer} from '../components/Three/renderer.js'
import { createFog} from '../components/Three/fog.js'
import {createControls} from '../components/Three/controls.js'
import randomColor from 'randomcolor'
import { MIDILogger, currentKeys } from '../components/utils/MIDILogger.js'

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

        //LIGHTS
        const color = 0xFFFFFF
        const intensity = 5
        this.light = createLights(color, intensity)
        console.log('light: ', this.light)
        this.scene.add(this.light[0].target)
        this.scene.add(this.light[0], new THREE.AmbientLight(color, 0))
        this.scene.add(this.light[1])
        //BACKGROUND & FOG
        let backgroundColor = new THREE.Color(0xa2c1f2)
        this.scene.background = backgroundColor
//        this.scene.fog = createFog(0xffea4d, 15, 2000)
        // CONTROLS
        createControls(this.camera, this.renderer, this.light[0])
        //GROUND
        const ground = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000, 1, 1), new THREE.MeshPhongMaterial({ color: 0x4287f5, shininess: 30, emissiveIntensity: 10}))
        ground.rotation.x = - Math.PI /2
        ground.receiveShadow = true
        this.scene.add(ground)
        // shapes & textures
        MIDILogger()
        this.currentKeys = currentKeys
        this.keyboard = []
        this.buildKeyboard = this.buildKeyboard.bind(this)
//        this.camera.lookAt(this.keyboard[18])
        this.judder = this.judder.bind(this)
        this.buildMouf = this.buildMouf.bind(this)
        this.render = this.render.bind(this) //bind to class instead of window object
    this.boxGeo = new THREE.BoxGeometry(1, 1, 1, 360, 1, 1);
    this.boxGeo.translate(0.5, 0.5, 0);
    this.defaultPos = this.boxGeo.attributes.position;
    this.maxZ = 0
    this.buildKeyboard()

    }
    buildMouf() {
        let v = new THREE.Vector3();
        let r = 2;
        let R = 3;
        let waves = 5;
        for(let i = 0; i < this.defaultPos.count; i++){
          v.fromBufferAttribute(this.defaultPos, i);

          let angle = v.x * Math.PI * 2;

          let radius = v.z > 0 ? R : r;
    //      let y = v.y < 0.5 ? v.y : v.y + Math.sin(v.x * Math.PI * r * waves) * 0.25;
            let y = v.y

          this.defaultPos.setXYZ(i, Math.cos(angle) * radius, y, -Math.sin(angle) * radius/15)
        }
        this.boxGeo.computeVertexNormals();
        return this.boxGeo

    }
    buildKeyboard() {
        const sphere = new THREE.SphereGeometry(4, 10, 10)
        const eye = new THREE.SphereGeometry(1, 5, 5)
        const loader = new THREE.TextureLoader()
        const eyeMat = new THREE.MeshPhongMaterial({color: 0xFFFFFF})
        const pupilMat = new THREE.MeshPhongMaterial({ color: 'black'})
        const mouf = this.buildMouf()
        const eyeCount = 2
        for (let i = 0; i <= 36; i++) {
            const sphereMat = new THREE.MeshPhongMaterial({ map: loader.load('stone-granite-1-TEX.png')})
            const torMat = new THREE.MeshPhongMaterial({color: new THREE.Color(randomColor())})
            const sphereMesh = new THREE.Mesh(sphere, sphereMat)
            const torMesh = new THREE.Mesh(mouf.clone(), torMat)
            torMesh.scale.set(0.5, 0.75, 1)
            sphereMesh.position.set(-15 + 9*(i+1), 12, 0)
            sphereMesh.scale.y = 4

            torMesh.position.set(-15 + 9*(i+1), 12.5, 4)
            torMesh.rotation.x = Math.PI/2
            sphereMesh.castShadow = true
            for (let j =0; j < eyeCount; j++) {
                let eyeMesh = new THREE.Mesh(eye, eyeMat)
                let pupil = new THREE.Mesh(eye, pupilMat)
                pupil.scale.set(0.25, 0.25)
                eyeMesh.position.set((-7) + 9*i+1 + 0.5*j, 16, 4)
                pupil.position.set((-7) + 9*i+1 + 0.5*j, 16, 4)
                this.scene.add(eyeMesh, pupil)
            }
            this.scene.add(sphereMesh)
            this.scene.add(torMesh)
            this.keyboard.push(torMesh)
        }

    }
    judder(shape, pos) {

        let v = new THREE.Vector3()
        for (let i = 0; i < shape.count; i++  ) {
        v.fromBufferAttribute(shape, i)
        let newZ = v.z
         if (v.z > this.maxZ) {
             this.maxZ = v.z
            }
        if (v.z > 0.02) {
            pos == true ? newZ +=0.1 : newZ-=0.1
            shape.setXYZ(i, v.x, v.y, newZ)
        }
//        return max

}
    }
    render(time, i) {

        this.renderer.setAnimationLoop(() => {
        const xSpd = time * 0.15
        for (let key in this.currentKeys) {
            if (this.currentKeys[key] == 'on') {

                console.log('key: ', key)
                let pos =this.keyboard[key-48].geometry.attributes.position
                console.log('bong')
                this.judder(pos, true)

                pos.needsUpdate = true
                console.log('maxZ: ', this.maxZ)
            }
            if (this.currentKeys[key] == 'off') {
                this.maxZ = 0
                let pos =this.keyboard[key-48].geometry.attributes.position
                this.judder(pos, false)
               pos.needsUpdate = true
                //returning maximum Z value of judder - surely there is a smarter way to do this
                if (this.maxZ <= 0.35) {
                    console.log('bong')
                      delete this.currentKeys[key]
                }
            }
        }
        //TODO: update to proper animation loop per https://discoverthreejs.com/book/first-steps/animation-loop/#timing-in-the-animation-system

//        console.log('ca0mera pos: ', this.camera.position)

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
