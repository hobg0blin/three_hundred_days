// Global imports -
import * as THREE from 'three';
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import {createSun} from '../components/Three/sun.js'
import {createCamera} from '../components/Three/camera.js'
import {createLights} from '../components/Three/lights.js'
import {createRenderer} from '../components/Three/renderer.js'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'
import { createFog} from '../components/Three/fog.js'
import {createControls, addToGUI} from '../components/Three/controls.js'
import {raycastSelector, onPointerMove} from '../components/Three/raycastSelector'
import {initPhysics, createObjects, initInput, updatePhysics} from '../components/Three/Physics/PhysicsUtils.js'
import { createWater} from '../components/Three/water.js'
const clock = new THREE.Clock()
let mouse = new THREE.Vector2()

// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Texture {
    constructor() {
      this.render = this.render.bind(this) //bind to class instead of window object
      this.setup = this.setup.bind(this)
      this.initPhysics = initPhysics.bind(this)
      this.createObjects = createObjects.bind(this)
      this.initInput = initInput.bind(this)
      this.updatePhysics = updatePhysics.bind(this)
        // set up scene
      Ammo().then(AmmoLib => {
        Ammo = AmmoLib
        this.setup()
        this.initPhysics()
        this.createObjects()
        this.initInput(this.raycaster)
        this.render()
      })


        //GROUND
//        document.addEventListener('mouseclick', onDocumentMouseClick, false)

}

setup() {
  // CAMERA
        // fov, aspect, near, far

      this.camera = createCamera()
   //     this.camera.up.set(0, 0, -1)
        // SCENE & RENDER
        this.renderer = createRenderer()
        this.scene = new THREE.Scene();
        this.raycaster = new THREE.Raycaster()
      document.addEventListener('mousemove', onPointerMove)

        //LIGHTS
        const color = 0xFFFFFF
        const intensity = 1.9
       this.light = createLights({color: color, intensity: intensity})
        console.log('light: ', this.light)
        this.light[0].position.set(0, 30, 50)
      this.light[0].target.position.set(0, 0, 0)
      this.scene.add(this.light[0].target)
//        this.light[0].position.setScalar(1)
//        this.scene.add(this.light[0], new THREE.AmbientLight(color, 0.9))
      const helper = new THREE.DirectionalLightHelper(this.light[0], 5, 0xff0008)
//      this.scene.add(helper)

				// lights
				const mainLight = new THREE.PointLight( 0xcccccc, 1.5, 250 );
				mainLight.position.y = 60;
				this.scene.add( mainLight );

				const greenLight = new THREE.PointLight( 0x00ff00, 0.25, 1000 );
				greenLight.position.set( 550, 50, 0 );
				this.scene.add( greenLight );

				const redLight = new THREE.PointLight( 0xff0000, 0.25, 1000 );
				redLight.position.set( - 550, 50, 0 );
				this.scene.add( redLight );

				const blueLight = new THREE.PointLight( 0x7f7fff, 0.25, 1000 );
				blueLight.position.set( 0, 50, 550 );
				this.scene.add( blueLight );

//        this.scene.add(this.light[1])
        //BACKGROUND & FOG
        let backgroundColor = new THREE.Color(0x34c9eb)
//       this.scene.background = backgroundColor
        let textureLoader = new THREE.TextureLoader()
//       let backgroundImg = loader.load('studio-bg.jpg')
//      this.scene.background = backgroundImg
//        this.scene.fog = createFog(0x9ab3b2, 40, 450)
        // CONTROLS
  this.controls = createControls(this.camera, this.renderer, {center: {position: { x: 0, y: 0, z: -10}}, autorotate: true})
        let geometry
				geometry = new THREE.CircleGeometry( 40, 64 );
				let groundMirror = new Reflector( geometry, {
					clipBias: 0.003,
					textureWidth: window.innerWidth * window.devicePixelRatio,
					textureHeight: window.innerHeight * window.devicePixelRatio,
					color: 0x777777
				} );
				groundMirror.position.y = 0.5;
				groundMirror.rotateX( - Math.PI / 2 );
				this.scene.add( groundMirror );
        let verticalMirrorGeometry = new THREE.PlaneGeometry(100, 75)
        let verticalMirror = new Reflector(verticalMirrorGeometry,
          {
            clipBias:0.003,
            textureWidth: window.innerWidth* window.devicePixelRatio,
            textureHeight: window.innerHeight* window.devicePixelRatio,
            color: 0x889999
          })
        verticalMirror.position.y = 40
        verticalMirror.position.z = -50
        verticalMirror.position.x = 0
        this.scene.add(verticalMirror)

        let verticalMirrorGeometry2 = new THREE.PlaneGeometry(50, 75)
        let verticalMirror2 = new Reflector(verticalMirrorGeometry2,
          {
            clipBias:0.003,
            textureWidth: window.innerWidth* window.devicePixelRatio,
            textureHeight: window.innerHeight* window.devicePixelRatio,
            color: 0x889999
          })
        verticalMirror2.rotateY(  Math.PI / 2)
        verticalMirror2.position.y = 40
        verticalMirror2.position.z = -25
        verticalMirror2.position.x = -49
        this.scene.add(verticalMirror2)
  let verticalMirror3 = verticalMirror2.clone()
        verticalMirror3.rotateY( - Math.PI )
//        verticalMirror3.rotateY( - Math.PI/2 )
        verticalMirror3.position.y = 40
        verticalMirror3.position.z = -25
        verticalMirror3.position.x = 49
        this.scene.add(verticalMirror3)



  //THE STUFF

				// walls
				const planeGeo = new THREE.PlaneGeometry( 100.1, 100.1 );
				const planeTop = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xffffff } ) );
				planeTop.position.y = 100;
				planeTop.rotateX( Math.PI / 2 );
				this.scene.add( planeTop );
        let hankTex = textureLoader.load('textures/hank.jpg')
        let Nice = textureLoader.load('textures/nice.png')
        Nice.offset.set(-0.2, 0)

				const planeBottom = createWater();
				planeBottom.water.rotateX( - Math.PI / 2 );
				planeBottom.baseMesh.rotateX( - Math.PI / 2 );
        planeBottom.baseMesh.position.y = -1
				this.scene.add( planeBottom.water );
        this.scene.add(planeBottom.baseMesh)

  const planeFront = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { map: hankTex, color: 0x7f7fff } ) );
				planeFront.position.z = 50;
				planeFront.position.y = 50;
				planeFront.rotateY( Math.PI );
				this.scene.add( planeFront );

  const planeRight = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { map: Nice, color: 0x00ff00 } ) );
				planeRight.position.x = 50;
				planeRight.position.y = 50;
				planeRight.rotateY( - Math.PI / 2 );
				this.scene.add( planeRight );

				const planeLeft = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xff0000 } ) );
				planeLeft.position.x = - 50;
				planeLeft.position.y = 50;
				planeLeft.rotateY( Math.PI / 2 );
				this.scene.add( planeLeft );

    }

    render(time, i) {
   //   console.log('foo')
        let range = 1
        this.renderer.setAnimationLoop(() => {

        const xSpd = time * 0.00015
            //TODO: update to proper animation loop per https://discoverthreejs.com/book/first-steps/animation-loop/#timing-in-the-animation-system

//            console.log('camera pos: ', this.camera.position)

            this.updatePhysics(clock.getDelta())
            this.controls.update()

    if (this.anim != undefined) {
            this.mixer.update(clock.getDelta())


    }
 //            this.floor.rotation.y += xSpd
      raycastSelector(this.camera, this.scene, this.raycaster)
            this.renderer.render(this.scene, this.camera)
        })
    }
}


function onDocumentMouseClick(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    console.log('mouse pos:', mouse)
}

