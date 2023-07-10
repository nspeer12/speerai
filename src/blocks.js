import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

function createSceneAndCamera() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  camera.position.y = 5;
  camera.position.x = 5;
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
  var parentContainer = document.getElementById('blocks-canvas');
  // var width = parentContainer.offsetWidth;
  // var height = parentContainer.offsetHeight;
  var width = 500;
  var height = 500;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  parentContainer.appendChild(renderer.domElement);
  return renderer;
}

function createControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 1.5;
  return controls;
}

export function skillStack() {
  const { scene, camera } = createSceneAndCamera();
  addLightingToScene(scene);
  const renderer = createRenderer();

  const skills = ['python', 'javascript', 'vue.js', 'react', 'next.js', 'fastapi', 'mysql', 'mongodb', 'openai', 'opencv', 'cloud computing', 'linux', 'ux', 'ui', 'product design'];

  const loader = new FontLoader();

  loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    for (let i = 0; i < skills.length; i++) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.y = i;
      scene.add(cube);

      const textGeometry = new THREE.TextBufferGeometry(skills[i], {
        font: font,
        size: 0.2,
        height: 0.05,
        curveSegments: 12,
      });

      const textMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
      const text = new THREE.Mesh(textGeometry, textMaterial);
      text.position.y = i;
      text.position.x = -0.5;
      scene.add(text);
    }
  });

  const controls = createControls(camera, renderer);

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}
