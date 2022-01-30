// Global imports -
import * as THREE from 'three';
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import {createCamera} from '../components/Three/camera.js'
import {createLights} from '../components/Three/lights.js'
import {createRenderer} from '../components/Three/renderer.js'
import { createFog} from '../components/Three/fog.js'
import {createControls} from '../components/Three/controls.js'
import randomColor from 'randomcolor'

const clock = new THREE.Clock()
//FIXME: still using global state variable, need to refactor MIDI stuff
const currentKeys = {}

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
        const intensity = 1.3
        this.light = createLights(color, intensity)
        this.scene.add(this.light.target)
        this.scene.add(this.light, new THREE.AmbientLight(color, 1))

        //BACKGROUND & FOG
        let backgroundColor = new THREE.Color(0xFFFFFF)
        this.scene.background = backgroundColor
//        this.scene.fog = createFog(0xffea4d, 15, 2000)
        // CONTROLS
        createControls(this.camera, this.renderer, this.light)
        // shapes & textures

        this.keyboard = []
        this.buildKeyboard = this.buildKeyboard.bind(this)
        this.buildKeyboard()
        this.camera.lookAt(this.keyboard[18])
        this.defaultPos = new THREE.BufferAttribute()
        this.judder = this.judder.bind(this)
        this.render = this.render.bind(this) //bind to class instead of window object

    }
    buildKeyboard() {
        const box = new THREE.BoxGeometry(10, 40, 10)

        for (let i = 0; i < 36; i++) {
            const boxMat = new THREE.MeshPhongMaterial({color: new THREE.Color(randomColor())})
            const boxMesh = new THREE.Mesh(box, boxMat)
            boxMesh.position.set(0 + 16*(i+1), 0, 0)
            this.scene.add(boxMesh)
            this.keyboard.push(boxMesh)
        }
        navigator.requestMIDIAccess().then((midi) => {

            startLoggingMIDIInput(midi, this.doJudder)
            console.log('midi supported')
        })
        function onMIDIMessage( event) {
            if (event.data[0] == 144 && event.data[2] > 0 ) {
                //subtract 48 bc thats minimum key code
                currentKeys[event.data[1]] = 'on'
            }
            if (event.data[2] == 0) {
                console.log('note off: ', event.data)
//                keyboard[event.data[1] - 48].scale(1)
                currentKeys[event.data[1]] = 'off'
            }
//            console.log('current keys: ', currentKeys)
           }

    function startLoggingMIDIInput( midiAccess) {
        for (var input of midiAccess.inputs.values()) {
        input.onmidimessage = onMIDIMessage;
        }
        }
    }
    judder(shape) {
        shape.scale.y += 0.05

    }
    render(time, i) {

        this.renderer.setAnimationLoop(() => {
        const xSpd = time * 0.15
        for (let key in currentKeys) {
            if (currentKeys[key] == 'on') {
                this.judder(this.keyboard[key - 48])
            }
            if (currentKeys[key] == 'off') {
                this.keyboard[key - 48].scale.y = 1
                delete currentKeys[key]
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
