import { BufferGeometry, BufferAttribute, Vector3, PointsMaterial, Points } from 'three'

const rand = (min,max) => min + Math.random()*(max-min)
function createParticles(count, color, size, initPosMax, initPosMin) {
  const particles = []
  const vertices = []
  const geo = new BufferGeometry
  //todo: separate particle component?
  // first loop looks too uniform, gotta figure that out
  for (let i = 0; i < count; i ++) {
    const particle = {
      position: new Vector3(rand(initPosMin.x, initPosMax.x),rand(initPosMin.y, initPosMax.y), rand(initPosMin.z, initPosMax.z)),
      velocity: new Vector3(rand(0.004, 0.08), rand(0.1, 0.5), rand(0.003, 0.1)),
      acceleration: new Vector3(0.0001, 0.0001, 0.0001)
    }
    particles.push(particle)
    const vals = Object.values(particle.position)
    vertices.push(...vals)
  }
  console.log('vertices: ', vertices)
  geo.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3))
  const mat = new PointsMaterial({color: color, size: size})
  const mesh = new Points(geo, mat)
  //TODO add rotation options?
  function animate(rotationSpd) {
    const pos = []
    particles.forEach(p => {
//      p.velocity.add(p.acceleration)
      p.position.add(p.velocity)
      if (p.position.y > Math.random() * 500) {
        //this made the chimney fly too -  wild shit (presumably direct reference to initial position?)
//        p.position = initPos;
        p.position = new Vector3(rand(initPosMin.x, initPosMax.x),rand(initPosMin.y, initPosMax.y), rand(initPosMin.z, initPosMax.z))
      }
      const vals = Object.values(p.position)
      pos.push(...vals)
    })
    geo.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3))
    geo.attributes.position.needsUpdate = true
//    mesh.rotation.y += rotationSpd
  }
  return {mesh, animate}
}
export { createParticles }
