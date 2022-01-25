// Global imports -
import * as THREE from 'three';
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import {createCamera} from '../components/camera.js'
import {createLights} from '../components/lights.js'
import {createRenderer} from '../components/renderer.js'
import { createFog} from '../components/fog.js'
import {createControls} from '../components/controls.js'
import {createText, lerpColor} from '../components/createText.js'
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'

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
        this.scene.add(this.light, new THREE.AmbientLight(color, 0.25))

        //BACKGROUND & FOG
        let backgroundColor = new THREE.Color(0xFFFFFF)
        this.scene.background = backgroundColor
//        this.scene.fog = createFog(0xffea4d, 15, 2000)
        // CONTROLS
        createControls(this.camera, this.renderer, this.light)
        // shapes & textures


        this.text = createText('A Squid Eating Dough In A Polyethylene Bag', helvetiker)
        this.scene.add(this.text)
        //bind class functions
        this.text.position.x = -250
//        this.camera.lookAt(text)
        this.render = this.render.bind(this) //bind to class instead of window object

    }

    render(time, i) {

        this.renderer.setAnimationLoop(() => {
        const xSpd = time * 0.15
        //TODO: update to proper animation loop per https://discoverthreejs.com/book/first-steps/animation-loop/#timing-in-the-animation-system
        lerpColor(this.text, time)
        this.text.material.needsUpdate = true
//        this.train.rotation.y += xSpd
//          this.camera.position.x -= xSpd
//          this.camera.position.z -= xSpd
//          this.camera.position.y -= xSpd/2
//        this.text.rotation.x += xSpd
//        this.particleSystem.animate(xSpd)
        this.renderer.render(this.scene, this.camera)
})


}
}
