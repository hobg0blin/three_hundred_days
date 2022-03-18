import { STLLoader} from 'three/examples/jsm/loaders/STLLoader'

const loader = new STLLoader()

let crabGeo = null
function importSTLModel(filePath, material, callback = () => console.log('model loaded!')) {
  if (crabGeo !== null) {
    console.log('preload crab')
    return callback(crabGeo, material)
  } else {
    return new Promise((resolve) => {  loader.load(filePath, (geometry) => {
      geometry.scale(5, 5, 5)
      crabGeo = geometry
      let mesh = callback(geometry, material)
      mesh.name = filePath
      resolve(mesh)
      })
    })
  }
}

export { importSTLModel }
