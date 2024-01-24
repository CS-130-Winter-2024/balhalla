import * as three from "three";

var statics = {};

function createCamera() {
  statics.camera = new three.PerspectiveCamera(75, 2, 0.1, 1000);
  statics.camera.position.z = 25;
  statics.camera.position.y = 10;
  statics.camera.zoom = 1.3;
  statics.camera.lookAt(0, 0, 5);
  statics.camera.updateProjectionMatrix();
}

function updateAspect() {
  const canvas = statics.renderer.domElement;
  // look up the size the canvas is being displayed
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  // adjust displayBuffer size to match
  if (canvas.width !== width || canvas.height !== height) {
    // you must pass false here or three.js sadly fights the browser
    statics.renderer.setSize(width, height, false);
    statics.camera.aspect = width / height;
    statics.camera.updateProjectionMatrix();
  }
}

function createWorld() {
  statics.world = new three.Group();
  let floorGeo = new three.BoxGeometry();
  let floorMat = new three.MeshLambertMaterial({ color: 0x333333 });
  floorGeo.scale(31, 99, 31);
  statics.floor = new three.Mesh(floorGeo, floorMat);
  statics.floor.position.y = -50;
  statics.world.add(statics.floor);
  return statics.world;
}

export default function main() {
  statics.scene = new three.Scene();
  statics.scene.background = new three.Color(0x87ceeb);
  statics.renderer = new three.WebGLRenderer({ antialias: true });
  statics.renderer.domElement.id = "GameCanvas";
  document.body.appendChild(statics.renderer.domElement);

  createCamera();
  statics.scene.add(createWorld());
  let light = new three.PointLight(0xffffff, 4, 0, 0);
  light.position.set(0, 20, 10);
  statics.scene.add(light);
  console.log(statics);
  updateAspect();
  window.addEventListener("resize", updateAspect);
  function animate() {
    statics.renderer.render(statics.scene, statics.camera);
    requestAnimationFrame(animate);
  }
  animate();
}
