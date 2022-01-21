// Global imports -
import * as THREE from 'three';
import chroma from 'chroma-js'
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import ColorGUIHelper from '../utils/ColorGUIHelper.js'
import randomColor from 'randomcolor'

let currentGoalColor = new THREE.Color
let currentColor = new THREE.Color


// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Texture {
    constructor() {
        // set up scene
        // CAMERA
       const fov = 75;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 5;
        // fov, aspect, near, far
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 300);
        this.camera.position.set(0, 10, 90)
        this.camera.lookAt(new THREE.Vector3(5000,200, 20000))
        // SCENE & RENDER
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({antialising: true});
      this.renderer.setPixelRatio(2.0)
        this.renderer.shadowMapEnabled = true
        //camera helper, if needed
//        this.scene.add(new THREE.CameraHelper(this.camera))
        //do not ever delete me
        document.body.append(this.renderer.domElement)

        //LIGHTS
        const color = 0xFFFFFF
        const intensity = 1.3
        this.light = new THREE.DirectionalLight(color, intensity);
        this.light.position.setScalar(1)
        this.scene.add(this.light.target)
        this.scene.add(this.light, new THREE.AmbientLight(color, 0.25))
        //BACKGROUND & FOG
        let backgroundColor = new THREE.Color('lightblue')
        this.scene.background = backgroundColor
      const fogColor = backgroundColor;
      const fogNear = 15000;
        const fogFar = 25000
      this.scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);

        // CONTROLS
        // camera
            const controls = new OrbitControls(this.camera, this.renderer.domElement)
        controls.target.set(0, 5, 0)
        controls.update()
        //light gui
        const gui = new GUI()
        gui.addColor(new ColorGUIHelper(this.light, 'color'), 'value').name('color')
        gui.add(this.light, 'intensity', 0, 2, 0.01)
      // shapes & textures
      const loader = new THREE.TextureLoader()
      const texture = loader.load('hank.jpg')
      console.log('texture: ', texture)
      const material = new THREE.MeshBasicMaterial({
        map: texture
      })
      material.magFilter = THREE.LinearMipMapLinearFilter
      material.minFilter = THREE.LinearFilter
      const sphereGeo = new THREE.SphereGeometry(20, 200)
      const sphereMesh = new THREE.Mesh(sphereGeo, material)
      const cubeGeo = new THREE.BoxGeometry(20, 20, 20)
      const cubeMesh = new THREE.Mesh(cubeGeo, material)
      cubeMesh.position.y = 29
      const pyrGeo = new THREE.ConeGeometry(20, 20, 3)
      const repeatTexture = loader.load('hank.jpg')
      repeatTexture.repeat.set(3, 1)
      repeatTexture.wrapS = THREE.RepeatWrapping
      repeatTexture.offset.set(-.25, .15)
      const repeatMaterial = new THREE.MeshBasicMaterial({map: repeatTexture})
      const pyrMesh = new THREE.Mesh(pyrGeo, repeatMaterial)
      pyrMesh.position.y = -29
      this.shapes = [cubeMesh, sphereMesh, pyrMesh]
      this.scene.add(sphereMesh, cubeMesh, pyrMesh)

        //bind class functions
        this.render = this.render.bind(this) //bind to class instead of window object

    }

    render(time, i) {

        this.renderer.setAnimationLoop(() => {
        const xSpd = time *-0.0005
        this.shapes.forEach(shape => {
          shape.rotation.y += xSpd
        })

//        this.camera.rotation.y = -time/6
//        this.camera.rotation.z = time/12
        this.renderer.render(this.scene, this.camera)
})
    }

}

