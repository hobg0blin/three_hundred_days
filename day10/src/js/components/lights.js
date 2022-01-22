import { DirectionalLight } from 'three'
function createLights(color, intensity) {
        const light = new DirectionalLight(color, intensity);
        light.position.set(-10, 10, 10)
        return light
}
export {createLights}

