import { DirectionalLight } from 'three'
function createLights(color, intensity) {
        const light = new DirectionalLight(color, intensity);
        light.position.setScalar(1)
        return light
}
export {createLights}

