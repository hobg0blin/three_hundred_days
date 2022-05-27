import { Group, MathUtils } from 'three'
import { createGeometries } from "./geometries.js"
import { createMaterials } from "./materials.js"
import { createMeshes } from "./meshes.js"
//Train code mostly lifted from https://discoverthreejs.com/book/first-steps/built-in-geometries/
const wheelSpeed = MathUtils.degToRad(24)

class Train extends Group {
  constructor() {
    super()
    this.meshes = createMeshes()
    this.add(
      this.meshes.face,
      this.meshes.nose,
      this.meshes.cabin,
      this.meshes.chimney,
      this.meshes.smallWheelRear,
      this.meshes.smallWheelCenter,
      this.meshes.smallWheelFront,
      this.meshes.bigWheel
    )
    this.wheels = [this.meshes.smallWheelRear,
      this.meshes.smallWheelCenter,
      this.meshes.smallWheelFront,
      this.meshes.bigWheel]

  }
  tick(delta) {
    this.wheels.forEach(wheel => {
      wheel.rotation.y += wheelSpeed * delta
    })

  }
}


export { Train }
