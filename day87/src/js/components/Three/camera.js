import { PerspectiveCamera } from 'three'
//TODO actually add args/make this good
function createCamera() {
    const camera = new PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0,20)

//    camera.zoom = 1.5
    return camera
}
export {createCamera}

