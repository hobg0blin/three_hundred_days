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
        // set up camera
        // fov, aspect, near, far
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(0, 0, 50)
        //set up scene & renderer
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.shadowMapEnabled = true
        document.body.appendChild(this.renderer.domElement)
        // set up orbit controls
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
        // add lights
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.AmbientLight(color, intensity);
        const pointLight = new THREE.PointLight(color, 5)
        pointLight.position.set(4, 0, 3)
        const dLight = new THREE.DirectionalLight(color, 5)
        dLight.position.set(4, 5, 3)
        dLight.target.position.set(0, 0, 0)

        this.scene.add(light);
        this.scene.add(pointLight)
        this.scene.add(dLight)
        // make eyes and lids
        this.makeOval = this.makeOval.bind(this)
        this.blink1 = this.blink1.bind(this)
        this.blink2 = this.blink2.bind(this)
        let leftEye = this.makeOval(22, "#ffffff")
        let rightEye = this.makeOval(22, "#ffffff")
        leftEye.rotation.z = Math.PI/2
        rightEye.rotation.z = Math.PI/2
        leftEye.position.set(-9, 8, 0)
        rightEye.position.set(9, 8, 0)
        this.lids = []


        // make pupil
        const radius =1.5
        const widthSegments = 25;
        const heightSegments = 17;
        const sphGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments)
        const sphMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color("#0d0a0a")});
        const leftPupil = new THREE.Mesh(sphGeometry, sphMaterial)
        leftPupil.position.set(-13, 8, 3.5)
        const rightPupil = new THREE.Mesh(sphGeometry, sphMaterial)
        rightPupil.position.set(5, 8, 3.5)
        this.scene.add(leftPupil)
        this.scene.add(rightPupil)
        this.scene.add(leftEye);
        this.scene.add(rightEye)

        // set vars for pupil blinkage
        this.xRad = 7.7
        this.yRad = 2.6

        // make camera do the thing
        this.camera.lookAt(0, 0, 0)
        this.render = this.render.bind(this) //bind to class instead of window object

        //teeeeeeeeeeth
        this.makeTeeth = this.makeTeeth.bind(this)
        this.animateTooth = this.animateTooth.bind(this)
        this.topTeeth = []
        this.bottomTeeth = []
        this.makeTeeth(5, "#ffffff")
    }
    makeTeeth(numTeeth,color) {
    for (let i = 0; i < numTeeth; i++) {
        console.log('toof')
        const radius = 2;  // ui: radius
        const height = 4;  // ui: height
        const radialSegments = 16;  // ui: radialSegments
        const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
        const material = new THREE.MeshPhongMaterial({ color: new THREE.Color(color)});
        const topTooth = new THREE.Mesh(geometry, material)
        const bottomTooth = new THREE.Mesh(geometry, material)
        topTooth.position.set(-12 + (radius*2*i), -4, 0)
        bottomTooth.position.set(-12 + (radius*2*i), -12, 0)
        this.scene.add(topTooth)
        this.topTeeth.push(topTooth)
        topTooth.rotation.x = Math.PI
        this.scene.add(bottomTooth)
        this.bottomTeeth.push(bottomTooth)
        }
    }
    animateTooth(i) {
        let clamped = THREE.MathUtils.clamp(Math.sin(i+2), 1, 10)
        if (this.topTeeth[i].position.y > -5) {
            console.log('i: ', i)
            console.log('top tooth position: ', this.topTeeth[i].position.y)
            console.log('clamped: ', clamped)
            this.topTeeth[i].position.y -= clamped
            this.bottomTeeth[i].position.y += clamped
        } else {
        this.topTeeth[i].position.y += clamped
            this.bottomTeeth[i].position.y -= clamped

        }
    }
    // make eye base
    makeOval(numPoints, color) {
        console.log('foo')
        const points = []
        for (let i=0; i < numPoints; ++i) {
            points.push(new THREE.Vector2(Math.sin(i*0.15) * 3, (i-5) *.8))
        }
        const geometry = new THREE.LatheGeometry(points);
        const material = new THREE.MeshPhongMaterial({ color: new THREE.Color(color)});
        const shape = new THREE.Mesh(geometry, material);
        return shape
    }

    //draw blinking motion
    //TODO: refactor so there aren't two of these
    // also make it less dumb
    // FIXME: loop stuck after one iteration
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
            this.mySwitch = false
        } else {
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
        console.log('top teeth: ', this.topTeeth.length-1)
        this.animateTooth(THREE.MathUtils.randInt(0, this.topTeeth.length-1))
        time *= 0.001
//        this.shape.rotation.x = time;
//        this.shape.rotation.y = time
        //
        //this.blink1("#4b5699", 0.01)
        //this.blink2("#4b5699", 0.01)
        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.render)     }

}


