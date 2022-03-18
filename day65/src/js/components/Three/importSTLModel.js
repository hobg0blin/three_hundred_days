import { STLLoader} from 'three/examples/jsm/loaders/STLLoader'

const loader = new STLLoader()

let crabMesh = null
let crabGeo = null
function importSTLModel(filePath, material, callback = () => console.log('model loaded!')) {
  if (crabGeo !== null) {
    console.log('preload crab')
    return callback(crabMesh, material)
  } else {
    return new Promise((resolve) => {  loader.load(filePath, (geometry) => {
      console.log('geo:', geometry)
      geometry.scale(5, 5, 5)
      crabGeo = geometry
      crabMesh = callback(geometry, material)
      resolve(crabMesh)
      })
    })
  }
}

export { importSTLModel }
