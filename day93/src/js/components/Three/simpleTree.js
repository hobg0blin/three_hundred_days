import {Color, BufferGeometry, ConeGeometry, CylinderGeometry, Mesh, MeshPhongMaterial, Float32BufferAttribute, VertexColors} from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

function createTree() {
let geo = new BufferGeometry()
let level1 = new ConeGeometry(1.5,2,8)
const treeColors = []
const green = new Color('red')
for (let i = 0; i < level1.attributes.position.array; i +=3) {
    treeColors.push(green.r, green.g, green.b)
}
level1.translate(0,4,0)
geo.merge(level1)
//level1 = BufferGeometryUtils.mergeVertices(level1, 1)
geo = level1
let level2 = new ConeGeometry(2,2,8)

for (let i = 0; i < level2.attributes.position.array; i +=3) {
    treeColors.push(green.r, green.g, green.b)
}
level2.translate(0,3,0)
//level2 = BufferGeometryUtils.mergeVertices(level2, 1)
geo = BufferGeometryUtils.mergeBufferGeometries([geo, level2])
let level3 = new ConeGeometry(3,2,8)
level3.attributes.position.array.forEach(f => treeColors.push(green.r, green.g, green.b)
)
level3.translate(0,2,0)

//level3= BufferGeometryUtils.mergeVertices(level3, 1)

geo = BufferGeometryUtils.mergeBufferGeometries([geo, level3])
let trunk = new CylinderGeometry(0.5,0.5,2)
let brown = new Color(0xbb6600)
for (let i = 0; i < trunk.attributes.position.array; i +=3 ){
treeColors.push(brown.r, brown.g, brown.b)
}
trunk.translate(0,0,0)
//trunk= BufferGeometryUtils.mergeVertices(trunk, 1)
geo = BufferGeometryUtils.mergeBufferGeometries([geo, trunk])
geo.setAttribute('color', new Float32BufferAttribute(treeColors, 3))
const tree = new Mesh(
    geo,
    new MeshPhongMaterial({
        vertexColors: VertexColors,
    })
)
    return tree
}

export {createTree}
