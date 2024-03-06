import React, { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import { OrbitControls } from 'three/addons/controls/OrbitControls';

const Store = ({ initialModelPath, nextModelPath }) => {
  useEffect(() => {
    // Initialize Three.js scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true }); // Set alpha to true for transparency
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add OrbitControls for user interaction
    const controls = new OrbitControls(camera, renderer.domElement);

    // Load initial 3D model
    const loader = new GLTFLoader();
    let currentModel;

    const loadModel = (modelPath) => {
      loader.load(modelPath, (gltf) => {
        if (currentModel) {
          scene.remove(currentModel);
        }
        currentModel = gltf.scene;
        scene.add(currentModel);
      });
    };

    // Initial model path
    loadModel(initialModelPath);

    // Set camera position
    camera.position.z = 5;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    // Handle window resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Render function
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Update controls for interaction
      renderer.render(scene, camera);
    };

    // Initiate rendering
    animate();

    // Clean up on component unmount
    return () => {
      scene.dispose();
      renderer.dispose();
    };
  }, [initialModelPath]);

  return (
    <div id="storeOverlay" style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none' }}>
      <button id="nextButton" style={{ pointerEvents: 'auto' }} onClick={() => loadModel(nextModelPath)}>
        Next
      </button>
    </div>
  );
};

export default Store;
