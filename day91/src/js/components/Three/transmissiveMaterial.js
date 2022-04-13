import {EquirectangularReflectionMapping, CanvasTexture, NearestFilter, RepeatWrapping, MeshPhysicalMaterial, DoubleSide, Mesh} from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
let params = {
  color: 0xffffff,
  transmission: 1,
  opacity: 1,
  metalness: 0,
  roughness: 5,
  ior: 1.9,
	sheen: 1.0,
  thickness: 0.1,
  specularIntensity: 1,
  specularColor: 0xffffff,
  envMapIntensity: 1,
  lightIntensity: 1,
  exposure: 1
};

const hdrEquirect = new RGBELoader()
  .setPath( 'textures/equirectangular/' )
  .load( 'royal_esplanade_1k.hdr', function () {

    hdrEquirect.mapping = EquirectangularReflectionMapping;

    init();
    render();

  } );

function createTransmissiveMaterial(newParams) {
	if (newParams != undefined) {
		for (let [key, value] of Object.entries(newParams)) {
			console.log('key', key)
			if (params[key]) {
				params[key] = value
			}
		}
	}
	console.log('params: ', params)

const texture = new CanvasTexture( generateTexture() );
				texture.magFilter = NearestFilter;
				texture.wrapT = RepeatWrapping;
				texture.wrapS = RepeatWrapping;
				texture.repeat.set( 1, 3.5 );

				const material = new MeshPhysicalMaterial( {
					color: params.color,
					metalness: params.metalness,
					roughness: params.roughness,
					ior: params.ior,
					alphaMap: texture,
					envMap: hdrEquirect,
					envMapIntensity: params.envMapIntensity,
					transmission: params.transmission, // use material.transmission for glass materials
					specularIntensity: params.specularIntensity,
					specularColor: params.specularColor,
					opacity: params.opacity,
					side: DoubleSide,
					transparent: true,
					emissive: params.emissive,
					emissiveIntensity: params.emissiveIntensity,
					sheen: params.sheen
				} );

				return material
}

function generateTexture() {

				const canvas = document.createElement( 'canvas' );
				canvas.width = 2;
				canvas.height = 2;

				const context = canvas.getContext( '2d' );
				context.fillStyle = 'white';
				context.fillRect( 0, 1, 2, 1 );

				return canvas;

}

export { createTransmissiveMaterial}
