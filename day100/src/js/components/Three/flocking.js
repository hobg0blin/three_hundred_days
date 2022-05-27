import * as THREE from 'three';

			import Stats from 'three/examples/jsm/libs/stats.module.js';
			import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

			import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';

			/* TEXTURE WIDTH FOR SIMULATION */
			const WIDTH = 32;

			const BIRDS = WIDTH * WIDTH;

			// Custom Geometry - using 3 triangles each. No UVs, no normals currently.
class BirdGeometry extends THREE.BufferGeometry {

				constructor() {

					super();

					const trianglesPerBird = 4;
					const triangles = BIRDS *trianglesPerBird;
					const points = triangles *4;

					const vertices = new THREE.BufferAttribute( new Float32Array( points * 3 ), 3 );
					const uvs = new THREE.BufferAttribute( new Float32Array( points* 3  ), 2 );
					const references = new THREE.BufferAttribute( new Float32Array( points * 2 ), 2 );
					const birdVertex = new THREE.BufferAttribute( new Float32Array( points ), 1 );

					this.setAttribute( 'position', vertices );
					this.setAttribute( 'uv', uvs );
					this.setAttribute( 'reference', references );
					this.setAttribute( 'birdVertex', birdVertex );

					// this.setAttribute( 'normal', new Float32Array( points * 3 ), 3 );


					let v = 0;
					let z = 0;

					function verts_push() {

						for ( let i = 0; i < arguments.length; i ++ ) {

							vertices.array[ v ++ ] = arguments[ i ];

						}

					}
					function uvs_push() {

						for ( let i = 0; i < arguments.length; i ++ ) {

							uvs.array[ z ++ ] = arguments[ i ];

						}

					}


    // Identify the image size
    var imageSize = {width: 25, height:25};

    // Identify the x, y, z coords where the image should be placed
    var coords = {x: 0, y: 0, z: 0};

					for ( let f = 0; f < BIRDS; f ++ ) {

						uvs_push(     0.0, 0.0,
						1.0, 0.0,
						1.0, 1.0,
						0.0, 1.0)
						// Body

						verts_push(
    coords.x, coords.y, coords.z, // bottom left
      coords.x+imageSize.width, coords.y, coords.z, // bottom right
      coords.x+imageSize.width, coords.y+imageSize.height, coords.z, // upper right
      coords.x, coords.y+imageSize.height, coords.z, // upper left						);
						)

					}
					console.log('uvs: ', uvs)
					console.log('vertices: ',  vertices)

					for ( let v = 0; v < triangles * 3; v ++ ) {

						const triangleIndex = ~ ~ ( v / 3 );
						const birdIndex = ~ ~ ( triangleIndex / trianglesPerBird );
						const x = ( birdIndex % WIDTH ) / WIDTH;
						const y = ~ ~ ( birdIndex / WIDTH ) / WIDTH;

						references.array[ v * 2 ] = x;
						references.array[ v * 2 + 1 ] = y;

						birdVertex.array[ v ] = v % 9;

					}

//					this.scale( 0.2, 0.2, 0.2 );

				}

			}

			//

			let container, stats;
			let mouseX = 0, mouseY = 0;

			let windowHalfX = window.innerWidth / 2;
			let windowHalfY = window.innerHeight / 2;

			const BOUNDS = 200, BOUNDS_HALF = BOUNDS / 2;

			let last = performance.now();

			let gpuCompute;
			let velocityVariable;
			let positionVariable;
			let positionUniforms;
			let velocityUniforms;
			let birdUniforms;


			function initFlocking() {
				console.log('init birds')

				initComputeRenderer(this.renderer);

				stats = new Stats();
				document.body.appendChild( stats.dom );

				document.body.addEventListener( 'pointermove', onPointerMove );

				//

				window.addEventListener( 'resize', onWindowResize );

				const gui = new GUI();


				const effectController = {
					separation: 40.0,
					alignment: 60.0,
					cohesion: 50.0,
					freedom: 0.55
				};

				const valuesChanger = function () {

					velocityUniforms[ 'separationDistance' ].value = effectController.separation;
					velocityUniforms[ 'alignmentDistance' ].value = effectController.alignment;
					velocityUniforms[ 'cohesionDistance' ].value = effectController.cohesion;
					velocityUniforms[ 'freedomFactor' ].value = effectController.freedom;

				};

				valuesChanger();

				gui.add( effectController, 'separation', 0.0, 100.0, 1.0 ).onChange( valuesChanger );
				gui.add( effectController, 'alignment', 0.0, 100, 0.001 ).onChange( valuesChanger );
				gui.add( effectController, 'cohesion', 0.0, 100, 0.025 ).onChange( valuesChanger );
				gui.close();

				initBirds(this.scene);

			}

			function initComputeRenderer(renderer) {

				gpuCompute = new GPUComputationRenderer( WIDTH, WIDTH, renderer );

				if ( renderer.capabilities.isWebGL2 === false ) {

					gpuCompute.setDataType( THREE.HalfFloatType );

				}

				const dtPosition = gpuCompute.createTexture();
				const dtVelocity = gpuCompute.createTexture();
				fillPositionTexture( dtPosition );
				fillVelocityTexture( dtVelocity );

				velocityVariable = gpuCompute.addVariable( 'textureVelocity', document.getElementById( 'fragmentShaderVelocity' ).textContent, dtVelocity );
				positionVariable = gpuCompute.addVariable( 'texturePosition', document.getElementById( 'fragmentShaderPosition' ).textContent, dtPosition );

				gpuCompute.setVariableDependencies( velocityVariable, [ positionVariable, velocityVariable ] );
				gpuCompute.setVariableDependencies( positionVariable, [ positionVariable, velocityVariable ] );

				positionUniforms = positionVariable.material.uniforms;
				velocityUniforms = velocityVariable.material.uniforms;

				positionUniforms[ 'time' ] = { value: 0.0 };
				positionUniforms[ 'delta' ] = { value: 0.0 };
				velocityUniforms[ 'time' ] = { value: 1.0 };
				velocityUniforms[ 'delta' ] = { value: 0.0 };
				velocityUniforms[ 'testing' ] = { value: 1.0 };
				velocityUniforms[ 'separationDistance' ] = { value: 1.0 };
				velocityUniforms[ 'alignmentDistance' ] = { value: 1.0 };
				velocityUniforms[ 'cohesionDistance' ] = { value: 1.0 };
				velocityUniforms[ 'freedomFactor' ] = { value: 1.0 };
				velocityUniforms[ 'predator' ] = { value: new THREE.Vector3() };
				velocityVariable.material.defines.BOUNDS = BOUNDS.toFixed( 2 );

				velocityVariable.wrapS = THREE.RepeatWrapping;
				velocityVariable.wrapT = THREE.RepeatWrapping;
				positionVariable.wrapS = THREE.RepeatWrapping;
				positionVariable.wrapT = THREE.RepeatWrapping;

				const error = gpuCompute.init();

				if ( error !== null ) {

					console.error( error );

				}

			}

			function initBirds(scene) {

				const geometry = new BirdGeometry();

				let textureLoader = new THREE.TextureLoader()
				let hankTex = textureLoader.load('textures/hank.jpg')
				hankTex.wrapS = THREE.RepeatWrapping;
				hankTex.wrapT = THREE.RepeatWrapping;
//				hankTex.repeat.set(0.01, 0.01, 0.01)



				// For Vertex and Fragment
				birdUniforms = {
					'texturePosition': { value: null },
					'textureVelocity': { value: null },
					'time': { value: 1.0 },
					'delta': { value: 0.0 },
					'map': { type: 't', value: hankTex}
				};
								// THREE.ShaderMaterial
				const material = new THREE.ShaderMaterial( {
					uniforms: birdUniforms,
					vertexShader: document.getElementById( 'birdVS' ).textContent,
					fragmentShader: document.getElementById( 'birdFS' ).textContent,
					side: THREE.DoubleSide,
					map: hankTex
				} );
				material.map = hankTex;

				const birdMesh = new THREE.Mesh( geometry, material );
				birdMesh.rotation.y = Math.PI / 2;
				birdMesh.matrixAutoUpdate = false;
				birdMesh.updateMatrix();
				console.log('bird mesh: ', birdMesh)

				scene.add( birdMesh );

			}

			function fillPositionTexture( texture ) {

				const theArray = texture.image.data;

				for ( let k = 0, kl = theArray.length; k < kl; k += 4 ) {

					const x = Math.random() * BOUNDS - BOUNDS_HALF;
					const y = Math.random() * BOUNDS - BOUNDS_HALF;
					const z = Math.random() * BOUNDS - BOUNDS_HALF;

					theArray[ k + 0 ] = x;
					theArray[ k + 1 ] = y;
					theArray[ k + 2 ] = z;
					theArray[ k + 3 ] = 1;

				}

			}

			function fillVelocityTexture( texture ) {

				const theArray = texture.image.data;

				for ( let k = 0, kl = theArray.length; k < kl; k += 4 ) {

					const x = Math.random() - 0.5;
					const y = Math.random() - 0.5;
					const z = Math.random() - 0.5;

					theArray[ k + 0 ] = x * 10;
					theArray[ k + 1 ] = y * 10;
					theArray[ k + 2 ] = z * 10;
					theArray[ k + 3 ] = 1;

				}

			}

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				this.camera.aspect = window.innerWidth / window.innerHeight;
				this.camera.updateProjectionMatrix();

				this.renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function onPointerMove( event ) {

				if ( event.isPrimary === false ) return;

				mouseX = event.clientX - windowHalfX;
				mouseY = event.clientY - windowHalfY;

			}

			//

			function renderFlocking() {

				stats.update();
				const now = performance.now();
				let delta = ( now - last ) / 1000;

				if ( delta > 1 ) delta = 1; // safety cap on large deltas
				last = now;

				positionUniforms[ 'time' ].value = now;
				positionUniforms[ 'delta' ].value = delta;
				velocityUniforms[ 'time' ].value = now;
				velocityUniforms[ 'delta' ].value = delta;
				birdUniforms[ 'time' ].value = now;
				birdUniforms[ 'delta' ].value = delta;

				velocityUniforms[ 'predator' ].value.set( 0.5 * mouseX / windowHalfX, - 0.5 * mouseY / windowHalfY, 0 );

				mouseX = 10000;
				mouseY = 10000;

				gpuCompute.compute();

				birdUniforms[ 'texturePosition' ].value = gpuCompute.getCurrentRenderTarget( positionVariable ).texture;
				birdUniforms[ 'textureVelocity' ].value = gpuCompute.getCurrentRenderTarget( velocityVariable ).texture;


			}

export { initFlocking, renderFlocking}
