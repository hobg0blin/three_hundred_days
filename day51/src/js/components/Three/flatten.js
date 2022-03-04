import {getRandomInt} from '../utils/RandomInt.js'
let end = 0
let start = 0

function getHighLow(floor) {
    let highestX = 0, highestY = 0, lowestX = 0, lowestY = 0
    for (let i = 0; i < floor.attributes.position.array.length;  i++) {
    let rand = Math.random()
    let X = floor.attributes.position.getX(i)
    let Z = floor.attributes.position.getZ(i)
    let Y = floor.attributes.position.getY(i)
    if (X > highestX) {
        highestX = X
    }
    if (X < lowestX) {
        lowestX = X
    }
    if (Y > highestY) {
        highestY = Y
    }
    if (Y < lowestY) {
        lowestY = Y
    }
    }
    return { highX: highestX, highY: highestY, lowX: lowestX, lowY: lowestY}

}

function flatten(floor, mod, highLow) {
   let endMod = floor.attributes.position.array.length/1000
    end +=  endMod
    for (let i = 0; i < floor.attributes.position.array.length;  i++) {
    let rand = Math.random()
    let X = floor.attributes.position.getX(i)
    let Z = floor.attributes.position.getZ(i)
    let Y = floor.attributes.position.getY(i)


    let min = -250
//        console.log('y: ', Y)
    if (Z > min) {
        floor.attributes.position.setZ(i, Z -= 2)
    } else {
        if (Y < highLow.highestY + highLow.lowestY) {
        floor.attributes.position.setY(i, Y - Y*0.005)
        } else {

        floor.attributes.position.setY(i, Y + Y*0.005)
        }
        if (X < highLow.highestX + highLow.lowestX) {

        floor.attributes.position.setX(i, X - X*0.005)
        } else {
        floor.attributes.position.setX(i, X + X*0.005)
        }
    }
        //FIXME why is this slowing it down so much
        //might have been computing the vertex normals?

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

export { flatten, getHighLow }
