import { DirectionalLight, SpotLight } from 'three'
function createLights(options) {
        const light = new DirectionalLight(options.color, options.intensity);
//        light.target.position.set(0, 0, 0)
        light.castShadow = true
//        light.shadow.camera.near = -200
 //       light.shadow.camera.far = 500
        light.shadow.camera.left = -200
        light.shadow.camera.right= 200
        light.shadow.camera.top = 200
       light.shadow.camera.bottom = -200
        light.shadow.mapSize.width = 2048
        light.shadow.mapSize.height = 2048
			const spotLight = new SpotLight( 0xffffff );
//				spotLight.angle = Math.PI / 5;
        spotLight.target.position.set(0, 0, 0)
				spotLight.penumbra = 0.2;
				spotLight.position.set( 2, 50, 3 );
				spotLight.castShadow = true;
				spotLight.shadow.camera.near = 3;
				spotLight.shadow.camera.far = 10;
//				spotLight.shadow.mapSize.width = 1024;
//				spotLight.shadow.mapSize.height = 1024;
        //light.angle = Math.PI / 5
//        light.position.set(-0, 1000, 1000)
  //      light.position.setScalar(1)
        return [light, spotLight]
}
export {createLights}

