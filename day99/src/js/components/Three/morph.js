import {getRandomInt} from '../utils/RandomInt.js'
let endPt = 0
let startPt = 0
let posNeg = 1
let inc = Math.random()
function morph(floor, segments) {
    if (startPt >= floor.attributes.position.count) {
        startPt = 0
    }
    if (endPt > floor.attributes.position.count) {
        endPt = 0
    }
    endPt += floor.attributes.position.count/segments
    let forInc = 12

   for (let i = startPt; i < endPt;  i+=forInc) {
       if (i % segments*2 == 0) {
           posNeg = posNeg*-1
           inc = Math.random()
       }

// can slowly remove object if you don't compare index to length (or just do length wrong idk)
        let X1 = floor.attributes.position.getX(i)
        let Z1 = floor.attributes.position.getZ(i)
        let Y1 = floor.attributes.position.getY(i)

        floor.attributes.position.setY(i, Y1 + (inc*posNeg))
        floor.attributes.position.setZ(i, Z1 + (inc*posNeg))
        floor.attributes.position.setX(i, X1 + (inc*posNeg))
    }
    floor.attributes.position.needsUpdate = true
//        floor.computeVertexNormals()
    startPt+=3
}

export { morph}
