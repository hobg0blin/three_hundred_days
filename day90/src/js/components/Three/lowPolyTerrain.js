function createLowPolyTerrain(terrain, peak, interval1 = 4, interval2 = 2) {
  terrain.rotation.x = -Math.PI / 2;
  var vertices = terrain.geometry.attributes.position.array;
  for (var i = 0; i <= vertices.length; i += interval1) {
      vertices[i+interval2] = peak * Math.random();
  }
  terrain.geometry.attributes.position.needsUpdate = true;
  terrain.geometry.computeVertexNormals();
  return terrain
}

export { createLowPolyTerrain }

