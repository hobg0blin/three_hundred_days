import {MathUtils, Vector2} from 'three'
let theta = 0
let INTERSECTED
const pointer = new Vector2
const radius = 100

function raycastSelector(camera, scene, raycaster) {
//camera.position.x = radius * Math.sin( MathUtils.degToRad( theta ) );
//				camera.position.y = radius * Math.sin( MathUtils.degToRad( theta ) );
//				camera.position.z = radius * Math.cos( MathUtils.degToRad( theta ) );
//				camera.lookAt( scene.position );

				camera.updateMatrixWorld();

				// find intersections

				raycaster.setFromCamera( pointer, camera );

	const intersects = raycaster.intersectObjects( scene.children, false ).filter(child => {
		return child.object.material.hasOwnProperty('emissive')
	});
//	console.log('intersects: ', intersects)

				if ( intersects.length > 0 ) {

					if ( INTERSECTED != intersects[ 0 ].object ) {

//						if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

//						INTERSECTED = intersects[ 0 ].object;
//						INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
//						INTERSECTED.material.emissive.setHex( 0xff0000 );

					}

				} else {

					if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

					INTERSECTED = null;

				}
}

function onPointerMove( event ) {

				pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

export { raycastSelector, onPointerMove }

