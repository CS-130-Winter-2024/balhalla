import * as three from "three";
import { BALL_ANIMATIONS, DODGE_BALL_SIDES } from "../constants";

import { getModelInstance } from "./Models";
import { getMetadata } from "./Player";

var balls = {}; // associates each ball with game data
var ballsModels = {}; // associates each ball with 3d model
var ballGroup = new three.Group();

var intermediateVector = new three.Vector3();

// update ball data from server update
export function updateBalls(ballData, playerData) {
  if (Object.keys(balls).length != Object.keys(ballData).length) {
    if (Object.keys(balls).length > Object.keys(ballData).length) {
      for (const index in balls) {
        if (!(index in ballData)) {
          removeBall(index);
        }
      }
    } else {
      //add new ball
      for (const index in ballData) {
        if (!(index in balls)) {
          console.log("Added Ball", index);
          addBall(index, ballData[index]);
        }
      }
    }
  }
  balls = ballData;
}

// adds ball in scene
//   ball is in scene if thrown in air or sitting on floor
export function addBall(id, data) {
  let model = createBall(getMetadata().ball);

  ballsModels[id] = model;
  ballsModels[id].rotation.order = 'YXZ';
  ballGroup.add(model);
  model.position.set(data.x, data.y, data.z);
}

// removes ball from scene
//   ball is removed if player picks up, player hasBall status updates
export function removeBall(id) {
  //dispose of 3d model
  ballGroup.remove(ballsModels[id]);
  delete ballsModels[id];
}


export function clearBalls() {
  for (const id in ballsModels) {
    removeBall(id);
  }
}

// updates all in-game balls with server information
//   new positions based on movement/"gravity"
//   model based on association with player who threw/holds it
export function update() {
  for (const index in balls) {
    intermediateVector.set(balls[index].x, balls[index].y, balls[index].z);
    ballsModels[index].position.lerp(intermediateVector, 0.2);
    if(balls[index].velocity[1] != 0){
      ballsModels[index].rotation.y = Math.atan2(balls[index].velocity[0], balls[index].velocity[2]);
      BALL_ANIMATIONS[getMetadata().ball](ballsModels[index]);
    }
  }
}

// For adding balls to scene
export function getBallGroup() {
  return ballGroup;
}

export function createBall(model) {
  let ball = new three.Group()
  ball.add(getModelInstance(model));
  return ball;
}
