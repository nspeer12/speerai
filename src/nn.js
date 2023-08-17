import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


function createSceneAndCamera() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 12; // Adjust camera position to fit neural network
  camera.position.y = 5;
  camera.position.x = 4;
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
    var parentContainer = document.getElementById('education-canvas');

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
    controls.enableDamping = true; // optional, for smoother rotation
    controls.dampingFactor = 1.5; // optional, for smoother rotation
    return controls;
  }

export function nn(isAnimating) {
  const { scene, camera } = createSceneAndCamera();
  addLightingToScene(scene);
  const renderer = createRenderer('education');
  const layers = [3, 5, 5, 5, 3];
  const nodes = [];
  const connections = [];

  for (let i = 0; i < layers.length; i++) {
    const layer = [];
    for (let j = 0; j < layers[i]; j++) {
      for (let k = 0; k < layers[i]; k++) {
        const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const mesh = new THREE.Mesh(sphereGeometry, material);
        mesh.position.set(i * 5 - (layers.length - 1) * 2.5, j * 1 - (layers[i] - 1) / 2, k * 1 - (layers[i] - 1) / 2);
        scene.add(mesh);
        layer.push({ mesh, material });
      }
    }
    nodes.push(layer);
  }

  for (let i = 0; i < nodes.length - 1; i++) {
    for (let j = 0; j < nodes[i].length; j++) {
      for (let k = 0; k < nodes[i + 1].length; k++) {
        if (Math.random() < 0.5) { // Randomly decide whether to create this connection
          const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
          const points = [];
          points.push(nodes[i][j].mesh.position, nodes[i + 1][k].mesh.position);
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(geometry, material);
          scene.add(line);
          connections.push({ line, material, nodeStart: nodes[i][j], nodeEnd: nodes[i + 1][k] });
        }
      }
    }
  }

  const controls = createControls(camera, renderer);
  
  function animate() {

    if (!isAnimating) {
      return;
    }

    requestAnimationFrame(animate);
    let time = performance.now() * 0.0003; // Convert time to seconds
  
    for (let i = 0; i < connections.length; i++) {
      // Change the color of the connection
      const color = new THREE.Color(`hsl(${(time * 10 + i / connections.length * 180) % 360}, 100%, 50%)`);
      connections[i].material.color = color;
  
      // Change the transparency of the connection
      connections[i].material.opacity = (Math.sin(time * 1.25 + i / connections.length * Math.PI) + 0.2) / 2;
  
      // Change the color of the nodes
      connections[i].nodeStart.material.color = color;
      connections[i].nodeEnd.material.color = color;
    }
  
    // Rotate the camera around the scene
    camera.position.x = Math.cos(time) * 5;
    //camera.position.z = Math.sin(time) * 2;
    camera.position.y = Math.sin(time) * 2;
    camera.lookAt(scene.position);
  
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}  