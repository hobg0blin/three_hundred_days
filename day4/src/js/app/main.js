// Global imports -
import * as THREE from 'three';
import chroma from 'chroma-js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import randomColor from 'randomcolor'

let currentGoalColor = new THREE.Color
let currentColor = new THREE.Color


// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Texture {
    constructor() {
        this.mySwitch = true
        // set up scene
        const fov = 75;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 5;
        // fov, aspect, near, far
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.y = 70;
        this.camera.position.z = 1000;
        this.camera.rotation.x = -15 * Math.PI / 180;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.shadowMapEnabled = true
var light = new THREE.DirectionalLight(0xffffff, 1.3);
light.position.set(this.camera.position.x, this.camera.position.y+500, this.camera.position.z+500).normalize();
this.scene.add(light);
        document.body.appendChild(this.renderer.domElement)
        const controls = new OrbitControls(this.camera, this.renderer.domElement)
        controls.target.set(0, 5, 0)
        controls.update()
        // box for debugging
//        const boxWidth = 1;
//        const boxHeight = 1;
//        const boxDepth = 1;
//        const boxgeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
//        const boxmaterial = new THREE.MeshBasicMaterial();
//        let cubeObj = new THREE.Mesh(boxgeometry, boxmaterial);
//        this.scene.add(cubeObj);
//        this.camera.lookAt(cubeObj.position)
        // make shape
var geometry = new THREE.PlaneBufferGeometry( 2000, 2000, 256, 256 );
var material = new THREE.MeshLambertMaterial({color: 0x20d651});
var terrain = new THREE.Mesh( geometry, material );
terrain.rotation.x = -Math.PI / 2;
this.scene.add( terrain );
this.camera.lookAt(terrain)
var peak = 60;
var vertices = terrain.geometry.attributes.position.array;
for (var i = 0; i <= vertices.length; i += 4) {
    vertices[i+2] = peak * Math.random();
}
terrain.geometry.attributes.position.needsUpdate = true;
terrain.geometry.computeVertexNormals();
        this.render = this.render.bind(this) //bind to class instead of window object

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
        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.render)     }

}


