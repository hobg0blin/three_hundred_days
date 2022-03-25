import { STLLoader} from 'three/examples/jsm/loaders/STLLoader'

const loader = new STLLoader()

function importSTLModel(filePath, material, callback = () => console.log('model loaded!')) {
    return new Promise((resolve) => {  loader.load(filePath, (geometry) => {
      console.log('geo:', geometry)
      let mesh = callback(geometry, material)
      resolve(mesh)
      })
    })
}

export { importSTLModel }
