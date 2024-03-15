import * as three from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import skybox from '../../assets/textures/skybox.png'
import arena from '../../assets/models/Arena.glb'

const ModelLoader = new GLTFLoader()
const TextureLoader = new three.TextureLoader()

/**
 * Function to get the skybox texture.
 * @function
 * @name getSkybox
 * @returns {Texture} The skybox texture.
 */
export function getSkybox() {
  const bg = TextureLoader.load(skybox)
  bg.mapping = three.EquirectangularReflectionMapping
  bg.colorSpace = three.SRGBColorSpace
  return bg
}

/**
 * Function to create the 3D world. (Only one 3d world)
 * @function
 * @name createWorld
 * @returns {Group} The 3D world group.
 */
export function createWorld() {
  var world = new three.Group()
  //let floorGeo = new three.BoxGeometry();
  //let floorMat = new three.MeshLambertMaterial({ color: colors.floor });
  //floorGeo.scale(31, 99, 31);
  //var floor = new three.Mesh(floorGeo, floorMat);
  //floor.position.y = -50;
  //world.add(floor);

  ModelLoader.load(arena, gltf => {
    let arena = gltf.scene
    arena.position.set(0, 0, 0)
    arena.scale.set(15, 15, 15)
    console.log('[GLTF]', gltf)
    world.add(arena)
  })

  return world
}
