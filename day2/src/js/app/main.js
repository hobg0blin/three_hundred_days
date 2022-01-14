// Global imports -
import * as THREE from 'three';
import randomColor from 'randomcolor'
let renderer, scene, camera, cubeObj;

let currentGoalColor = new THREE.Color
let currentColor = new THREE.Color


// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export function cube(container) {
    // Set container property to container element
    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 5;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({alpha: true});
    document.body.appendChild(renderer.domElement)
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const material = new THREE.MeshBasicMaterial();
    cubeObj = new THREE.Mesh(geometry, material);
    scene.add(cubeObj);
    camera.lookAt(cubeObj.position)
    console.log('camera: ', camera)
    console.log('should be rendering')

}

export function render(time) {
    if (Math.round(cubeObj.material.color.r*100)/100 == Math.round(currentGoalColor.r*100)/100 || time == 20){
        console.log('foo')
        currentGoalColor = new THREE.Color(randomColor({format: 'rgb'}))
    }
    console.log('cube color: ', cubeObj.material.color)
    console.log('goal color: ', currentGoalColor)
    cubeObj.material.color.set(currentColor.lerpColors( cubeObj.material.color, currentGoalColor, 0.03))
    time *= 0.001
    cubeObj.rotation.x = time;
    cubeObj.rotation.y = time
    renderer.render(scene, camera)
    requestAnimationFrame(render)
}

function lerpColor(color1, color2) {

}
