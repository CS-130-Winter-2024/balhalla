import * as three from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import world from "./World";
import { createCamera } from "./Player";

function updateAspect(renderer, camera) {
  const canvas = renderer.domElement;
  // look up the size the canvas is being displayed
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  // adjust displayBuffer size to match
  if (canvas.width !== width || canvas.height !== height) {
    // you must pass false here or three.js sadly fights the browser
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}

export default function main() {
  var locked = false;
  var scene = new three.Scene();
  scene.background = new three.Color(0x87ceeb);
  var renderer = new three.WebGLRenderer({ antialias: true });
  renderer.domElement.id = "GameCanvas";
  document.body.appendChild(renderer.domElement);

  var camera = createCamera();
  scene.add(world());
  let light = new three.PointLight(0xffffff, 4, 0, 0);
  light.position.set(0, 20, 10);
  scene.add(light);

  var controls = new PointerLockControls(camera, renderer.domElement);
  controls.connect();
  controls.addEventListener("lock", () => {
    document.dispatchEvent(new CustomEvent("lock"));
  });
  controls.addEventListener("unlock", () => {
    document.dispatchEvent(new CustomEvent("unlock"));
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key == " ") {
      if (locked) {
        controls.lock();
        locked = false;
      } else {
        controls.unlock();
        locked = true;
      }
    }
  });

  updateAspect(renderer, camera);
  window.addEventListener("resize", () => {
    updateAspect(renderer, camera);
  });

  function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}
