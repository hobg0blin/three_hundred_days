import {MathUtils, BoxGeometry, SphereGeometry, TorusKnotGeometry, Mesh, Vector2, Vector3, MeshPhongMaterial, MeshStandardMaterial, RepeatWrapping, Quaternion, TextureLoader, VideoTexture} from 'three'
import {ConvexObjectBreaker} from 'three/examples/jsm/misc/ConvexObjectBreaker.js'
import {ConvexGeometry} from 'three/examples/jsm/geometries/ConvexGeometry.js'
//code from https://github.com/mrdoob/three.js/blob/dev/examples/physics_ammo_break.html
const ballMaterial = new MeshPhongMaterial( { color: 0x202020 } );
const textureLoader = new TextureLoader()
let scene;
let camera
let rigidBodies = []
let physicsWorld
const gravityConstant = 0.1;
const margin = 0.05
const convexBreaker = new ConvexObjectBreaker
const mouseCoords = new Vector2();
const pos = new Vector3();
		const quat = new Quaternion();
		let transformAux1;
		let tempBtVec3_1;

		const objectsToRemove = [];

		for ( let i = 0; i < 500; i ++ ) {

			objectsToRemove[ i ] = null;

		}

		let numObjectsToRemove = 0;

		const impactPoint = new Vector3();
		const impactNormal = new Vector3();

		function initPhysics() {
			console.log('foo')
			scene = this.scene
			camera = this.camera
			// Physics configuration

			this.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
		this.dispatcher = new Ammo.btCollisionDispatcher( this.collisionConfiguration );
			this.broadphase = new Ammo.btDbvtBroadphase();
		this.solver = new Ammo.btSequentialImpulseConstraintSolver();
		physicsWorld = new Ammo.btDiscreteDynamicsWorld( this.dispatcher, this.broadphase, this.solver, this.collisionConfiguration );
		physicsWorld.setGravity( new Ammo.btVector3( 0, - gravityConstant, 0 ) );

			transformAux1 = new Ammo.btTransform();
			tempBtVec3_1 = new Ammo.btVector3( 0, 0, 0 );

		}

		function createObject(object, mass, pos, quat ) {
			object.position.copy( pos );
			object.rotation.y = MathUtils.degToRad(Math.random() * 180)
			object.quaternion.copy( quat );
			convexBreaker.prepareBreakableObject( object, mass, new Vector3(), new Vector3(), true );
			createDebrisFromBreakableObject( object );

		}

		function createObjects() {

			// Groundobject.material
			pos.set( 0, - 0.5, 0 );
			quat.set( 0, 0, 0, 1 );
			const ground = createParalellepipedWithPhysics( 60, 1, 60, 0, pos, quat, new MeshPhongMaterial( { color: 0xFFFFFF } ) );
			ground.receiveShadow = true;
			textureLoader.load( 'textures/grid.png', function ( texture ) {

				texture.wrapS = RepeatWrapping;
				texture.wrapT = RepeatWrapping;
				texture.repeat.set( 40, 40 );
				ground.material.map = texture;
				ground.material.needsUpdate = true;

			} );


			// Stones
			const stoneMass = 120;
			const stoneHalfExtents = new Vector3( 3.5, 1.5, 64);
			const numStones = 4;
			let video = document.getElementById('video')
			let videoTex = new VideoTexture(video)
			videoTex.wrapT = RepeatWrapping
			videoTex.wrapS = RepeatWrapping
			videoTex.repeat.set(8, 2, 1)
			let stoneMat = new MeshPhongMaterial({ map: videoTex, emissive: 0xffb00, emissiveIntensity: 0.3})
			const p = 2
			const q = 6


		quat.set( 0, 0, 0, 1 );
			for ( let i = -4; i < numStones; i +=2 ) {
				for (let j = -numStones; j < 5; j+=2) {
				console.log('add stone')
					let object
				if (i % 4 == 0) {
				 object = new Mesh( new TorusKnotGeometry( stoneHalfExtents.x, stoneHalfExtents.y, stoneHalfExtents.z, stoneHalfExtents.z, p, q ), stoneMat );
				} else {
					object =
				 object = new Mesh( new SphereGeometry(2, 6, 6), stoneMat );
				}
				pos.set( i * 3, 0, (j * 3));
					createObject(object, stoneMass, pos, quat);
}
			}

			// Mountain
			const mountainMass = 860;
			const mountainHalfExtents = new Vector3( 4, 5, 4 );
			pos.set( 5, mountainHalfExtents.y * 0.5, - 7 );
			quat.set( 0, 0, 0, 1 );
			const mountainPoints = [];
			mountainPoints.push( new Vector3( mountainHalfExtents.x, - mountainHalfExtents.y, mountainHalfExtents.z ) );
			mountainPoints.push( new Vector3( - mountainHalfExtents.x, - mountainHalfExtents.y, mountainHalfExtents.z ) );
			mountainPoints.push( new Vector3( mountainHalfExtents.x, - mountainHalfExtents.y, - mountainHalfExtents.z ) );
			mountainPoints.push( new Vector3( - mountainHalfExtents.x, - mountainHalfExtents.y, - mountainHalfExtents.z ) );
			mountainPoints.push( new Vector3( 0, mountainHalfExtents.y, 0 ) );
			const mountain = new Mesh( new ConvexGeometry( mountainPoints ), createMaterial( 0xB03814 ) );
			mountain.position.copy( pos );
			mountain.quaternion.copy( quat );
			//convexBreaker.prepareBreakableObject( mountain, mountainMass, new Vector3(), new Vector3(), true );
			//createDebrisFromBreakableObject( mountain );

		}

		function createParalellepipedWithPhysics( sx, sy, sz, mass, pos, quat, material ) {

			const object = new Mesh( new BoxGeometry( sx, sy, sz, 1, 1, 1 ), material );
			const shape = new Ammo.btBoxShape( new Ammo.btVector3( sx * 0.5, sy * 0.5, sz * 0.5 ) );
			shape.setMargin( margin );

			createRigidBody( object, shape, mass, pos, quat );

			return object;

		}

		function createDebrisFromBreakableObject( object ) {

			object.castShadow = true;
			object.receiveShadow = true;

			const shape = createConvexHullPhysicsShape( object.geometry.attributes.position.array );
			shape.setMargin( margin );

			const body = createRigidBody( object, shape, object.userData.mass, null, null, object.userData.velocity, object.userData.angularVelocity );

			// Set pointer back to the three object only in the debris objects
			const btVecUserData = new Ammo.btVector3( 0, 0, 0 );
			btVecUserData.threeObject = object;
			body.setUserPointer( btVecUserData );

		}

		function removeDebris( object ) {

			scene.remove( object );

		physicsWorld.removeRigidBody( object.userData.physicsBody );

		}

		function createConvexHullPhysicsShape( coords ) {

			const shape = new Ammo.btConvexHullShape();

			for ( let i = 0, il = coords.length; i < il; i += 3 ) {

				tempBtVec3_1.setValue( coords[ i ], coords[ i + 1 ], coords[ i + 2 ] );
				const lastOne = ( i >= ( il - 3 ) );
				shape.addPoint( tempBtVec3_1, lastOne );

			}

			return shape;

		}

		function createRigidBody( object, physicsShape, mass, pos, quat, vel, angVel ) {

			if ( pos ) {

				object.position.copy( pos );

			} else {

				pos = object.position;

			}

			if ( quat ) {

				object.quaternion.copy( quat );

			} else {

				quat = object.quaternion;

			}

			const transform = new Ammo.btTransform();
			transform.setIdentity();
			transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
			transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
			const motionState = new Ammo.btDefaultMotionState( transform );

			const localInertia = new Ammo.btVector3( 0, 0, 0 );
			physicsShape.calculateLocalInertia( mass, localInertia );

			const rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, physicsShape, localInertia );
			const body = new Ammo.btRigidBody( rbInfo );

			body.setFriction( 0.5 );

			if ( vel ) {

				body.setLinearVelocity( new Ammo.btVector3( vel.x, vel.y, vel.z ) );

			}

			if ( angVel ) {

				body.setAngularVelocity( new Ammo.btVector3( angVel.x, angVel.y, angVel.z ) );

			}

			object.userData.physicsBody = body;
			object.userData.collided = false;

			scene.add( object );

			if ( mass > 0 ) {

				rigidBodies.push( object );

				// Disable deactivation
				body.setActivationState( 4 );

			}

		physicsWorld.addRigidBody( body );

			return body;

		}

		function createRandomColor() {

			return Math.floor( Math.random() * ( 1 << 24 ) );

		}

		function createMaterial( color ) {

			color = color || createRandomColor();
			return new MeshPhongMaterial( { color: color } );

		}

		function initInput(raycaster) {

			window.addEventListener( 'pointerdown', function ( event ) {

				mouseCoords.set(
					( event.clientX / window.innerWidth ) * 2 - 1,
					- ( event.clientY / window.innerHeight ) * 2 + 1
				);

				raycaster.setFromCamera( mouseCoords, camera );

				// Creates a ball and throws it
				const ballMass = 35;
				const ballRadius = 0.4;

				const ball = new Mesh( new SphereGeometry( ballRadius, 14, 10 ), ballMaterial );
				ball.castShadow = true;
				ball.receiveShadow = true;
				const ballShape = new Ammo.btSphereShape( ballRadius );
				ballShape.setMargin( margin );
				pos.copy( raycaster.ray.direction );
				pos.add( raycaster.ray.origin );
				quat.set( 0, 0, 0, 1 );
				const ballBody = createRigidBody( ball, ballShape, ballMass, pos, quat );

				pos.copy( raycaster.ray.direction );
				pos.multiplyScalar( 24 );
				ballBody.setLinearVelocity( new Ammo.btVector3( pos.x, pos.y, pos.z ) );

			} );

		}
function updatePhysics( deltaTime ) {

			// Step world
		physicsWorld.stepSimulation( deltaTime, 10 );

			// Update rigid bodies
			for ( let i = 0, il = rigidBodies.length; i < il; i ++ ) {

				const objThree =rigidBodies[ i ];
				const objPhys = objThree.userData.physicsBody;
				const ms = objPhys.getMotionState();

				if ( ms ) {

					ms.getWorldTransform( transformAux1 );
					const p = transformAux1.getOrigin();
					const q = transformAux1.getRotation();
					objThree.position.set( p.x(), p.y(), p.z() );
					objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() );

					objThree.userData.collided = false;

				}

			}

			for ( let i = 0, il =this.dispatcher.getNumManifolds(); i < il; i ++ ) {

				const contactManifold =this.dispatcher.getManifoldByIndexInternal( i );
				const rb0 = Ammo.castObject( contactManifold.getBody0(), Ammo.btRigidBody );
				const rb1 = Ammo.castObject( contactManifold.getBody1(), Ammo.btRigidBody );

				const threeObject0 = Ammo.castObject( rb0.getUserPointer(), Ammo.btVector3 ).threeObject;
				const threeObject1 = Ammo.castObject( rb1.getUserPointer(), Ammo.btVector3 ).threeObject;

				if ( ! threeObject0 && ! threeObject1 ) {

					continue;

				}

				const userData0 = threeObject0 ? threeObject0.userData : null;
				const userData1 = threeObject1 ? threeObject1.userData : null;

				const breakable0 = userData0 ? userData0.breakable : false;
				const breakable1 = userData1 ? userData1.breakable : false;

				const collided0 = userData0 ? userData0.collided : false;
				const collided1 = userData1 ? userData1.collided : false;

				if ( ( ! breakable0 && ! breakable1 ) || ( collided0 && collided1 ) ) {

					continue;

				}

				let contact = false;
				let maxImpulse = 0;
				for ( let j = 0, jl = contactManifold.getNumContacts(); j < jl; j ++ ) {

					const contactPoint = contactManifold.getContactPoint( j );

					if ( contactPoint.getDistance() < 0 ) {

						contact = true;
						const impulse = contactPoint.getAppliedImpulse();

						if ( impulse > maxImpulse ) {

							maxImpulse = impulse;
							const pos = contactPoint.get_m_positionWorldOnB();
							const normal = contactPoint.get_m_normalWorldOnB();
							impactPoint.set( pos.x(), pos.y(), pos.z() );
							impactNormal.set( normal.x(), normal.y(), normal.z() );

						}

						break;

					}

				}

				// If no point has contact, abort
				if ( ! contact ) continue;

				// Subdivision

//				const fractureImpulse = 250;
//
//				if ( breakable0 && ! collided0 && maxImpulse > fractureImpulse ) {
//
//					const debris = convexBreaker.subdivideByImpact( threeObject0, impactPoint, impactNormal, 1, 2, 1.5 );
//
//					const numObjects = debris.length;
//					for ( let j = 0; j < numObjects; j ++ ) {
//
//						const vel = rb0.getLinearVelocity();
//						const angVel = rb0.getAngularVelocity();
//						const fragment = debris[ j ];
//						fragment.userData.velocity.set( vel.x(), vel.y(), vel.z() );
//						fragment.userData.angularVelocity.set( angVel.x(), angVel.y(), angVel.z() );
//
//						createDebrisFromBreakableObject( fragment );
//
//					}
//
//					objectsToRemove[ numObjectsToRemove ++ ] = threeObject0;
//					userData0.collided = true;
//
//				}
//
//				if ( breakable1 && ! collided1 && maxImpulse > fractureImpulse ) {
//
//					const debris = convexBreaker.subdivideByImpact( threeObject1, impactPoint, impactNormal, 1, 2, 1.5 );
//
//					const numObjects = debris.length;
//					for ( let j = 0; j < numObjects; j ++ ) {
//
//						const vel = rb1.getLinearVelocity();
//						const angVel = rb1.getAngularVelocity();
//						const fragment = debris[ j ];
//						fragment.userData.velocity.set( vel.x(), vel.y(), vel.z() );
//						fragment.userData.angularVelocity.set( angVel.x(), angVel.y(), angVel.z() );
//
//						createDebrisFromBreakableObject( fragment );
//
//					}
//
//					objectsToRemove[ numObjectsToRemove ++ ] = threeObject1;
//					userData1.collided = true;
//
//				}
//
			}

			for ( let i = 0; i < numObjectsToRemove; i ++ ) {

				removeDebris( objectsToRemove[ i ] );

			}

			numObjectsToRemove = 0;

  }

export { initPhysics, createObjects, initInput, updatePhysics}
