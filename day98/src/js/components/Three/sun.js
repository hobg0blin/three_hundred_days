import { Sky } from 'three/examples/jsm/objects/Sky.js'
import { Vector3, PMREMGenerator } from 'three'
// from https://www.liquid.fish/current/threejs

function createSky(scene, renderer, scalar=2000) {
  const sky = new Sky()
  sky.scale.setScalar(scalar)
  scene.add(sky)
  const pmremGenerator = new PMREMGenerator(renderer);
  const sun = new Vector3();

	// Defining the x, y and z value for our 3D Vector

  sky.material.uniforms['sunPosition'].value.copy(sun);
  scene.environment = pmremGenerator.fromScene(sky).texture;
  return [sky, sun];
}

export{ createSky }
