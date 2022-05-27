export function orbit(object, orbitRadius, orbitSpeed, orbitMod, elapsedTime) {
          let pos = elapsedTime *= orbitSpeed
  //TODO: just set orbit direction in function declaration instead of this randomized stuff
          if (orbitRadius % 2 == 0) {
          object.position.set(Math.cos(elapsedTime) * orbitRadius + orbitMod, Math.cos(elapsedTime) * orbitRadius + orbitMod, Math.sin(elapsedTime) * orbitRadius)
          } else if (orbitRadius % 3 == 0) {
//
          object.position.set(0, Math.cos(elapsedTime) * orbitRadius + orbitMod, Math.sin(elapsedTime) * orbitRadius)
          } else if (orbitRadius % 4 == 0) {
          object.position.set(Math.cos(pos) * orbitRadius, object.position.y, Math.sin(pos) * orbitRadius)
          object.rotation.y -= Math.cos(orbitRadius*orbitSpeed) / ((orbitRadius/(Math.PI/2))*(orbitRadius/(Math.PI/2)))                  } else {


          object.position.set(Math.cos(elapsedTime) * orbitRadius + orbitMod, 0, Math.sin(elapsedTime) * orbitRadius)
          }
}

