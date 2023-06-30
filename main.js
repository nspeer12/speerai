import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { renderTorus } from './src/torus.js';
import { nn } from './src/nn';
import { renderTheS } from './src/thes';
import { spot } from './src/spot';

function createSceneAndCamera() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  return { scene, camera };
}

function addLightingToScene(scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);
}

function createRenderer() {
  // Get the parent container
  var parentContainer = document.getElementById('intro-canvas');

  // Get width and height of the parent container
  var width = parentContainer.offsetWidth;
  var height = parentContainer.offsetHeight;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  parentContainer.appendChild(renderer.domElement);
  return renderer;
}

function createControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
  return controls;
}

function animate(controls, renderer, scene, camera) {
  function frame() {
    requestAnimationFrame(frame);
    controls.update();
    renderer.render(scene, camera);
  }
  frame();
}

function renderIntro() {
  const { scene, camera } = createSceneAndCamera();
  addLightingToScene(scene);
  const renderer = createRenderer('intro');
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('img/a.png');
  const material = new THREE.MeshPhongMaterial({ map: texture });
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const mesh = new THREE.Mesh(cubeGeometry, material);
  scene.add(mesh);
  const controls = createControls(camera, renderer);
  animate(controls, renderer, scene, camera);
}


// // call each function
renderIntro();
nn();
renderTorus();
spot();
