import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const loader = new GLTFLoader()

function importGLTFModel(filePath, callback = () => console.log('model loaded!')) {
    console.log('foo')
    return new Promise((resolve) => {  loader.load(filePath, (output) => {
//      output.scale(5, 5, 5)
      let callbackOut = callback(output)
      resolve(callbackOut)
      })
    })
}

export { importGLTFModel }
