import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { renderTorus } from './src/torus.js';
import { nn } from './src/nn';
import { renderThes } from './src/thes';
import { spot } from './src/spot';



nn();
renderTorus();
spot();
renderThes();