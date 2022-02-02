// Global imports -
import * as THREE from 'three';
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import {createCamera} from '../components/Three/camera.js'
import {createLights} from '../components/Three/lights.js'
import {createRenderer} from '../components/Three/renderer.js'
import { createFog} from '../components/Three/fog.js'
import {createControls} from '../components/Three/controls.js'
import {createText, lerpColor} from '../components/Three/createText.js'
import { crabMode, animateCrab, addPipe } from '../components/Three/crabMode.js'
import { createParticles } from '../components/Three/particleSystem.js'
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'

const clock = new THREE.Clock()
//FIXME: global variable for juddering crab - BAD BAD BAD but had to get it to work somehow
let doJudder = false

// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Texture {
    constructor(text) {
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

//        this.text = createText(text, helvetiker)
 //       this.textValue = text
  //      this.textFont = helvetiker
  //      this.scene.add(this.text)
  //      this.text.position.y = 100
        //bind class functions
//        this.camera.lookAt(text)
        this.beginCrabMode = this.beginCrabMode.bind(this)
        this.beginCrabMode()
        this.defaultPos = new THREE.BufferAttribute()
        this.judder = this.judder.bind(this)
        this.render = this.render.bind(this) //bind to class instead of window object

    }
    beginCrabMode() {
    let myCrab;
    if (this.crabs === undefined || this.crabs.length < 100) {
        crabMode().then(crab => {
            myCrab = crab
            console.log('crab: ', crab)
            if (this.crabs === undefined) {
                this.crabs = []
            }
            console.log('default pos: ', crab.geometry.attributes.position)
            this.crabs.push(crab)
            this.scene.add(crab)
            this.defaultPos = crab.geometry.attributes.position.clone()
        })
//        let judder = this.doJudder
            navigator.requestMIDIAccess().then((midi) => {
                for (let input of midi.inputs) {
                    console.log('input:', input)
                }
                startLoggingMIDIInput(midi, this.doJudder)
                console.log('midi supported')}

            )}
        function onMIDIMessage( event) {
            if (event.data[0] == 144 && event.data[2] > 0 ) {
                console.log('note on: ', event.data)
                doJudder = true
                // judder(myCrab.geometry)
            }
            if (event.data[2] == 0) {
                console.log('note off: ', event.data)
                doJudder = false
//                myCrab.geometry.position.set(this.defaultCrabPos)
            }
//            console.log('event: ', event.data)
           }

    function startLoggingMIDIInput( midiAccess, judder) {
        for (var input of midiAccess.inputs.values()) {
        input.onmidimessage = onMIDIMessage;
        judder = input.onmidimessage
        }
        }
    }
    judder(shape) {
        console.log('shape: ', shape)
        let range = 10
        for (let i = Math.round(Math.random() * 3); i < shape.attributes.position.array.length; i+=3) {
       let randomFloorVertexPos = Math.floor(Math.random() * ((0) - (-range)) + (-range))
                  randomFloorVertexPos *= Math.round(Math.random()) ? 1 : -1

               shape.attributes.position.setZ(i,  shape.attributes.position.getZ(i) +randomFloorVertexPos)
        }
            shape.attributes.position.needsUpdate = true
        console.log('changed shape: ', shape)

    }
    updateText(input = {font: undefined, value: undefined}) {
        console.log('input value: ', input.value)
        if (input.font !== undefined) {
            console.log('changing font', input.font)
            this.textFont = input.font
        }

        if (input.value !== undefined) {
            console.log('changing text: ', input.value)
            this.textValue = input.value
        }

        this.text.geometry.dispose()
        this.text.material.dispose()
        this.scene.remove(this.text)

        this.text = createText(this.textValue, this.textFont)
        this.scene.add(this.text)
        //TODO: move text position to somewhere smarter
    }
    render(time, i) {

        this.renderer.setAnimationLoop(() => {
        const xSpd = time * 0.15
        //TODO: update to proper animation loop per https://discoverthreejs.com/book/first-steps/animation-loop/#timing-in-the-animation-system
        if (this.crabs !== undefined && (Math.round(clock.getElapsedTime()*100)*10) % 100 == 0 ) {
    }
        if (this.crabs !== undefined) {
        if (doJudder) {
            console.log('should be juddering')
            this.judder(this.crabs[0].geometry)
            console.log('crab pos: ', this.crabs[0].geometry.attributes.position == this.defaultCrabPos)
        }
        if (!doJudder && !isNaN(this.crabs[0].geometry.attributes.position.array[0]) &&  this.crabs[0].geometry.attributes.position != this.defaultPos){
            //FIXME: this always fires when not pressing key for some reason
            console.log('foo')


           this.crabs[0].geometry.attributes.position.array.set(this.defaultPos.array)
            this.crabs[0].geometry.attributes.position.needsUpdate = true

            }
        }
        //console.log('camera pos: ', this.camera.position)
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
