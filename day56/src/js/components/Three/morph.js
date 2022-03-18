import {getRandomInt} from '../utils/RandomInt.js'
let endPt = 0
let startPt = 0
function morph(floor) {

    startPt += endPt
    endPt += floor.attributes.position.count/5
    if (endPt > floor.attributes.position.count) {
        endPt = 0
    }
    if (startPt > endPt) {
        startPt = 0
    }
    for (let i = startPt; i < endPt - 1;  i++) {

// can slowly remove object if you don't compare index to length (or just do length wrong idk)
    let pos = 0
    if (i < floor.attributes.position.count - 1) {
        pos = i + 1
    }
    let X1 = floor.attributes.position.getX(i)
    let Z1 = floor.attributes.position.getZ(i)
    let Y1 = floor.attributes.position.getY(i)

    let X2 = floor.attributes.position.getX(pos)
    let Z2 = floor.attributes.position.getZ(pos)
    let Y2 = floor.attributes.position.getY(pos)
    if (isNaN(X2) || isNaN(Z2) || isNaN(Y2)) {
        console.log('pos: ', pos)
        break;
    }


        floor.attributes.position.setX(pos, X1)
        floor.attributes.position.setZ(pos, Z1)
        floor.attributes.position.setY(pos, Y1)

        floor.attributes.position.setX(i, X2)
        floor.attributes.position.setZ(i, Z2)
        floor.attributes.position.setY(i, Y2)
    }
        floor.attributes.position.needsUpdate = true

//        floor.computeVertexNormals()
}

export { morph}
