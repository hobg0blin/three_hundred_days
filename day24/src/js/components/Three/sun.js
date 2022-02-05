import { Sky } from 'three/examples/jsm/objects/Sky.js'
import { Vector3, PMREMGenerator } from 'three'
// from https://www.liquid.fish/current/threejs
function createSun(scene, renderer) {
  const sky = new Sky()
  sky.scale.setScalar(25)
  scene.add(sky)
  const pmremGenerator = new PMREMGenerator(renderer);
  const sun = new Vector3();

	// Defining the x, y and z value for our 3D Vector
  const theta = Math.PI * (0.49 - 0.5);
  const phi = 2 * Math.PI * (0.205 - 0.5);
  sun.x = Math.cos(phi);
  sun.y = Math.sin(phi) * Math.sin(theta);
  sun.z = Math.sin(phi) * Math.cos(theta);

  sky.material.uniforms['sunPosition'].value.copy(sun);
  scene.environment = pmremGenerator.fromScene(sky).texture;
  return sun;
}

export{ createSun }
