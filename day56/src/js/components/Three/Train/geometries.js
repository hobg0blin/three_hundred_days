import {BoxBufferGeometry, CircleGeometry, CylinderBufferGeometry} from 'three'

function createGeometries() {
  const cabin = new BoxBufferGeometry(2, 2.25, 1.5)
  const nose = new CylinderBufferGeometry(0.75, 0.75, 3, 12)
  const face = new CircleGeometry(0.75, 12)

  // TODO add circle for thomas the tank engine
  const wheel = new CylinderBufferGeometry(0.4, 0.4, 1.75, 16)
  const chimney = new CylinderBufferGeometry(0.3, 0.1, 0.5)
  return {
    cabin,
    nose,
    wheel,
    chimney,
    face
  }

}

export { createGeometries }
