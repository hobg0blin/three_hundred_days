import { SphereGeometry,BufferAttribute, MeshLambertMaterial, Mesh} from 'three'
function createFloor(options) {
        //texture creation
        // adapted from https://stackoverflow.com/questions/49383791/low-poly-terrain-created-by-modifying-geometry-vertices-is-producing-black-glitc
        const floor = new SphereGeometry(options.width,/* options.height,*/ options.segments, options.segments)
        let colors = []
        let randomFloorVertexPos
        for (let i = 0; i < floor.attributes.position.array.length - 1; i++) {
            //let color = new THREE.Color(randomColor({format: 'rgb'}))
            randomFloorVertexPos = Math.floor(Math.random() * ((0) - (-options.range)) + (-options.range))
            let newZ =               floor.attributes.position.getZ(i)
                console.log('get z: ', newZ)
                floor.attributes.position.setZ(i, (newZ += randomFloorVertexPos))
            let newX =               floor.attributes.position.getX(i)
                console.log('get z: ', newZ)
//                floor.attributes.position.setX(i, (newX += randomFloorVertexPos))
let newY =               floor.attributes.position.getY(i)
                console.log('get z: ', newZ)
                floor.attributes.position.setY(i, (newY += randomFloorVertexPos))

        }
        floor.attributes.position.needsUpdate = true
        console.log('colors: ', colors)
        floor.setAttribute('color', new BufferAttribute(new Float32Array(colors), 3))
        floor.attributes.color.needsUpdate = true
        floor.computeVertexNormals()

        let floorMaterial = new MeshLambertMaterial({ color: 0x1b9e54, emissive:0x000000, reflectivity: 1, refractionRatio: 0.98/* for multicolor: vertexColors: true */})
       // floorMaterial.flatShading = true;
        const floorMesh = new Mesh(floor, floorMaterial)
        floorMesh.receiveShadow = true
        floorMesh.castShadow = true
        floorMesh.name = "floor"
        floorMesh.rotation.x = -Math.PI /2
        return floorMesh


    }

export { createFloor}
