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
  "../../assets/models/goku.glb",
  "../../assets/models/Viking.glb",
  "../../assets/models/pets/Turtle.glb",
  "../../assets/models/pets/Tree.glb",
];




// Sample test world for development
// function sampleTestWorld(world) {

//   let humanModel;
//   ModelLoader.load(
//     vikingboat,
//     (gltf) => {
//       humanModel = gltf.scene;
//       // humanModel.scale.set(2, 2, 2);
//       humanModel.position.set(2, 0, 4);
//       // humanModel.children[0].rotation.set(1.5, 0, 0);
//       console.log("[MODEL] ", gltf);
//       world.add(humanModel);

//       //mixer = new three.AnimationMixer(humanModel);
//       //const clip = gltf.animations[0];
//       //const action = mixer.clipAction(clip);
//       //action.play();
//     },
//     undefined,
//     (error) => console.error("Error loading human model", error),
//   );

//   return world;
// }


export function createLobbyWorld() {
  var world = new three.Group();
  let currentModelIndex = 0

  const arrowSize = 1;

  // Arrow geometries
  const arrowGeometry = new three.BoxGeometry(arrowSize, arrowSize, arrowSize);
  const leftArrow = new three.Mesh(arrowGeometry, new three.MeshBasicMaterial({ color: 0x00ff00 }));
  const rightArrow = new three.Mesh(arrowGeometry, new three.MeshBasicMaterial({ color: 0x00ff00 }));
  leftArrow.position.set(-2, 0, 3);
  rightArrow.position.set(2.5, 0, 3);
  // Set names for raycasting identification
  leftArrow.name = "leftArrow";
  rightArrow.name = "rightArrow";
  world.add(leftArrow);
  world.add(rightArrow);


  function loadAndAddModel(modelPath) {


    let model;
    ModelLoader.load(modelPath, (gltf) => {
      model = gltf.scene;
      model.position.set(.25, 0, 3);
      

      // scale model to fit in certain height idk how
      model.scale.set(4/5, 4/5, 4/5);

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
    if (clickedObject.name === "leftArrow") {
      // Handle left arrow click
      currentModelIndex = (currentModelIndex - 1 + modelPaths.length) % modelPaths.length;
      world.children.length = 0; // Remove current models
      loadAndAddModel(modelPaths[currentModelIndex]);
    } else if (clickedObject.name === "rightArrow") {
      // Handle right arrow click
      currentModelIndex = (currentModelIndex + 1) % modelPaths.length;
      world.children.length = 0; // Remove current models
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

  return world;
}
