//FIXME: this just doesn't work
function createStaticPhysicsObject(physicsWorld, shape, mass, maxHeight, minHeight) {
				let groundTransform = new Ammo.btTransform();
				groundTransform.setIdentity();
			// Shifts the terrain, since bullet re-centers it on its bounding box.
				groundTransform.setOrigin( new Ammo.btVector3( 0, ( maxHeight + minHeight ) / 2, 0 ) );
				let groundLocalInertia = new Ammo.btVector3( 0, 0, 0 );
				let groundMotionState = new Ammo.btDefaultMotionState( groundTransform );
				shape.calculateLocalInertia(mass, groundLocalInertia)

				let groundBody = new Ammo.btRigidBody( new Ammo.btRigidBodyConstructionInfo( mass, groundMotionState, shape, groundLocalInertia ) );
				groundBody.setRestitution(1.5)
				groundBody.setDamping(1, 0)
				physicsWorld.addRigidBody( groundBody );
}


export { createStaticPhysicsObject }
