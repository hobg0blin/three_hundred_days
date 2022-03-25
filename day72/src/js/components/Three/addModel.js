import {Math, animationMixer} from 'three'
function addBody(loadedModel, parentScene) {
  let scene = loadedModel.scene
  let model
    model = loadedModel.scene.children[0]
  //addToGUI([this.model[this.model.length-1].children[0]], 'lil guy')


//      let bodyMesh = new THREE.Mesh(model, mat)
  parentScene.add(model)
 model.position.y = -175
 model.position.z = -95
  model.position.x = 10
  model.rotation.y = Math.degToRad(65)

     model.rotation.x = Math.degToRad(0)
//             model.rotation.z = THREE.Math.degToRadk()
    model.scale.set(8.07, 8.07,8.07)
//     this.mixer = new THREE.AnimationMixer(model)
 //    this.anim = this.mixer.clipAction(loadedModel.animations[getRandomInt(0, 6)])
//  this.anim.setEffectiveTimeScale(0.5)
//           this.anim.setLoop(THREE.LoopOnce)
//          this.anim.clampWhenFinished = true
 //   this.anim.play()

   model.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true
      child.geometry.attributes.position.needsUpdate = true
    }
  })
  return model

}
