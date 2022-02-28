import  { WebGLRenderer } from 'three'
function createRenderer() {
     const renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.physicallyCorrectLights = true;
//      renderer.setPixelRatio(2.0)
      renderer.shadowMap.enabled = true
        //camera helper, if needed
//        this.scene.add(new THREE.CameraHelper(this.camera))
        //do not ever delete me
        document.body.append(renderer.domElement)
    return renderer

}
export {createRenderer}
