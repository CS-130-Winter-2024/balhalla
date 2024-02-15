import * as three from "three";
import {createBall, moveBall, rotateBall, textureBall} from "./Ball";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"; 


import gorilla from "../../assets/textures/gorilla.png";
import xiao from "../../assets/textures/xiao.gif";
import lisa from "../../assets/textures/lisa.jpg";
 

export default function createWorld() {
  var world = new three.Group();
  let floorGeo = new three.BoxGeometry();
  let floorMat = new three.MeshLambertMaterial({ color: 0x333333 });
  floorGeo.scale(31, 99, 31);
  var floor = new three.Mesh(floorGeo, floorMat);
  floor.position.y = -50;
  world.add(floor);


  // adding ball
  let ball = createBall();
  world.add(ball);
  const textures = [gorilla, xiao, lisa]
  let revolutions = 0;
  let currentTextureIndex = 0;

  // adding texture
  textureBall(ball, gorilla, 2, 2)

  // adding human model
  const loader = new GLTFLoader();
  let humanModel;
  let mixer;

  loader.load(
    "../../assets/models/goku.glb",
    (gltf) => {
      humanModel = gltf.scene;
      humanModel.scale.set(0.8, 0.8, 0.8); 
      humanModel.position.set(2, 0, 4); 
      world.add(humanModel);

      mixer = new three.AnimationMixer(humanModel);
      const clip = gltf.animations[0]; 
      const action = mixer.clipAction(clip);
      action.play();
    },
    undefined,
    (error) => console.error("Error loading human model", error)
  );
  

  // Animation loop
  let angle = 0;
  const radius = .025;
  function animate() {
    requestAnimationFrame(animate);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    moveBall(ball, x, y, 0);
    rotateBall(ball, 0.5, 0, 0);
    
    
    // Update texture every full revolution
    if (angle >= Math.PI * 2) {
      angle = 0;
      revolutions++;

      currentTextureIndex = revolutions % textures.length;
      const currentTexture = textures[currentTextureIndex];
      textureBall(ball, currentTexture, 2, 2);

    }

    // Update angle
    angle += 0.01;

    // makes goku do goku things with clock
    if (humanModel) {
      mixer.update(0.01); 
    }
  }

  // Start the animation loop
  animate();


  return world;
}
