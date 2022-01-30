import { PerspectiveCamera } from 'three'
//TODO actually add args/make this good
function createCamera() {
    const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 30000);
    camera.position.set(660, -20, 500)
//    camera.zoom = 1.5
    return camera
}
export {createCamera}

