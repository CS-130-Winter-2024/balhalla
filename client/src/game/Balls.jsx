import * as three from "three";
import { DODGE_BALL_SIDES } from "../constants";

var balls = {}; // associates each ball with game data
var ballsModels = {}; // associates each ball with 3d model
var ballGroup = new three.Group();

const ballGeometry = new three.SphereGeometry(
  0.25,
  DODGE_BALL_SIDES,
  DODGE_BALL_SIDES,
);
const ballMaterial = new three.MeshLambertMaterial({});

var intermediateVector = new three.Vector3();

// update ball data from server update
export function updateBalls(ballData) {
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
  let model = createBall();
  ballsModels[id] = model;
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

// updates all in-game balls with server information
//   new positions based on movement/"gravity"
//   model based on association with player who threw/holds it
export function update() {
  for (const index in balls) {
    intermediateVector.set(balls[index].x, balls[index].y, balls[index].z);
    ballsModels[index].position.lerp(intermediateVector, 0.2);
  }
}

// For adding balls to scene
export function getBallGroup() {
  return ballGroup;
}

export function createBall() {
  let ball = new three.Mesh(ballGeometry, ballMaterial);
  return ball;
}

