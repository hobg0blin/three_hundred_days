// Global imports -
import * as THREE from 'three';
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import {createCamera} from '../components/camera.js'
import {createLights} from '../components/lights.js'
import {createRenderer} from '../components/renderer.js'
import { createFog} from '../components/fog.js'
import {createControls} from '../components/controls.js'
import { Train } from '../components/Train/Train.js'


const clock = new THREE.Clock()


// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Texture {
    constructor() {
        // set up scene
        // CAMERA
        // fov, aspect, near, far
        this.camera = createCamera()
      this.camera.lookAt(new THREE.Vector3(5000,200, 20000))
        // SCENE & RENDER
        this.renderer = createRenderer()
        this.scene = new THREE.Scene();

        //LIGHTS
        const color = 0xFFFFFF
        const intensity = 4
        this.light = createLights(color, intensity)
        this.scene.add(this.light.target)
        this.scene.add(this.light, new THREE.AmbientLight(color, 0.5))

        //BACKGROUND & FOG
        let backgroundColor = new THREE.Color('lightblue')
        this.scene.background = backgroundColor
        this.scene.fog = createFog(backgroundColor, 15000, 25000)
        // CONTROLS
        createControls(this.camera, this.renderer, this.light)
           // shapes & textures
        const train = new Train()
        this.train = train
        this.scene.add(train)

        //bind class functions
        this.render = this.render.bind(this) //bind to class instead of window object

    }

    render(time, i) {

        this.renderer.setAnimationLoop(() => {
        const xSpd = time *-0.0005
        //TODO: update to proper animation loop per https://discoverthreejs.com/book/first-steps/animation-loop/#timing-in-the-animation-system
        this.train.rotation.y += xSpd
        this.train.tick(clock.getDelta())
        this.renderer.render(this.scene, this.camera)
})


}
}
