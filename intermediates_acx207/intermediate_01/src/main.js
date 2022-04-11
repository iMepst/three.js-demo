import * as THREE from 'three';
import * as DATGUI from 'datgui'

let sphere;
let cube;
let plane;

function main() {
  sceneInit();
  cameraInit();
  windowInit();

  document.getElementById('3d_content').appendChild(window.renderer.domElement);

  cubeInit();
  sphereInit();
  planeInit();

  mainLoop();
  guiInit();

}

window.onload = main;

function mainLoop() {
  window.renderer.render(window.scene, window.camera);
  requestAnimationFrame(mainLoop);
}

function sceneInit() {
  window.scene = new THREE.Scene();
  window.scene.add(new THREE.AxesHelper(20));
}

function windowInit() {
  window.renderer = new THREE.WebGLRenderer({antialias: true});
  window.renderer.setSize(window.innerWidth, window.innerHeight);
  window.renderer.setClearColor(0x000000);
}

function cameraInit() {
  window.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  window.camera.position.set(30, 40, 50);
  window.camera.lookAt(0, 0, 0);
}

function cubeInit() {
  let cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
  let cubeMaterial = new THREE.MeshBasicMaterial({color: 0xff000, wireframe: true});
  cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

  cube.position.set(-6, 3, 5);
  window.scene.add(cube);
}

function sphereInit() {
  let sphereGeometry = new THREE.SphereGeometry(5, 10, 10);
  let sphereMaterial = new THREE.MeshBasicMaterial({color: 0x00FFFF, wireframe: true});
  sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  sphere.position.set(10, 5, -5);
  window.scene.add(sphere);
}

function planeInit() {
  let planeGeometry = new THREE.PlaneGeometry(40, 40);
  let planeMaterial = new THREE.MeshBasicMaterial({color: 0x888888, side: THREE.DoubleSide, wireframe: true});
  plane = new THREE.Mesh(planeGeometry, planeMaterial);

  plane.rotation.x = Math.PI / 2;
  window.scene.add(plane);
}

function guiInit() {
  let gui = new DATGUI.GUI();
  gui.add(sphere.position, 'x', -50, 50);
  gui.add(cube.position, 'x', -50, 50);
  gui.add(plane.position, 0, -50, 'z');


}