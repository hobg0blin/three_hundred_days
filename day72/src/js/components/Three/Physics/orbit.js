export function orbit(object, orbitRadius, orbitSpeed, orbitMod, elapsedTime) {
          elapsedTime *= orbitSpeed
  //TODO: just set orbit direction in function declaration instead of this randomized stuff
//          if (orbitRadius % 2 == 0) {
//          object.position.set(Math.cos(elapsedTime) * orbitRadius + orbitMod, Math.cos(elapsedTime) * orbitRadius + orbitMod, Math.sin(elapsedTime) * orbitRadius)
//          } else if (orbitRadius % 3 == 0) {
//
//          object.position.set(0, Math.cos(elapsedTime) * orbitRadius + orbitMod, Math.sin(elapsedTime) * orbitRadius)
//          } else if (orbitRadius % 4 == 0) {
          object.position.set(Math.cos(elapsedTime) * orbitRadius, 5, Math.sin(elapsedTime) * orbitRadius)
        object.rotation.y += Math.sin(elapsedTime) * Math.cos(elapsedTime)        //          } else {
//          object.position.set(Math.cos(elapsedTime) * orbitRadius + orbitMod, 0, Math.sin(elapsedTime) * orbitRadius)
//          }
}

