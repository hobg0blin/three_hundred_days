import { MeshStandardMaterial, MeshPhongMaterial, MeshLambertMaterial, TextureLoader, BackSide, FrontSide } from 'three'

function createMaterials() {
  const body = new MeshPhongMaterial({
    color: 'cyan',
    side: FrontSide
  })
  const outline = new MeshLambertMaterial({
    color: 'black',
    side: BackSide
  })
  const detail = new MeshStandardMaterial({
    color: 'lightGray',
    flatShading: true
  })

  const loader = new TextureLoader()
  const texture=  loader.load('hank.jpg')
  texture.repeat.set(0.87, 0.87)
  texture.offset.set(0.03, 0.03)
  const face = new MeshStandardMaterial({
    map: texture,
    flatShading: true
  })
  return { body, detail, outline, face}
}

export { createMaterials }
