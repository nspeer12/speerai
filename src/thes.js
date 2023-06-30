import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function createSceneAndCamera() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;
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
    document.getElementById(`${section}-canvas`).appendChild(renderer.domElement);
    return renderer;
}

export function renderTheS() {
    const { scene, camera } = createSceneAndCamera();
    addLightingToScene(scene);
    const renderer = createRenderer('thes');

    const material = new THREE.LineBasicMaterial({ color: 0xffffff });

    // Set the size of the S
    const size = 3;

    // Define the points for the "Cool S" shape
    const points1 = [
        new THREE.Vector3(-size, size, 0),
        new THREE.Vector3(0, size * 2, 0),
        new THREE.Vector3(size, size, 0),
    ];
    const points2 = [
        new THREE.Vector3(-size, -size, 0),
        new THREE.Vector3(0, -size * 2, 0),
        new THREE.Vector3(size, -size, 0),
    ];
    const points3 = [
        new THREE.Vector3(-size, size, 0),
        new THREE.Vector3(-size, -size, 0),
    ];
    const points4 = [
        new THREE.Vector3(size, size, 0),
        new THREE.Vector3(size, -size, 0),
    ];
    const points5 = [
        new THREE.Vector3(0, size, 0),
        new THREE.Vector3(0, 0, 0),
    ];
    const points6 = [
        new THREE.Vector3(0, -size, 0),
        new THREE.Vector3(0, 0, 0),
    ];

    const geometry1 = new THREE.BufferGeometry().setFromPoints(points1);
    const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
    const geometry3 = new THREE.BufferGeometry().setFromPoints(points3);
    const geometry4 = new THREE.BufferGeometry().setFromPoints(points4);
    const geometry5 = new THREE.BufferGeometry().setFromPoints(points5);
    const geometry6 = new THREE.BufferGeometry().setFromPoints(points6);

    const line1 = new THREE.Line(geometry1, material);
    const line2 = new THREE.Line(geometry2, material);
    const line3 = new THREE.Line(geometry3, material);
    const line4 = new THREE.Line(geometry4, material);
    const line5 = new THREE.Line(geometry5, material);
    const line6 = new THREE.Line(geometry6, material);

    scene.add(line1, line2, line3, line4, line5, line6);

    const controls = new OrbitControls(camera, renderer.domElement);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}
