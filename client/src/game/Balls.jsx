import * as three from "three";
import { BALL_ANIMATIONS } from "../constants";

import { getModelInstance } from "./Models";
import { getMetadata } from "./Player";

var balls = {}; // associates each ball with game data
var ballsModels = {}; // associates each ball with 3d model
var ballGroup = new three.Group();

var intermediateVector = new three.Vector3();

// update ball data from server update
export function updateBalls(ballData) {
  if (ballData.didChange) {
    for (const index in balls) {
      if (!(index in ballData)) {
        removeBall(index);
      }
    }
    for (const index in ballData) {
      if (!(index in balls)) {
        console.log("Added Ball", index);
        addBall(index, ballData[index]);
      }
    }
  }
  // updating all ball positions/statuses
  balls = ballData;
}

// adds ball in scene
//   ball is in scene if thrown in air or sitting on floor
export function addBall(id, data) {
  let model = createBall((getMetadata() && getMetadata().ball) || 2);

  ballsModels[id] = model;
  ballsModels[id].rotation.order = 'YXZ'; // Rotation order allows orienting objects for animations
  ballGroup.add(model);
  model.position.set(data.x, data.y, data.z);
}

// removes ball from scene
//   ball is removed if player picks up, player hasBall status updates
export function removeBall(id) {
  //dispose of 3d model
  ballGroup.remove(ballsModels[id]);
  delete ballsModels[id];
  delete balls[id];
}

// cleans up all balls from the field
export function clearBalls() {
  for (const id in ballsModels) {
    removeBall(id);
  }

  balls={}
}

// updates all in-game balls with server information
//   new positions based on movement/"gravity"
//   model based on association with player who threw/holds it
export function update() {
  for (const index in balls) {
    if (index == "didChange") continue;
    if (!(index in balls && index in ballsModels)) {
      console.log("[PROBLEM] Ball ID: ",index," | ",balls[index]," | ballsModels:",ballsModels[index])
      alert("PROBLEM DETECTED!");
      continue;
    }
    intermediateVector.set(balls[index].x, balls[index].y, balls[index].z);
    ballsModels[index].position.lerp(intermediateVector, 0.2);
    if(balls[index].velocity[1] != 0){
      // if ball is still in air, apply animation and "gravity"
      ballsModels[index].rotation.y = Math.atan2(balls[index].velocity[0], balls[index].velocity[2]);
      BALL_ANIMATIONS[getMetadata().ball](ballsModels[index]);
    }
  }
}

// For adding balls to scene
export function getBallGroup() {
  return ballGroup;
}

// Creating ball model in three js
export function createBall(model) {
  let ball = new three.Group()
  ball.add(getModelInstance(model));
  return ball;
}
