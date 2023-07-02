import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


function createSceneAndCamera() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = -2;
    camera.position.y = 0;
    camera.position.x = 0;
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
    const container = document.getElementById(`${section}-canvas`);
  
    function resizeRenderer() {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
    }
  
    // Resize the renderer initially
    resizeRenderer();
  
    // Resize the renderer whenever the window is resized
    window.addEventListener('resize', resizeRenderer);
  
    container.appendChild(renderer.domElement);
  
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

  export function renderTorus() {
    const { scene, camera } = createSceneAndCamera();
    addLightingToScene(scene);
    const renderer = createRenderer('torus');
  
    // Create outer wireframe torus
    const outerTorusGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
    const wireframeGeometry = new THREE.WireframeGeometry(outerTorusGeometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true }); // Set color to white and make it semi-transparent
    const outerTorus = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    outerTorus.rotation.x = Math.PI / 2; // Rotate 45 degrees about x-axis
    scene.add(outerTorus);

  
    // Create inner spinning torus
    const innerTorusGeometry = new THREE.TorusGeometry(1, 0.3, 16, 100);

    // Load a texture
    const textureLoader = new THREE.TextureLoader();
    const plasmaTexture = textureLoader.load('img/plasma.jpeg');

    const innerTorusMaterial = new THREE.MeshBasicMaterial({
        map: plasmaTexture,
        transparent: true,
        opacity: 0.4,
    }); // Apply the texture

    const innerTorus = new THREE.Mesh(innerTorusGeometry, innerTorusMaterial);
    innerTorus.rotation.x = Math.PI / 2; 
    scene.add(innerTorus);

    // Step 1: Generate vertices for a helix
    function generateHelixVertices(radius, tube, radialSegments, tubularSegments) {
        const vertices = [];
        for (let j = 0; j <= tubularSegments; ++j) {
        const u = j / tubularSegments * Math.PI * 2;
        for (let i = 0; i <= radialSegments; ++i) {
            const v = i / radialSegments * Math.PI * 2;
            const x = (radius + tube * Math.cos(v)) * Math.cos(u);
            const y = (radius + tube * Math.cos(v)) * Math.sin(u);
            const z = tube * Math.sin(v);
            vertices.push(new THREE.Vector3(x, y, z));
        }
        }
        return vertices;
    }
    
    // Step 2: Create geometry from vertices
    const helixVertices = generateHelixVertices(1.01, 0.35, 20, 42);  // Adjust parameters as needed
    const fieldLinesGeometry = new THREE.BufferGeometry().setFromPoints(helixVertices);
    
    // Step 3: Create line from geometry
    const fieldLinesMaterial = new THREE.LineBasicMaterial({ color: 0x39FF14 });
    const fieldLines = new THREE.Line(fieldLinesGeometry, fieldLinesMaterial);
    scene.add(fieldLines);

    fieldLines.rotation.x = Math.PI / 2; // Rotate 45 degrees about x-axis
  
  
    const controls = createControls(camera, renderer);
  
    // Modify the animate function to include the torus spinning
    function animate() {
      function frame() {
        requestAnimationFrame(frame);
      
        // Update the rotation for outer torus
        outerTorus.rotation.x += 0.001;
        outerTorus.rotation.y += 0.0003;
    
        innerTorus.rotation.x += 0.001;
        innerTorus.rotation.y += 0.0003;
        innerTorus.rotation.z = -1 * Date.now() / 1550;
    
        fieldLines.rotation.x += 0.001;
        fieldLines.rotation.y += 0.0003;
        fieldLines.rotation.z = -1* Date.now() / 1500;
    
        // Alternate the color of the inner torus
        innerTorusMaterial.color.setHex(Date.now() * 0.00001 % 2 > 1 ? 0x00FFFF : 0xFFFFFF);
    
        let time = performance.now() * 0.0005; // Convert time to seconds
    
        // Rotate the camera around the scene
        //camera.position.x = Math.cos(time) * 1;
        //camera.position.y = Math.sin(time) * 1;
        camera.position.z = 2.5 + Math.sin(time) * 0.1;
        camera.lookAt(scene.position);
    
        controls.update();
        renderer.render(scene, camera);
      }
      frame();
    }
    
  
    animate();
  }
  