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
//var geometry = new THREE.PlaneBufferGeometry( 2000, 2000, 256, 256 );
        const depth = 25
        const width = 100
        const height = 25
        const spacingX = 33
        const spacingY = 33
        let geometry = new THREE.BufferGeometry();
        let vertices = []
        for (let z=0; z < depth; z++) {
            for (let x = 0; x < width; x++) {
                let vertex = new THREE.Vector3(x * spacingX, Math.random() * height, z* spacingY)
                vertices.push(vertex.x)
                vertices.push(vertex.y)
        vertices.push(vertex.z)


            }
        }
        console.log('vertices: ', vertices)
        let vs = new Float32Array(vertices)
        console.log('vs: ', vs)
        geometry.setAttribute('position', new THREE.BufferAttribute(vs, 3))
var material = new THREE.MeshBasicMaterial({color: 0xfdf754});
var terrain = new THREE.Mesh( geometry, material );
terrain.rotation.x = -Math.PI / 2;
this.scene.add( terrain );
this.camera.lookAt(terrain)
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


