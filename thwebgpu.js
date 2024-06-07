import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import WebGPU from "three/addons/capabilities/WebGPU.js";
import WebGPURenderer from "three/addons/renderers/webgpu/WebGPURenderer.js";
import { toneMapping, color, viewportTopLeft } from "three/nodes";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);

scene.background = new THREE.Color(0xa0a0a0);
scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

// const renderer = new THREE.WebGLRenderer();


if ( WebGPU.isAvailable() === false) {
    throw new Error( 'WebGPU not available' );
}
const renderer = new WebGPURenderer();
renderer.toneMappingNode = toneMapping(THREE.LinearToneMapping, 0.4);


renderer.setSize(800, 600);
renderer.setAnimationLoop(animate);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

////lights

// const dirLight = new THREE.DirectionalLight(0xffffff, 3);
// dirLight.position.set(0, 10, 10);
// dirLight.castShadow = true;
// dirLight.shadow.camera.top = 2;
// dirLight.shadow.camera.bottom = -2;
// dirLight.shadow.camera.left = -2;
// dirLight.shadow.camera.right = 2;
// dirLight.shadow.camera.near = 0.1;
// dirLight.shadow.camera.far = 40;
// scene.add(dirLight);
// const light = new THREE.AmbientLight(0x404040); // soft white light
// scene.add(light);

// const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
// hemiLight.position.set(5, 10, 10);
// scene.add(hemiLight);

const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(5, 5, 5);
light.power = 3000;
scene.add(light);

const ambient = new THREE.AmbientLight(0x4466ff, 1);
scene.add(ambient);

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

camera.position.z = 3;
camera.position.y = 1;

const loader = new GLTFLoader();
let mixer = null;
const clock = new THREE.Clock();

const mesh = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false })
);
mesh.rotation.x = -Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);

loader.load(
  "target.glb",
  function (gltf) {
    scene.add(gltf.scene);
    gltf.scene.traverse(function (object) {
      if (object.isMesh) object.castShadow = true;
    });

    let mesh = gltf.scene;
    mixer = new THREE.AnimationMixer(mesh);
    const clip = gltf.animations[0];
    const action = mixer.clipAction(clip);
    action.play();
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

function animate() {
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  if (mixer != null) mixer.update(clock.getDelta());
  renderer.render(scene, camera);
}
