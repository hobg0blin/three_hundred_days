import { SphereGeometry, MeshPhongMaterial, Mesh} from 'three'

function createBall(radius, segments, color) {
  const ballGeo = new SphereGeometry(radius, segments, segments)
  const ballMat = new MeshPhongMaterial({color: color})
  const ballMesh = new Mesh(ballGeo, ballMat)
  return ballMesh
}

export { createBall }
