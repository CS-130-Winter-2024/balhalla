import * as three from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import skybox from "../../assets/textures/skybox.png";
import arena from "../../assets/models/SeaArena.glb";
import vikingboat from "../../assets/models/VikingBoat.glb";

import { colors } from "../constants";

const ModelLoader = new GLTFLoader();
const TextureLoader = new three.TextureLoader();

export function getSkybox() {
  const bg = TextureLoader.load(skybox);
  bg.mapping = three.EquirectangularReflectionMapping;
  bg.colorSpace = three.SRGBColorSpace;
  return bg;
}


export function createWorld() {
  var world = new three.Group();
  //let floorGeo = new three.BoxGeometry();
  //let floorMat = new three.MeshLambertMaterial({ color: colors.floor });
  //floorGeo.scale(31, 99, 31);
  //var floor = new three.Mesh(floorGeo, floorMat);
  //floor.position.y = -50;
  //world.add(floor);

  ModelLoader.load(arena, (gltf) => {
    let arena = gltf.scene;
    arena.position.set(0, 0, 0);
    arena.scale.set(15, 15, 15);
    console.log("[GLTF]", gltf);
    world.add(arena);
  });

  return world;
}
