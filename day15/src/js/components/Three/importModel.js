import { STLLoader} from 'three/examples/jsm/loaders/STLLoader'

const loader = new STLLoader()

function importModel(filePath, material, callback = () => console.log('model loaded!')) {
  return new Promise((resolve) => {  loader.load(filePath, (geometry) => {
    console.log('foo')

    let mesh = callback(geometry, material)
      resolve(mesh)
    })
  })
}

export { importModel }
