import * as three from "three";

export default function createWorld() {
  var world = new three.Group();
  let floorGeo = new three.BoxGeometry();
  let floorMat = new three.MeshLambertMaterial({ color: 0x333333 });
  floorGeo.scale(31, 99, 31);
  var floor = new three.Mesh(floorGeo, floorMat);
  floor.position.y = -50;
  world.add(floor);
  return world;
}
