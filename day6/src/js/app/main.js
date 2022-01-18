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
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 30000);
        this.camera.position.set(0, 15000, 30)
        this.camera.lookAt(new THREE.Vector3(5000,200, 20000))
        // SCENE & RENDER
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({antialising: true});
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

        //bind class functions
        this.render = this.render.bind(this) //bind to class instead of window object
        this.buildFloorMesh = this.buildFloorMesh.bind(this)

    }
    buildFloorMesh() {
        //texture creation
        // adapted from https://stackoverflow.com/questions/49383791/low-poly-terrain-created-by-modifying-geometry-vertices-is-producing-black-glitc
        this.floor = new THREE.PlaneBufferGeometry(20000, 20000, 30, 30)
        let colors = []
        let randomFloorVertexPos
        for (let i = 0; i < this.floor.attributes.position.array.length; i++) {
            //let color = new THREE.Color(randomColor({format: 'rgb'}))
            let range = 400
            randomFloorVertexPos = Math.floor(Math.random() * ((0) - (-range)) + (-range))
           this.floor.attributes.position.setZ(i, randomFloorVertexPos)
        }
        this.floor.attributes.position.needsUpdate = true
        console.log('colors: ', colors)
        this.floor.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
        this.floor.attributes.color.needsUpdate = true
        this.floor.computeVertexNormals()

        let floorMaterial = new THREE.MeshLambertMaterial({ color: 0xfcba03/* for multicolor: vertexColors: true */})
       // floorMaterial.flatShading = true;
        this.floorMesh = new THREE.Mesh(this.floor, floorMaterial)
        this.floorMesh.receiveShadow = true
        this.floorMesh.castShadow = true
        this.floorMesh.name = "floor"
        this.floorMesh.rotation.x = -Math.PI /2
        console.log('mesh position,', this.floorMesh.position)
        this.scene.add(this.floorMesh)
//        this.light.target = floorMesh
//        this.camera.lookAt(floorMesh)

    }

    render(time, i) {

        console.log('time: ', time)
        this.renderer.setAnimationLoop(() => {

        let range = 100
        let loopRange = 1000
        for (let j = 0 + i; j < i + 1000; j++ ) {
 let randomFloorVertexPos = Math.floor(Math.random() * ((0) - (-range)) + (-range))
            randomFloorVertexPos *= Math.round(Math.random()) ? 1 : -1

           this.floor.attributes.position.setZ(j, this.floor.attributes.position.getZ(j) + randomFloorVertexPos)


        }
        this.floor.attributes.position.needsUpdate = true

        this.floor.computeVertexNormals()
        if (i >= this.floor.attributes.position.array.length - 1) {
            i = 0;
        } else{
            i+=loopRange
        }


//        this.camera.rotation.y = -time/6
//        this.camera.rotation.z = time/12
        this.renderer.render(this.scene, this.camera)
})
    }

}

