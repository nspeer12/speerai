import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let mixer;
let clock = new THREE.Clock();

function createSceneAndCamera() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 7;
    camera.position.y = 3;
    camera.position.x = 3;
    return { scene, camera };
}

function createRenderer() {
    // Get the parent container
    var parentContainer = document.getElementById('spot-canvas');

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

function loadModel(scene) {
    const loader = new GLTFLoader();
    loader.load('./assets/robot_dog.glb', function (gltf) {
        const model = gltf.scene;
        model.name = 'robotDog';  // Add a name to your model for easier access
        scene.add(model);

        const animations = gltf.animations;
        mixer = new THREE.AnimationMixer(model);
        animations.forEach((animation) => {
            const action = mixer.clipAction(animation);
            action.play();
        });
    });
}

function addLightingToScene(scene) {
    const light = new THREE.AmbientLight(0x404040, 100); // soft white light
    scene.add(light);
}

function animate(controls, renderer, scene, camera) {
    function frame() {
        requestAnimationFrame(frame);

        const model = scene.getObjectByName('robotDog');
        // Walk Spot
        if (model) {
            model.position.x += 0.001;
            model.position.z += 0.001;  // Change this value to adjust the speed and direction of movement
        }

        if (mixer) mixer.update(clock.getDelta());
        controls.update();
        renderer.render(scene, camera);
    }
    frame();
}

export function spot() {
    const { scene, camera } = createSceneAndCamera();
    const renderer = createRenderer();
    const controls = createControls(camera, renderer);
    loadModel(scene);
    addLightingToScene(scene);
    animate(controls, renderer, scene, camera);

    // Handle window resize events
    window.onresize = function() {
        // Get the parent container
        var parentContainer = document.getElementById('spot-canvas');

        // Get width and height of the parent container
        var width = parentContainer.offsetWidth;
        var height = parentContainer.offsetHeight;

        // Update renderer size
        renderer.setSize(width, height);

        // Also update the camera aspect ratio and projection matrix
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };
}
