import { PlaneBufferGeometry,BufferAttribute, MeshLambertMaterial, MeshPhongMaterial, Mesh} from 'three'
function createFloor(options) {
        //texture creation
        // adapted from https://stackoverflow.com/questions/49383791/low-poly-terrain-created-by-modifying-geometry-vertices-is-producing-black-glitc
        const floor = new PlaneBufferGeometry(options.width, options.height, options.segments, options.segments)
        let colors = []
        let randomFloorVertexPos
        for (let i = 0; i < floor.attributes.position.array.length; i+=1) {
            //let color = new THREE.Color(randomColor({format: 'rgb'}))
            randomFloorVertexPos = Math.floor(Math.random() * ((0) - (-options.range)) + (-options.range))
           floor.attributes.position.setZ(i, randomFloorVertexPos)
        }
        floor.attributes.position.needsUpdate = true
        console.log('colors: ', colors)
        floor.setAttribute('color', new BufferAttribute(new Float32Array(colors), 3))
        floor.attributes.color.needsUpdate = true
        floor.computeVertexNormals()
        // to show as low poly needs to be phong material
        let floorMaterial = new MeshPhongMaterial({ color: 0x1b9e54, emissive:0x000000, reflectivity: 1, refractionRatio: 0.98/* for multicolor: vertexColors: true */})
        floorMaterial.flatShading = true;
        const floorMesh = new Mesh(floor, floorMaterial)
        floorMesh.receiveShadow = true
        floorMesh.castShadow = true
        floorMesh.name = "floor"
        floorMesh.rotation.x = -Math.PI /2
        return floorMesh


    }

export { createFloor}
