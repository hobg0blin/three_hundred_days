import { Fog } from 'three'
function createFog(backgroundColor, near, far) {
      return new Fog(backgroundColor, near, far);
}

export {createFog}
