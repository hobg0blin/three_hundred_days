import { SphereGeometry,BufferAttribute, MeshPhongMaterial, Mesh, TextureLoader, Color } from 'three'
import randomColor from 'randomcolor'

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

let start = 1
let end = 0
let globalPosNeg = 1
let inc = 4
let lowestY = 0
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createSphere(options) {
        //texture creation
        // adapted from https://stackoverflow.com/questions/49383791/low-poly-terrain-created-by-modifying-geometry-vertices-is-producing-black-glitc
        let floor = new SphereGeometry(options.width,/* options.height,*/ options.segments, options.segments)
        let colors = []
        let randomFloorVertexPos
        let finalPos
        for (let i = 0 + start; i < floor.attributes.position.array.length; i++) {
            let color = new Color(randomColor({format: 'rgb'}))
            colors.push(color.r, color.g, color.b)
                    randomFloorVertexPos = Math.floor(Math.random() * ((0) - (-options.range)) + (-options.range))

let newY = floor.attributes.position.getY(i) + randomFloorVertexPos

                floor.attributes.position.setY(i, (newY))
let newX = floor.attributes.position.getX(i) + randomFloorVertexPos
                floor.attributes.position.setX(i, (newX))
let newZ = floor.attributes.position.getZ(i) + randomFloorVertexPos
if (newY < lowestY) {
            lowestY = newY
        }
                floor.attributes.position.setZ(i, (newZ))

        }
        floor.attributes.position.needsUpdate = true
        floor.setAttribute('color', new BufferAttribute(new Float32Array(colors), 3))
        floor.attributes.color.needsUpdate = true
       floor = BufferGeometryUtils.mergeVertices(floor, options.range)
        floor.computeVertexNormals()
        let floorMaterial = new MeshPhongMaterial({ color: 'white', emissive:0x000000, /*shininess: 200,/* wireframe: true* for multicolor:  vertexColors: true*/})
        floorMaterial.flatShading = true;
 //       floorMaterial.castShadows = true

        const floorMesh = new Mesh(floor, floorMaterial)
        floorMesh.receiveShadow = true
//        floorMesh.castShadow = true
        floorMesh.name = "floor"
        return floorMesh
    }
function animateSphere(floor, mod, style) {
   let endMod = floor.attributes.position.array.length/119
    end +=  endMod
    let increment = getRandomInt(1, 2)
    console.log('increment: ', increment)
    for (let i = 0; i < floor.attributes.position.array.length;  i++) {
        let rand = Math.random()
   //   d     floor.attributes.position.setZ(i, floor.attributes.position.getZ(i) + inc * posNeg)

//          floor.attributes.position.setY(i, floor.attributes.position.getY(i) + inc*posNeg)

//if (floor.attributes.position.getZ (i) >= lowestY) {
 //j        floor.attributes.position.setZ(i, floor.attributes.position.getZ(i) - inc*rand )
//} else {
    let Z1 = floor.attributes.position.getY(i)
//    let Z2 = floor.attributes.position.getY(i + 1)
    let X1 = floor.attributes.position.getX(i)
 //   let X2 = floor.attributes.position.getX(i + 1)
    let min = 400.0
        let rando = getRandomInt(min, min+2)
    let ratio = i/floor.attributes.position.array.length
        //FIXME why is this slowing it down so much
        //might have been computing the vertex normals?
    if (i > floor.attributes.position.array.length/2) {

 ratio =(floor.attributes.position.array.length - i )/floor.attributes.position.array.length
//
    }
floor.attributes.position.setY(i,Z1*rando/min  + ratio/100)

floor.attributes.position.setX(i,X1*(rando/min))

}


    start += 1
    if (start  > end) {
        start = 0
    }
    if (end >= floor.attributes.position.array.length) {
        end = 0
    }

        floor.attributes.position.needsUpdate = true

//        floor.computeVertexNormals()
}

export { createSphere, animateSphere}
