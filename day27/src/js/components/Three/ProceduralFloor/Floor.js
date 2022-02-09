import { SphereGeometry,BufferAttribute, MeshPhongMaterial, Mesh, TextureLoader, Color } from 'three'
import randomColor from 'randomcolor'

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createFloor(options) {
        //texture creation
        // adapted from https://stackoverflow.com/questions/49383791/low-poly-terrain-created-by-modifying-geometry-vertices-is-producing-black-glitc
        let floor = new SphereGeometry(options.width,/* options.height,*/ options.segments, options.segments)
        let colors = []
        let randomFloorVertexPos
        let finalPos
    console.log('floor array: ', floor.attributes.position)
        for (let i = 0; i < floor.attributes.position.array.length; i++) {
            let color = new Color(randomColor({format: 'rgb'}))
            colors.push(color.r, color.g, color.b)
                    randomFloorVertexPos = Math.floor(Math.random() * ((0) - (-options.range)) + (-options.range))

let newY = floor.attributes.position.getY(i) + randomFloorVertexPos
                floor.attributes.position.setY(i, (newY))
let newX = floor.attributes.position.getX(i) + randomFloorVertexPos
                floor.attributes.position.setX(i, (newX))
let newZ = floor.attributes.position.getZ(i) + randomFloorVertexPos
                floor.attributes.position.setZ(i, (newZ))

        }
        floor.attributes.position.needsUpdate = true
        console.log('colors: ', colors)
        floor.setAttribute('color', new BufferAttribute(new Float32Array(colors), 3))
        floor.attributes.color.needsUpdate = true
       floor = BufferGeometryUtils.mergeVertices(floor, options.range)
    console.log('floor: ', floor)
        floor.computeVertexNormals()
    let floorMaterial = new MeshPhongMaterial({ /*color:  0x36995a, emissive:0x000000/* for multicolor:  */vertexColors: true})
        floorMaterial.flatShading = true;
        const floorMesh = new Mesh(floor, floorMaterial)
        floorMesh.receiveShadow = true
        floorMesh.castShadow = true
        floorMesh.name = "floor"
        floorMesh.rotation.x = -Math.PI /2
        return floorMesh
    }
function animateFloor(floor, range) {
    for (let i = getRandomInt(0, 1000); i < floor.attributes.position.array.length -1; i+=100) {
        console.log('ping')
 let randomFloorVertexPos = Math.floor(Math.random() * ((0) - (-range/10)) + (-range/10))
            randomFloorVertexPos *= Math.round(Math.random()) ? 1 : -1

           floor.attributes.position.setZ(i, floor.attributes.position.getZ(i) + randomFloorVertexPos)

           floor.attributes.position.setY(i, floor.attributes.position.getY(i) + randomFloorVertexPos)

           floor.attributes.position.setX(i, floor.attributes.position.getX(i) + randomFloorVertexPos)
        }
        floor.attributes.position.needsUpdate = true

        floor.computeVertexNormals()
}

export { createFloor, animateFloor}
