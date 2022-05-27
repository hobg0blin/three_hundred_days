import  { WebGLRenderer } from 'three'
function createRenderer() {
     const renderer = new WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight)
//    renderer.physicallyCorrectLights = true;
    renderer.setPixelRatio(window.devicePixelRatio)
      renderer.shadowMapEnabled = true
      renderer.shadowMapSoft = true
        //do not ever delete me
        document.body.append(renderer.domElement)
    return renderer

}
export {createRenderer}
