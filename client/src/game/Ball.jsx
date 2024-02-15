import * as three from "three";


export function createBall() {
    const ballGeometry = new three.SphereGeometry(1, 32, 32);
    const ballMaterial = new three.MeshLambertMaterial({});
    const ball = new three.Mesh(ballGeometry, ballMaterial);
    ball.position.set(0, 0.3, 0); 
    return ball;
}

// move the ball
export function moveBall(ball, deltaX, deltaY, deltaZ) {
    ball.position.x += deltaX;
    ball.position.y += deltaY;
    ball.position.z += deltaZ;
}

// rotate the ball
export function rotateBall(ball, rotationX = 0, rotationY = 0, rotationZ = 0) {
    ball.rotation.x += three.MathUtils.degToRad(rotationX);
    ball.rotation.y += three.MathUtils.degToRad(rotationY);
    ball.rotation.z += three.MathUtils.degToRad(rotationZ);
  }

  // texture the ball
export function textureBall(ball, texturePath, repeatX = 1, repeatY = 1) {
    const texture = new three.TextureLoader().load(texturePath);
    texture.wrapS = three.RepeatWrapping;
    texture.wrapT = three.RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);

    ball.material.map = texture;
    ball.material.needsUpdate = true;
}
