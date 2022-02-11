import { SphereGeometry,BufferAttribute, MeshPhongMaterial, Mesh, TextureLoader, Color } from 'three'
import randomColor from 'randomcolor'

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

let start = 0
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
if (newY < lowestY) {
            lowestY = newY
        }
                floor.attributes.position.setZ(i, (newZ))

        }
    console.log('lowest Y: ', lowestY)
        floor.attributes.position.needsUpdate = true
        console.log('colors: ', colors)
        floor.setAttribute('color', new BufferAttribute(new Float32Array(colors), 3))
        floor.attributes.color.needsUpdate = true
       floor = BufferGeometryUtils.mergeVertices(floor, options.range)
        floor.computeVertexNormals()
    let floorMaterial = new MeshPhongMaterial({ color:  new Color(randomColor({format: 'rgb'})), emissive:0x000000, shininess: 200,/* wireframe: true* for multicolor:  vertexColors: true*/})
//        floorMaterial.flatShading = true;
        floorMaterial.castShadows = true

        const floorMesh = new Mesh(floor, floorMaterial)
        floorMesh.receiveShadow = true
        floorMesh.castShadow = true
        floorMesh.name = "floor"
        return floorMesh
    }
function animateSphere(floor, mod, style) {
    let posNeg = 1
    let range = 11
    let endPos = start + range
        if (start + range > floor.attributes.position.array.length/3 && start + range <floor.attributes.position.array.length/3 + range) {
//            posNeg = posNeg == 1 ? -1 : 1
        }

    if (endPos > floor.attributes.position.array.length -1) {
endPos = floor.attributes.position.array.length -1
    }
    let increment = style == 0 ? 5: 10
    for (let i = 0 ; i < floor.attributes.position.array.length;  i++) {

    //let rand = Math.random()
   //        floor.attributes.position.setZ(i, floor.attributes.position.getZ(i) + inc * posNeg)

//          floor.attributes.position.setY(i, floor.attributes.position.getY(i) + inc*posNeg)

if (floor.attributes.position.getY (i) >= lowestY) {
         floor.attributes.position.setY(i, floor.attributes.position.getY(i) - inc )
} else {
    let Z = floor.attributes.position.getZ(i + 1)
    let X = floor.attributes.position.getX(i + 1)
    let min = 500
    let rando = getRandomInt(min, min+2)
    if (Z < 0) {
floor.attributes.position.setZ(i,Z*rando/min)
}
if (Z > 0) {
floor.attributes.position.setZ(i,Z*rando/min)
}
if (X > 0) {
floor.attributes.position.setX(i,floor.attributes.position.getX(i+1)*rando/min)
}
if (X < 0) {
floor.attributes.position.setX(i,floor.attributes.position.getX(i+1)*rando/min)
}
}



        }
    start += 1
        if (start + 1 > floor.attributes.position.array.length) {
            start = 0
//            posNeg = posNeg == 1 ? -1 : 1
        }

        floor.attributes.position.needsUpdate = true

//        floor.computeVertexNormals()
}

export { createSphere, animateSphere}
