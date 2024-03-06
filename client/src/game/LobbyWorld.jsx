import * as three from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import skybox from "../../assets/textures/skybox.png";
import room from "../../assets/models/Room.glb";
import vikingboat from "../../assets/models/VikingBoat.glb";
import { getCamera } from "./Player";

const ModelLoader = new GLTFLoader();
const TextureLoader = new three.TextureLoader();


// Array of model paths
const modelPaths = [
  "../../assets/models/Goku.glb",
  "../../assets/models/Viking.glb",
  "../../assets/models/Katarina.glb",
  "../../assets/models/Yasuo.glb",
];




export function createLobbyWorld() {
  var world = new three.Group();
  let currentModelIndex = 0
  let prevObjectName = null;

  // load right and left arrow models
  let leftArrowModel;
  ModelLoader.load("../../assets/models/Arrow.glb", (gltf) => {
    leftArrowModel = gltf.scene;
    leftArrowModel.rotation.set(1.5, 1.5, 0);  
    leftArrowModel.position.set(-2, 2, 3);
    leftArrowModel.scale.set(1.5, 1.5, 1.5);
    // add mesh to arrow hitbox
    leftArrowModel.children[0].children[0].children[0].children[0].children[0].name = "rightArrowModel";
    // leftArrowModel.name = "leftArrowModel";
    world.add(leftArrowModel);
  });
  let rightArrowModel;
  ModelLoader.load("../../assets/models/Arrow.glb", (gltf) => {
    rightArrowModel = gltf.scene;
    rightArrowModel.rotation.set(1.5, -1.5, 0);  
    rightArrowModel.position.set(2.5, 2, 3);
    rightArrowModel.children[0].children[0].children[0].children[0].children[0].name = "leftArrowModel";
    world.add(rightArrowModel);
  });

  function scaleByModel(modelPath) {
    if (modelPath === "../../assets/models/Goku.glb") {
      return 4/5;
    }
    if (modelPath === "../../assets/models/Viking.glb") {
      return 1;
    }
    if (modelPath === "../../assets/models/Katarina.glb") {
      return 1/30;
    }

    if (modelPath === "../../assets/models/Yasuo.glb") {
      return 1/15;
    }

    return 1;
  }

  function rotate180(modelPath) {
    if (modelPath === "../../assets/models/Goku.glb") {
      return true;
    }
    if (modelPath === "../../assets/models/Viking.glb") {
      return false;
    }
    if (modelPath === "../../assets/models/Katarina.glb") {
      return true;
    }
    if (modelPath === "../../assets/models/Yasuo.glb") {
      return true;
    }
    
    return false;
  }

  function locked(modelPath) {
    if (modelPath === "../../assets/models/Goku.glb") {
      return true;
    }
    if (modelPath === "../../assets/models/Viking.glb") {
      return false;
    }
    if (modelPath === "../../assets/models/Katarina.glb") {
      return true;
    }
    if (modelPath === "../../assets/models/Yasuo.glb") {
      return false;
    }
    return false;
  }


  function loadAndAddModel(modelPath) {
    // remove current model from world and replace with new model
    const prevObject = world.getObjectByName(prevObjectName);
    if (prevObject) {
      world.remove(prevObject);
      world.remove(world.getObjectByName("lock"));
    }

    if (locked(modelPath)) {
      let lock;
      ModelLoader.load("../../assets/models/Lock.glb", (gltf) => {
        lock = gltf.scene;
        lock.position.set(.25, 3, 3);
        lock.scale.set(.02, .02, .02);
        lock.rotation.set(0, 3.14, 0);
        lock.name = "lock";
        world.add(lock);
      });
    }

    let model;
    ModelLoader.load(modelPath, (gltf) => {
      model = gltf.scene;
      model.position.set(.25, 0, 3);
      model.name = modelPath;
      const scale = scaleByModel(modelPath);
      
      if (rotate180(modelPath)) {
        model.rotation.set(0, 3.14, 0);
      }
      // scale model to fit in certain height idk how
      model.scale.set(scale, scale, scale);
      prevObjectName = model.name
      world.add(model);
    }, undefined, (error) => console.error("Error loading model", error));
  }


  // Raycasting to check for intersections
  function getIntersect() {
    const raycaster = new three.Raycaster();
    const mouse = new three.Vector2(0, 0);
    raycaster.setFromCamera(mouse, getCamera());
    const intersects = raycaster.intersectObjects(world.children, true);
    return intersects.length > 0 ? intersects[0] : null;
    
  }

  // Initial model
  loadAndAddModel(modelPaths[currentModelIndex]);

  // Handle model change when clicking left or right arrows
  document.addEventListener("click", (event) => {
    console.log("click")
  const intersect = getIntersect();
  console.log(intersect.object.name)
  if (intersect) {
    const clickedObject = intersect.object;
    if (clickedObject.name === "leftArrowModel") {
      // Handle left arrow click
      currentModelIndex = (currentModelIndex - 1 + modelPaths.length) % modelPaths.length;
      loadAndAddModel(modelPaths[currentModelIndex]);
    } else if (clickedObject.name === "rightArrowModel") {
      // Handle right arrow click
      currentModelIndex = (currentModelIndex + 1) % modelPaths.length;
      loadAndAddModel(modelPaths[currentModelIndex]);
    }
  }
  });

  ModelLoader.load(room, (gltf) => {
    let room = gltf.scene;
    room.position.set(-5.25, 0, 0);
    console.log("[GLTF]", gltf);
    world.add(room);
  });

  const ambientLight = new three.AmbientLight(0x101010); // Dark gray color
  world.add(ambientLight);

  return world;
}
