import {CylinderGeometry, MeshPhongMaterial, Mesh, Group, MathUtils} from 'three'
function makeBars(width, numBars){
  let barGeometry = new CylinderGeometry(5, 5, width, 10, 10)
  let halfWidth = width/2
  let barMat = new MeshPhongMaterial({color: 'silver', shininess: '100'})
  let wall = new Group()
  let barMesh1 = new Mesh(barGeometry, barMat)
  let barMesh2 = barMesh1.clone()
  barMesh1.position.set(-halfWidth, 0, 0)
  barMesh2.rotation.z = MathUtils.degToRad(90)
  barMesh2.position.set(0, halfWidth, 0)
  let barMesh3 = barMesh2.clone()
  barMesh3.position.set(0, -halfWidth, 0)
  let barMesh4 = barMesh1.clone()
  barMesh4.position.set(halfWidth, 0, 0)
    for (let i = 0; i < numBars; i++) {
      let newBar = barMesh1.clone()
      newBar.position.set(-halfWidth + i * width/numBars, 0, 0)
      wall.add(newBar)
    }
  wall.add(barMesh1, barMesh2, barMesh3, barMesh4)
  return wall
}

export { makeBars }

