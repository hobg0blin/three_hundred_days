import { MeshStandardMaterial, TextureLoader } from 'three'

function createMaterials() {
  const body = new MeshStandardMaterial({
    color: 'cyan',
    flatShading: true
  })
  const detail = new MeshStandardMaterial({
    color: 'lightGray',
    flatShading: true
  })

  const loader = new TextureLoader()
  const texture=  loader.load('textures/hank.jpg')
  texture.repeat.set(0.77, 0.77)
  texture.offset.set(0.12, 0.12)
  const face = new MeshStandardMaterial({
    map: texture,
    flatShading: true
  })
  return { body, detail, face}
}

export { createMaterials }
