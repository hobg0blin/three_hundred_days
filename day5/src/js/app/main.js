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
        const fov = 75;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 5;
        // fov, aspect, near, far
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 15, 90)
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({antialising: true});
        this.renderer.shadowMapEnabled = true
        //camera helper, if needed
//        this.scene.add(new THREE.CameraHelper(this.camera))

        //do not ever delete me
        document.body.append(this.renderer.domElement)
            const controls = new OrbitControls(this.camera, this.renderer.domElement)
        controls.target.set(0, 5, 0)
        controls.update()
        const color = 0xFFFFFF
        const intensity = 1.3
        this.light = new THREE.DirectionalLight(color, intensity);
        this.light.position.setScalar(1)
        this.scene.add(this.light.target)
        this.scene.add(this.light, new THREE.AmbientLight(color, 0.25))
        const gui = new GUI()
        gui.addColor(new ColorGUIHelper(this.light, 'color'), 'value').name('color')
        gui.add(this.light, 'intensity', 0, 2, 0.01)
        console.log('foo')
        this.render = this.render.bind(this) //bind to class instead of window object
        this.buildFloorMesh = this.buildFloorMesh.bind(this)

    }
    buildFloorMesh() {
        //texture creation
        // adapted from https://stackoverflow.com/questions/49383791/low-poly-terrain-created-by-modifying-geometry-vertices-is-producing-black-glitc
        let floor = new THREE.PlaneBufferGeometry(2000, 2000, 100, 100)
        let colors = []
        let randomFloorVertexPos
        console.log('vertices? ', floor.attributes.position)
        for (let i = 0; i < floor.attributes.position.array.length; i++) {
            console.log(randomColor({format: 'rgb'}))
            let color = new THREE.Color(randomColor({format: 'rgb'}))
            console.log('color: ', color)
            colors.push(color.r, color.g, color.b)
            console.log('ping')
            let range = 20
            randomFloorVertexPos = Math.floor(Math.random() * ((0) - (-range)) + (-range))
           floor.attributes.position.setZ(i, randomFloorVertexPos)
        }
        floor.attributes.position.needsUpdate = true
        console.log('colors: ', colors)
        floor.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
        floor.attributes.color.needsUpdate = true
        floor.computeVertexNormals()

        let floorMaterial = new THREE.MeshPhongMaterial({ color: 0xfcba03/* for multicolor: vertexColors: true */})
        floorMaterial.flatShading = true;
        let floorMesh = new THREE.Mesh(floor, floorMaterial)
///      floorMesh.position.y = -72.5
        floorMesh.receiveShadow = true
        floorMesh.castShadow = true
        floorMesh.name = "floor"
        floorMesh.rotation.x = -Math.PI /2
        console.log('mesh position,', floorMesh.position)
        this.scene.add(floorMesh)
//        this.light.target = floorMesh
//        this.camera.lookAt(floorMesh)

    }

    render(time) {
//        if (Math.round(this.shape.material.color.r*100)/100 == Math.round(currentGoalColor.r*100)/100 || time == 20){
//            currentGoalColor = new THREE.Color(randomColor({format: 'rgb'}))
//        }
        //this.shape.material.color.set(currentColor.lerpColors( this.shape.material.color, currentGoalColor, 0.03))
        time *= 0.001
//        this.shape.rotation.x = time;
//        this.shape.rotation.y = time
        //
 //       this.camera.rotation.x = time/12
        this.camera.rotation.y = -time/6
//        this.camera.rotation.z = time/12
        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.render)     }

}


