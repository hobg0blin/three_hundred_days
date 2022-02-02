import { PerspectiveCamera } from 'three'
//TODO actually add args/make this good
function createCamera() {
    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000);
        camera.position.set(0, 50, 25)
//    camera.zoom = 1.5
    return camera
}
export {createCamera}

