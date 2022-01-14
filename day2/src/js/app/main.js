// Global imports -
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import randomColor from 'randomcolor'

let currentGoalColor = new THREE.Color
let currentColor = new THREE.Color


// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Eye {
    constructor() {
        this.mySwitch = true
        // set up scene
        const fov = 75;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 5;
        // fov, aspect, near, far
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(0, 0, 50)
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.shadowMapEnabled = true
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
        this.makeOval = this.makeOval.bind(this)
        this.blink1 = this.blink1.bind(this)
        this.blink2 = this.blink2.bind(this)
       let eye = this.makeOval(22, "#0xffff00")
        eye.rotation.z = Math.PI/2
        const radius =1.5
        const widthSegments = 25;
        const heightSegments = 17;
        const sphGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments)
        const sphMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color("#0d0a0a")});
        const pupil = new THREE.Mesh(sphGeometry, sphMaterial)
        pupil.position.z = 3.5
        pupil.position.x = -4
        this.scene.add(pupil)

        this.lids = []
        console.log('eye rotation', eye.rotation)
        this.scene.add(eye);
        this.xRad = 7.7
        this.yRad = 2.6
        console.log('camera position: ', this.camera.position)
        console.log('shape position: ', eye.position)
        this.camera.lookAt(eye.position)
        this.render = this.render.bind(this) //bind to class instead of window object
        for (let i = 0; i < 100; i ++) {
//            this.blink("#4b5699", i*0.01)
        }

    }
    makeOval(numPoints, color) {
        const points = []
        for (let i=0; i < numPoints; ++i) {
            points.push(new THREE.Vector2(Math.sin(i*0.15) * 3, (i-5) *.8))
        }
        console.log('points: ', points)
        const geometry = new THREE.LatheGeometry(points);
        const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(color)});
        const shape = new THREE.Mesh(geometry, material);
        return shape

    }

    blink1(color, t) {
        if (this.xRad > 0 && this.yRad > 0 && this.xRad <= 7.7 && this.yRad <=2.6 && this.mySwitch) {
            this.xRad -= t
            this.yRad -= t
        let curve = new THREE.EllipseCurve(
          -4,  0,            // ax, aY
          this.xRad, this.yRad,           // xRadius, yRadius
          0,  2 * Math.PI/2,  // aStartAngle, aEndAngle
          false,            // aClockwise
          0                 // aRotation
        );

        const points = curve.getPoints( 50 );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );

        const material = new THREE.LineBasicMaterial( { color : new THREE.Color(color) } );

        // Create the final object to add to the scene
        const ellipse = new THREE.Line( geometry, material );
        ellipse.position.z = 5
        this.scene.add(ellipse)
        this.lids.push(ellipse)
        } else if (this.Xrad == 7.7 && this.yRad == 2.6) {
            this.mySwitch = true
        } else if (this.mySwitch == true){
            this.mySwitch = false

        } else {
            this.scene.remove(this.lids[this.lids.length - 1])
            this.lids.pop()
            this.xRad += t
            this.yRad += t
        }
    }

    blink2(color, t) {
        if (this.xRad > 0 && this.yRad > 0 && this.xRad <= 7.7 && this.yRad <=2.6 && this.mySwitch) {
                    let curve = new THREE.EllipseCurve(
          -4,  0,            // ax, aY
          0 - this.xRad, 0 - this.yRad,           // xRadius, yRadius
          0,  2 * Math.PI/2,  // aStartAngle, aEndAngle
          false,            // aClockwise
          0                 // aRotation
        );

        const points = curve.getPoints( 50 );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );

        const material = new THREE.LineBasicMaterial( { color : new THREE.Color(color) } );

        // Create the final object to add to the scene
        const ellipse = new THREE.Line( geometry, material );
        ellipse.position.z = 5
        this.scene.add(ellipse)
        this.lids.push(ellipse)
        } else if (this.Xrad == 7.7 && this.yRad == 2.6) {
            this.mySwitch = true
        } else if (this.mySwitch == true){
            console.log('foo1')
            this.mySwitch = false
        } else {
            console.log('foo2')
            console.log(this.xRad)
            console.log(this.yRad)
            this.scene.remove(this.lids[this.lids.length - 1])
            this.lids.pop()
            this.xRad += t
            this.yRad += t
        }
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
        this.blink1("#4b5699", 0.01)
        this.blink2("#4b5699", 0.01)
        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.render)     }

}


