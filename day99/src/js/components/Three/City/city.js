import { createBuilding } from './building.js'
import { BufferAttribute, Mesh, Group, BufferGeometry, MeshPhongMaterial, Color,  Texture, VertexColors} from 'three'
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils'
import randomColor from 'randomcolor'

let building
let renderer

// code heavily adapted from http://learningthreejs.com/blog/2013/08/02/how-to-do-a-procedural-city-in-100lines/

function createCity(parentRenderer){
  renderer = parentRenderer
  let city = new Group()
  // COMMENTED OUT: failed lighting attempt
//  const light = new Color(0xffffff)
//  const shadow = new Color(0x303050)

//  let value   = 1 - Math.random() * Math.random();
//    let baseColor   = new Color().setRGB( value + Math.random() * 0.1, value, value + Math.random() * 0.1 );
//    // set topColor/bottom vertexColors as adjustement of baseColor
//    let topColor    = baseColor.clone().multiply( light );
//    let bottomColor = baseColor.clone().multiply( shadow );
//  console.log('colors: ', topColor, bottomColor, baseColor)
//    // set vertexColors for each face
//    let vertexColors = []
    building = createBuilding()
//    console.log('color: ', building.getAttribute('color'))
//  for (let i = 0; i < building.getAttribute('position').array.length; i+=3 ){
//      if (i % 3 == 0) {
//        vertexColors.push(baseColor, baseColor, baseColor)
//      } else {
//        vertexColors.push(topColor, bottomColor, bottomColor)
//      }
//
//    }

  // build the mesh
  //

  for(let i = 0; i < 100; i ++) {

    addBuilding(city)
  }
  return city

}

function addBuilding(city) {

  let texture   = new Texture( generateTexture())
  texture.anisotropy = renderer.getMaxAnisotropy()
  texture.needsUpdate    = true;
  let material  = new MeshPhongMaterial({
    map     : texture,
  //  vertexColors    : true
  });


    let newBuilding = new Mesh(building, material)
      // put a random position
    newBuilding.position.x   = Math.floor( Math.random() * 200 - 100 ) * 5;
    newBuilding.position.z   = Math.floor( Math.random() * 200 - 100 ) * 5;

    // put a random rotation
    newBuilding.rotation.y   = Math.random()*Math.PI*2;
    // put a random scale
    newBuilding.scale.x  = Math.random() * Math.random() * Math.random() * Math.random() * 50 + 10;
    newBuilding.scale.y  = (Math.random() * Math.random() * Math.random() * newBuilding.scale.x) * 8 + 8;
    newBuilding.scale.z  = newBuilding.scale.x
//    newBuilding.position.y = 0
 //     building.setAttribute('color', new BufferAttribute(new Float32Array(vertexColors), 3))
//    building.attributes.color.needsUpdate = true

    newBuilding.geometry.computeBoundingBox()
    newBuilding.position.y -= newBuilding.geometry.boundingBox.min.y * newBuilding.scale.y
    building.attributes.position.needsUpdate = true
    newBuilding.receiveShadow = true
    newBuilding.castShadow = true
    city.add(newBuilding)

}

function generateTexture() {
  // build a small canvas 32x64 and paint it in white
  let canvas  = document.createElement( 'canvas' );
  canvas.width = 32;
  canvas.height    = 64;
  let context = canvas.getContext( '2d' );
  // plain it in white
  context.fillStyle    = randomColor();
  context.fillRect( 0, 0, 32, 64 );
  // draw the window rows - with a small noise to simulate light letiations in each room
  for( let y = 2; y < 64; y += 2 ){
      for( let x = 0; x < 32; x += 2 ){
          let value   = Math.floor( Math.random() * 64 );
          context.fillStyle = 'rgb(' + [value, value, value].join( ',' )  + ')';
          context.fillRect( x, y, 2, 1 );
      }
  }
  // build a bigger canvas and copy the small one in it
  // This is a trick to upscale the texture without filtering
  let canvas2 = document.createElement( 'canvas' );
  canvas2.width    = 512;
  canvas2.height   = 1024;
  let context2 = canvas2.getContext( '2d' );
  // disable smoothing
  context2.imageSmoothingEnabled        = false;
  context2.webkitImageSmoothingEnabled  = false;
  context2.mozImageSmoothingEnabled = false;
  // then draw the image
  context2.drawImage( canvas, 0, 0, canvas2.width, canvas2.height );
  // return the just built canvas2
  return canvas2;

}

export {createCity, addBuilding}
