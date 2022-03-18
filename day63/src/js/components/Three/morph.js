import {getRandomInt} from '../../utils/RandomInt.js'
let endPt = 0
let startPt = 0
let posNeg = getPosNeg()
let inc = Math.random()
function getPosNeg() {
return Math.random() >=0.5 ? 1: -1

}
function morph(floor, segments) {

//    startPt += endPt
    endPt = floor.attributes.position.count
       for (let i = startPt; i < endPt;  i+=3) {
        if (i % (segments*4) == 0) {
//            posNeg = getPosNeg()
            console.log('pos neg: ', posNeg)
            inc = Math.random() * 0.01
        }

// can slowly remove object if you don't compare index to length (or just do length wrong idk)
    let X1 = floor.attributes.position.getX(i)
    let Z1 = floor.attributes.position.getZ(i)
    let Y1 = floor.attributes.position.getY(i)

            floor.attributes.position.setY(i, Y1 + (inc*posNeg))
    let randSwitch = Math.random()
         if (randSwitch > 0.5) {
            floor.attributes.position.setZ(i, Z1 + (inc*posNeg))
        }
    }
        floor.attributes.position.needsUpdate = true

//        floor.computeVertexNormals()
}

export { morph}
