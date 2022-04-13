import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader}from 'three/examples/jsm/loaders/MTLLoader'


const objLoader = new OBJLoader()
const mtlLoader = new MTLLoader()

function importOBJModel(filePath, matFilepath, callback = () => console.log('model loaded!')) {
    console.log('foo')
    return new Promise((resolve) => {

      mtlLoader.load(matFilepath, (mat) => {
        objLoader.setMaterials(mat)
        objLoader.load(filePath, (output) => {
          console.log('output:', output)
          let callbackOut = callback(output)
          resolve(callbackOut)
        })
      })
    })
}

export { importOBJModel }
