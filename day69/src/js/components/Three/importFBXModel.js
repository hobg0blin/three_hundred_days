import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

const loader = new FBXLoader()

let savedModel = null
function importFBXModel(filePath, callback = () => console.log('model loaded!')) {
  console.log('loading FBX')
    return new Promise((resolve) => {  loader.load(filePath, (output) => {
      console.log('output:', output)
//      output.scale(5, 5, 5)
      savedModel = output
      let callbackOut = callback(output)
      resolve(callbackOut)
      })
    })
}

export { importFBXModel }
