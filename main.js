import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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

function createRenderer(section) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth / 2, window.innerHeight);
  document.getElementById(`${section}-canvas`).appendChild(renderer.domElement);
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

function renderWork() {
  const { scene, camera } = createSceneAndCamera();
  addLightingToScene(scene);
  const renderer = createRenderer('work');
  const loader = new GLTFLoader();
  loader.load('assets/spot/scene.gltf', function(gltf) {
    scene.add(gltf.scene);
  }, undefined, function(error) {
    console.error(error);
  });
  const controls = createControls(camera, renderer);
  animate(controls, renderer, scene, camera);
}


function renderProjects() {
  const { scene, camera } = createSceneAndCamera();
  addLightingToScene(scene);
  const renderer = createRenderer('projects');

  const layers = [5, 10, 5]; // layer sizes
  const layerMeshes = []; // to store the nodes (spheres)
  const spacing = 7;

  for (let i = 0; i < layers.length; i++) {
    const layer = [];
    for (let j = 0; j < layers[i]; j++) {
      for (let k = 0; k < layers[i]; k++) {
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphereMesh.position.set(i * spacing - layers.length, j * 2 - layers[i]/2, k * 2 - layers[i]/2);
        scene.add(sphereMesh);
        layer.push(sphereMesh);
      }
    }
    layerMeshes.push(layer);
  }

  

  // Create connections between nodes
  for (let i = 0; i < layerMeshes.length - 1; i++) {
    for (let j = 0; j < layerMeshes[i].length; j++) {
      for (let k = 0; k < layerMeshes[i + 1].length; k++) {
        const opacity = Math.random(0.3, 0.7); // random opacity
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: opacity }); // Create a new material with unique opacity for each line
        const points = [layerMeshes[i][j].position, layerMeshes[i + 1][k].position];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
      }
    }
  }

  const controls = createControls(camera, renderer);
  animate(controls, renderer, scene, camera);
}



function renderResearch() {
  const { scene, camera } = createSceneAndCamera();
  addLightingToScene(scene);
  const renderer = createRenderer('research');

  // Create outer wireframe torus
  const outerTorusGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
  const wireframeGeometry = new THREE.WireframeGeometry(outerTorusGeometry);
  const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); // Set color to white
  const outerTorus = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
  outerTorus.rotation.x = Math.PI / 4; // Rotate 45 degrees about x-axis
  outerTorus.rotation.y = Math.PI / 4; // Rotate 45 degrees about y-axis
  scene.add(outerTorus);

  // Create inner spinning torus
  const innerTorusGeometry = new THREE.TorusGeometry(1, 0.3, 16, 100); // Set the inner radius to be the same as the outer torus
  const innerTorusMaterial = new THREE.MeshPhongMaterial({ color: 0x00FFFF }); // Set color to cyan
  const innerTorus = new THREE.Mesh(innerTorusGeometry, innerTorusMaterial);
  innerTorus.rotation.x = Math.PI / 4; // Rotate 45 degrees about x-axis
  innerTorus.rotation.y = Math.PI / 4; // Rotate 45 degrees about y-axis
  scene.add(innerTorus);

  const controls = createControls(camera, renderer);

  // Modify the animate function to include the inner torus spinning
  function animate() {
    function frame() {
      requestAnimationFrame(frame);
      innerTorus.rotation.z += 0.01;  // Spin the inner torus on y-axis
      controls.update();
      renderer.render(scene, camera);
    }
    frame();
  }

  animate();
}






// call each function
renderIntro();
renderWork();
renderProjects();
renderResearch();
