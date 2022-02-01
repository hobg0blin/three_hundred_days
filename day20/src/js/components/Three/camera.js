import { PerspectiveCamera } from 'three'
//TODO actually add args/make this good
function createCamera() {
    const camera = new PerspectiveCamera(66, window.innerWidth / window.innerHeight, 0.1, 3000);
        camera.position.set(8, 55, 40)
//    camera.zoom = 1.5
    return camera
}
export {createCamera}

