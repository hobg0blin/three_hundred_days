import { PlaneBufferGeometry,BufferAttribute, MeshLambertMaterial, Mesh} from 'three'
function createFloor(options) {
        //texture creation
        // adapted from https://stackoverflow.com/questions/49383791/low-poly-terrain-created-by-modifying-geometry-vertices-is-producing-black-glitc
        const floor = new PlaneBufferGeometry(options.width, options.height, 30, 30)
        let colors = []
        let randomFloorVertexPos
        for (let i = 0; i < floor.attributes.position.array.length; i++) {
            //let color = new THREE.Color(randomColor({format: 'rgb'}))
            let range = 0.4
            randomFloorVertexPos = Math.floor(Math.random() * ((0) - (-range)) + (-range))
           floor.attributes.position.setZ(i, randomFloorVertexPos)
        }
        floor.attributes.position.needsUpdate = true
        console.log('colors: ', colors)
        floor.setAttribute('color', new BufferAttribute(new Float32Array(colors), 3))
        floor.attributes.color.needsUpdate = true
        floor.computeVertexNormals()

        let floorMaterial = new MeshLambertMaterial({ color: 0xfcba03, fog: false/* for multicolor: vertexColors: true */})
       // floorMaterial.flatShading = true;
        const floorMesh = new Mesh(floor, floorMaterial)
        floorMesh.receiveShadow = true
        floorMesh.castShadow = true
        floorMesh.name = "floor"
        floorMesh.rotation.x = -Math.PI /2
        return floorMesh


    }

export { createFloor}
