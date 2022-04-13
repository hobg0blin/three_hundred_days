// Global imports -
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import {createSun} from '../components/Three/sun.js'
import {createCamera} from '../components/Three/camera.js'
import {createLights} from '../components/Three/lights.js'
import {createRenderer} from '../components/Three/renderer.js'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'
import { createFog} from '../components/Three/fog.js'
import { morph} from '../components/Three/morph.js'
import {createControls, addToGUI} from '../components/Three/controls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import {raycastSelector, onPointerMove} from '../components/Three/raycastSelector'
import {initPhysics, createPhysicsObjects, initInput, updatePhysics} from '../components/Three/Physics/PhysicsUtils.js'
import {orbit} from '../components/Three/Physics/orbit.js'
const clock = new THREE.Clock()
let mouse = new THREE.Vector2()

let oldTime = 0
let inc = true

// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Texture {
    constructor() {
      this.render = this.render.bind(this) //bind to class instead of window object
      this.setup = this.setup.bind(this)
      this.addObjects = this.addObjects.bind(this)
      this.addBody = this.addBody.bind(this)
      this.initPhysics = initPhysics.bind(this)
      this.createPhysicsObjects = createPhysicsObjects.bind(this)
      this.initInput = initInput.bind(this)
      this.updatePhysics = updatePhysics.bind(this)
        // set up scene
      Ammo().then(AmmoLib => {
        Ammo = AmmoLib
        this.setup()
        this.addObjects()
//        this.initPhysics()
 //       this.createPhysicsObjects()
  //      this.initInput(this.raycaster)
        this.render()
      })


        //GROUND
//        document.addEventListener('mouseclick', onDocumentMouseClick, false)

}

setup() {
  // CAMERA
        // fov, aspect, near, far

        this.camera = createCamera()
        this.camera.lookAt(-45, 0, 0)
   //     this.camera.up.set(0, 0, -1)
        // SCENE & RENDER
        this.renderer = createRenderer()
        this.scene = new THREE.Scene();
        this.raycaster = new THREE.Raycaster()
        document.addEventListener('mousemove', onPointerMove)

        //LIGHTS
        const color = 0xFFFFFF
        const intensity = 0.5
        this.light = createLights({color: color, intensity: intensity})
        this.light[0].position.set(0, 30, 50)
 //       this.light[0].target.position.set(0, 0, 0)
//        this.scene.add(this.light[0].target)
//        this.light[0].position.setScalar(1)
        this.scene.add( new THREE.AmbientLight(color, 0.5))
        this.scene.add( this.light[0])
        const helper = new THREE.DirectionalLightHelper(this.light[0], 5, 0xff0008)
//      this.scene.add(helper)

				// lights
//				const mainLight = new THREE.PointLight(0xfcba03,  1.25, 1 );
//				mainLight.position.set(0, 50, 0);
////				this.scene.add( mainLight );
//				const greenLight = new THREE.PointLight( 0x00ff00, 1.25, 1000 );
//				greenLight.position.set( 50, 0, 0 );
//				this.scene.add( greenLight );
//
//				const redLight = new THREE.PointLight( 'hotpink', 1.25, 1000 );
//				redLight.position.set( - 50, 0, 0 );
//				this.scene.add( redLight );
//
//				const blueLight = new THREE.PointLight( 'aqua', 1.25, 1000 );
//				blueLight.position.set( 0, 0, 150 );
//				this.scene.add( blueLight );
//
        //BACKGROUND & FOG
        let backgroundColor = new THREE.Color(0xfcba03)
//       this.scene.background = backgroundColor
        this.textureLoader = new THREE.TextureLoader()
        let backgroundImg = this.textureLoader.load('studio-bg.jpg')
        this.scene.background = backgroundImg
//        this.scene.fog = createFog(0xfcba03, 20, 200)
        // CONTROLS
  this.controls = createControls(this.camera, this.renderer)
         }


    addObjects() {
      const listener = new THREE.AudioListener();
      this.camera.add( listener );

      //CAT

  var canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        var context = canvas.getContext('2d');
        for (var i = 0; i < 20000; ++i) {
            // r = hair 1/0, g = length, b = darkness
            context.fillStyle = "rgba(255," + Math.floor(Math.random() * 200) + "," + Math.floor(Math.random() * 200) + ",1)";

            context.fillRect((Math.random() * canvas.width), (Math.random() * canvas.height), 2, 2);
        }
        var hairPropertiesTexture = new THREE.CanvasTexture(canvas);
        // Load texture information for color from image file.
//        var colorTexture = new THREE.TextureLoader().load("./textures/purple.png");

        // Creating geometry for fur shaded mesh.
        this.shells = 100;
//        var geometry = new THREE.TorusBufferGeometry(3, 1, 16, 50);
        var geometry = new THREE.SphereBufferGeometry(5, 32, 32);
//        geometry.applyMatrix(new THREE.Matrix4().scale(new THREE.Vector3(10, 10, 10)));
        var vertexShader = document.getElementById('vertexShader').textContent;
        var fragmentShader = document.getElementById('fragmentShader').textContent;
        let catFurTex = this.textureLoader.load('textures/cat_fur.jpg')
        this.shaderTime = 0;
        this.cubeLayers = [];
        var gravity = new THREE.Vector3(.25, -.25, 0);
        for (var i = 0; i < this.shells; i++) {
            var uniforms = {
                color: { type: "c", value: new THREE.Color(0xffffff) },
                hairMap: { type: "t", value: hairPropertiesTexture },
                offset: { type: "f", value: i / 40 },
                colorMap: {type: "t", value: catFurTex},
                globalTime: { type: "f", value: this.shaderTime },
                gravity: { type: "v3", value: gravity }
            };

            var mat = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                transparent: true
            })

            //mat = new THREE.MeshNormalMaterial();
            var cube = new THREE.Mesh(geometry, mat);

            //cube.matrixAutoUpdate = false; // Not sure why he's doing this.
            cube.frustumCulled = false; // Presumably so we always see the whole mesh?

            this.scene.add(cube);
            this.cubeLayers.push(cube);
        }
        let eyeGeo = new THREE.SphereGeometry(0.65, 12, 12)
        let pupilGeo = new THREE.SphereGeometry(0.5, 12, 12)
        let earGeo = new THREE.ConeGeometry(3, 4, 4)
        let noseGeo = new THREE.ConeGeometry(1, 2, 4)
        let yellowMat = new THREE.MeshPhongMaterial({color: 'yellow'})
        let blackMat = new THREE.MeshPhongMaterial({color: 'black'})
        let pinkMat = new THREE.MeshPhongMaterial({color: 'pink'})
        let ear1 = new THREE.Mesh(earGeo, blackMat)
        ear1.position.set(-3, 5, 0)
        ear1.rotation.z = THREE.MathUtils.degToRad(25)
        let ear2 = ear1.clone()
        ear2.position.set(3, 5, 0)
        ear2.rotation.z = THREE.MathUtils.degToRad(-25)
        let eye1 = new THREE.Mesh(eyeGeo, yellowMat)
        eye1.scale.set(1.5, 1, 1)
        eye1.position.set(-2, 2.5, 4.4)
        let eye2 = eye1.clone()
        eye2.position.set(2, 2.5, 4.4)

        let pupil1 = new THREE.Mesh(pupilGeo, blackMat)
        pupil1.position.set(-2, 3.25, 5.15)
        let pupil2 = pupil1.clone()
        pupil1.position.set(2, 3.25, 5.15)

        let nose = new THREE.Mesh(noseGeo, pinkMat)
        nose.rotation.x = THREE.MathUtils.degToRad(180)
        nose.position.set(0, 0.8, 5)
      // smile
        class CustomSinCurve extends THREE.Curve {
          constructor(scale) {
            super();
            this.scale = scale;
          }
          getPoint(t) {
            const tx = t * 3 - 1.5;
            const ty = Math.sin(Math.PI * t);
            const tz = 0;
            return new THREE.Vector3(tx, ty*0.1, tz).multiplyScalar(this.scale);
          }
        }

        const path = new CustomSinCurve(1);
        const tubularSegments = 20;  // ui: tubularSegments
        const radius = 0.2;  // ui: radius
        const radialSegments = 8;  // ui: radialSegments
        const closed = false;  // ui: closed
        const tubeGeo = new THREE.TubeGeometry(
            path, tubularSegments, radius, radialSegments, closed);
        const smile = new THREE.Mesh(tubeGeo, pinkMat)
        smile.position.set(0, -0.5, 5.5)
        this.smile2 = smile.clone()
// cat background
        let bgMesh = new THREE.Mesh(geometry, blackMat)
        //ad em all in
        this.scene.add(ear1, ear2, eye1, eye2, pupil1, pupil2, nose, smile, this.smile2, bgMesh)
      function setSound(soundString, sound) {
        console.log(sound.getDetune())
        console.log(sound.getPlaybackRate())
        if (soundString == 'meow_1.wav') {
          soundString == 'meow_2.wav'
        } else {
          soundString == 'meow_1.wav'
        audioLoader.load( 'meow_1.wav', function( buffer ) {
          sound.setBuffer( buffer );
          sound.setLoop( true );
          sound.setVolume( 0.5 );
        });
        }

      }
      // create a global audio source
      this.sound = new THREE.Audio( listener );

      // load a sound and set it as the Audio object's buffer
      const audioLoader = new THREE.AudioLoader();
      this.soundString = 'meow_2.ogg'
      setSound(this.soundString, this.sound)
			window.addEventListener('keydown', function(e) {
				handleKeyDown(e)
			})
			window.addEventListener('keyup', function(e) {
        handleKeyUp(e)
			})
      let detune = 0
      let playBackRate = 1
      function handleKeyDown(event) {
        this.keyUp = false
        if (event.keyCode == 32) {
          this.sound.play()
          this.smile2.rotation.x = THREE.MathUtils.degToRad(180)
          this.smile2.position.y-=0.01
        }
        console.log('detune: ', detune)
        console.log('playbackrate: ', this.sound.getPlaybackRate())
        if (event.keyCode  == 87) {
          this.sound.setDetune(detune+=100)
        }
        if (event.keyCode == 83) {
          this.sound.setDetune(detune-= 100)
        }

        if (event.keyCode == 68) {
          this.sound.setPlaybackRate(playBackRate += 0.5)
        }
        if (event.keyCode  == 65) {
          this.sound.setPlaybackRate(playBackRate -= 0.5)
        }

      }
      this.keyUp = false
      function handleKeyUp(event) {
        console.log('foo')

        if (event.keyCode == 32) {
          this.sound.pause()
          this.keyUp = true

        }
      }
      handleKeyDown = handleKeyDown.bind(this)
      handleKeyUp = handleKeyUp.bind(this)

    }

    render(time, i) {
        this.renderer.setAnimationLoop(() => {

        const xSpd = time * 0.00015
          if (this.smile2.position.y < -0.5 && this.keyUp == true) {
            this.smile2.position.y+=0.1
            if(this.smile2.position.y >= -0.5) {
              this.smile2.rotation.x = THREE.MathUtils.degToRad(360)
            }
          }
  //animate shaders
          for (var i = 0; i < this.shells; i++) {
//                this.cubeLayers[i].rotation.x += 0.005;
 //               this.cubeLayers[i].rotation.y += 0.005;
            }
          let newTime = Date.now();
          let delta = newTime - oldTime;
          oldTime = newTime;

          if (isNaN(delta) || delta > 1000 || delta == 0) {
              delta = 1000 / 60;
          }
          this.shaderTime += delta * 0.005;

          for (var i = 0; i < this.cubeLayers.length; i++) {
              this.cubeLayers[i].material.uniforms.globalTime.value = this.shaderTime;
          }


            //TODO: update to proper animation loop per https://discoverthreejs.com/book/first-steps/animation-loop/#timing-in-the-animation-system

//            console.log('camera pos: ', this.camera.position)
  //animate shaders
    //            this.updatePhysics(delta)
          //j:w
          //this.controls.update()

 //            this.floor.rotation.y += xSpd
//      raycastSelector(this.camera, this.scene, this.raycaster)
            this.renderer.render(this.scene, this.camera)
        })
    }

   addBody(output) {
    console.log('output: ', output)

    let model = output
    model.traverse(child => {
      if (child.geometry != undefined) {
        child.material = this.bodyMat

      }
    })
    model.position.y = 1
    model.scale.set(0.02, 0.02, 0.02)
    model.position.x = this.modX
    model.position.z = this.modZ
      this.modX+=5
    model.rotation.y = THREE.MathUtils.degToRad(-45)
    model.orbitRadius = getRandomInt(20, 40)
    this.model = model
    //remove prebuilt lighting
//    this.model.children.splice(3, 1)
//    model.scale.set(0.001, 0.001, 0.001)
    let mixer = new THREE.AnimationMixer(model)
    let newAnim = mixer.clipAction(output.animations[this.animNum])
//    newAnim.setLoop(THREE.LoopOnce)
//    newAnim.clampWhenFinished = true
    this.mixers.push(mixer)
    newAnim.setEffectiveTimeScale(0.5)
    newAnim.play()
    this.models.push(model)
    this.scene.add(model)
    this.animNum++
    return model
}
}



function onDocumentMouseClick(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    console.log('mouse pos:', mouse)
}

