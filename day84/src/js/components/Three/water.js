import {TextureLoader, PlaneGeometry, Vector2, MeshPhongMaterial, Mesh} from 'three'

import {Water} from 'three/examples/jsm/objects/Water2.js'

function createWater() {
        const textureLoader = new TextureLoader()
        const flowMap = textureLoader.load('textures/Water_1_M_Flow.jpg')
        const normalMap0 = textureLoader.load('textures/Water_1_M_Normal.jpg')
        const normalMap1 = textureLoader.load('textures/Water_2_M_Normal.jpg')


        const waterGeo = new PlaneGeometry(100, 100)
        let water = new Water(waterGeo, {scale: 2, textureWidth: 1024, textureHeight: 1024, flowMap: flowMap, normalMap0: normalMap0, normalMap1: normalMap1, flowDirection: new Vector2(1, 1), color: 0xadedff})
            water.position.y = 1
        //
        water.rotation.x = Math.PI * -0.5
        let waterBase = new PlaneGeometry(100, 100)
        let waterMat = new MeshPhongMaterial({color: 'gray', transparent : true, opacity:0.5})
        let waterBaseMesh = new Mesh(waterBase, waterMat)
        waterBaseMesh.rotation.x = Math.PI * -0.5
//        waterBaseMesh.position.y = 14.9
    water.receiveShadow = true
    waterBaseMesh.receiveShadow = true
  return {water: water, baseMesh: waterBaseMesh}
}

export {createWater}
