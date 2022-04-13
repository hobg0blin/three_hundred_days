import {getRandomInt} from '../utils/RandomInt.js'
let endPt = 0
let startPt = 0
let posNeg = getPosNeg()
function getPosNeg() {
return Math.random() >=0.5 ? 1: -1

}

function morph(floor, segments) {
let inc = getRandomInt(1, 5)* 0.0008
    if (startPt >= floor.attributes.position.count) {
        startPt = 0
    }
//    startPt += endPt
    endPt = floor.attributes.position.count
    if (floor.attributes.position.getY(startPt) < 10) {
       for (let i = startPt; i < endPt;  i+=getRandomInt(1,12)) {
        if (i % (segments) == 0) {
            console.log('reset')
            posNeg = getPosNeg()
            inc = getRandomInt(1, 5) * 0.0008
        }

// can slowly remove object if you don't compare index to length (or just do length wrong idk)
    let X1 = floor.attributes.position.getX(i)
    let Z1 = floor.attributes.position.getZ(i)
    let Y1 = floor.attributes.position.getY(i)

            floor.attributes.position.setX(i, X1 + (inc*posNeg))
            floor.attributes.position.setZ(i, Z1 + (inc*posNeg))
            floor.attributes.position.setY(i, Y1 + (inc*posNeg))
    }
        floor.attributes.position.needsUpdate = true
        startPt++
}
//        floor.computeVertexNormals()
}

export { morph}
