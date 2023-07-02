import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let clock = new THREE.Clock();

function createSceneAndCamera() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 12;
    camera.position.y = 12;
    camera.position.x = 12;
    return { scene, camera };
}

function addLightingToScene(scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
}

function createRenderer(section) {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth / 2, window.innerHeight);
    document.getElementById(`thes-canvas`).appendChild(renderer.domElement);
    return renderer;
}

export function renderThes() {
    const { scene, camera } = createSceneAndCamera();
    addLightingToScene(scene);
    const renderer = createRenderer('thes');

    const material = new THREE.LineBasicMaterial({ color: 0xffffff });

    fetch('./src/thes.json')
        .then(response => response.json())
        .then(data => {
            const vertices = data.vertices.map(v => new THREE.Vector3(v.x, v.y, v.z));
            const edges = data.edges.map(([start, end]) => [vertices[start], vertices[end]]);

            edges.forEach(([start, end]) => {
                const points = [start, end];
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, material);
                scene.add(line);
            });

            const controls = new OrbitControls(camera, renderer.domElement);

            function animate() {
                requestAnimationFrame(animate);
                let time = clock.getElapsedTime();
                scene.rotation.y = 3.14159 * Math.cos(time);  
                controls.update();
                renderer.render(scene, camera);
            }

            animate();
        })
        .catch(error => console.error('Error loading JSON data:', error));
}
