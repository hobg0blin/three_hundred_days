import { Mesh, Group } from 'three'
import { createGeometries } from './geometries.js'
import { createMaterials } from './materials.js'

function createOutline(geometry, defaultMaterial) {
  const materials = createMaterials()
  const group = new Group()
  const obj = new Mesh(geometry, defaultMaterial)
  const outline = new Mesh(geometry, materials.outline)
  obj.geometry.computeVertexNormals()
  outline.scale.set(1.03, 1.03, 1.03)
  outline.geometry.computeVertexNormals()
  group.add(outline)
  group.add(obj)
  return group
}

function createMeshes() {
  const materials = createMaterials()
  const geometries = createGeometries();

  const cabin = createOutline(geometries.cabin, materials.body)
  cabin.position.set(1.5, 1.4, 0)

//  const chimney = new Mesh(geometries.chimney, materials.detail)
  const chimney = createOutline(geometries.chimney, materials.detail)
  chimney.position.set(-2, 1.9, 0)

  const nose = createOutline(geometries.nose, materials.body)
  nose.position.set(-1, 1, 0)
  nose.rotation.z = Math.PI / 2

  const face = createOutline(geometries.face, materials.face)
  face.position.set(-2.51, 1, 0)
  face.rotation.y = - Math.PI / 2

  const smallWheelRear = createOutline(geometries.wheel, materials.detail)
  smallWheelRear.position.y = 0.5
  smallWheelRear.rotation.x = Math.PI / 2

  const smallWheelCenter = smallWheelRear.clone();
  smallWheelCenter.position.x = -1;

  const smallWheelFront = smallWheelRear.clone();
  smallWheelFront.position.x = -2;

  const bigWheel = smallWheelRear.clone();
  bigWheel.position.set(1.5, 0.9, 0);
  bigWheel.scale.set(2, 1.25, 2);

  return {
    face,
    nose,
    cabin,
    chimney,
    smallWheelRear,
    smallWheelCenter,
    smallWheelFront,
    bigWheel
  }
}
export { createMeshes }
