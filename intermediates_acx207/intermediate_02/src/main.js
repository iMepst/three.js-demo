import * as THREE from 'three';
import * as DATGUI from 'datgui';
import * as CONTROLS from 'controls';
import Television from './objects/Television.js';

let plane;
let pointLight;
let ambientLight;
let tv = new Television();

function main() {
    //Initializing the camera, scene and window
    sceneInit();
    cameraInit();
    windowInit();

    //Using the Orbit Controls
    let orbitControls = new CONTROLS.OrbitControls(window.camera, window.renderer.domElement);
    orbitControls.target = new THREE.Vector3(0,0,0); //replaces window.camera.lookAt(0, 0, 0)

    //Integration of the renderer output into the HTML structure
    document.getElementById('3d_content').appendChild(window.renderer.domElement);

    //Resizes the view if the aspect ratio of the window changes
    window.addEventListener( 'resize', onWindowResize, false );

    //Initializing the geometric objects
    planeInit();
    window.scene.add(tv);

    mainLoop();

    //Initializing the light and the GUI
    pointLightInit();
    guiInit();

    orbitControls.update(); //Activate/acquire the target
}

window.onload = main; //fired when the entire page loads, including its content

function mainLoop() {
    window.renderer.render(window.scene, window.camera); //Rendering the scene
    requestAnimationFrame(mainLoop); //Request for the next possible execution of the mainLoop()
}

//Scene, window, camera and GUI functions
function sceneInit() {
    window.scene = new THREE.Scene(); //Scene graph Object
    window.scene.add(new THREE.AxesHelper(20)); //Length of the Coordinate axes
}
function windowInit() {
    window.renderer = new THREE.WebGLRenderer({antialias: true}); //Renderer-Object
    window.renderer.setSize(window.innerWidth, window.innerHeight); //Size of the Framebuffer
    window.renderer.setClearColor(0x000000); //Background color of the frame buffer
    window.renderer.shadowMap.enabled = true;
}
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}
function cameraInit() {
    //Camera-Object
    window.camera = new THREE.PerspectiveCamera(
        45, //Opening angle 𝛼 of the camera
        window.innerWidth / window.innerHeight, //Aspect Ratio
        0.1, //Distance of the near-plane
        1000); //Distance of the far-plane

    window.camera.position.set(30, 40, 50);

}
function guiInit() {
    let gui = new DATGUI.GUI();

    const lightFolder = gui.addFolder('Point Light');
    lightFolder.add(pointLight.position, 'x', -50, 50);
    lightFolder.add(pointLight.position, 'y', -50, 50);
    lightFolder.add(pointLight.position, 'z', -50, 50);

    lightFolder.open();
}

//Object functions
function planeInit() {
    let planeGeometry = new THREE.PlaneGeometry(40, 40);
    let planeMaterial = new THREE.MeshLambertMaterial({color: 0x888888, side: THREE.DoubleSide, wireframe: false});
    plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.receiveShadow = true;
    plane.rotation.x = Math.PI / 2;
    window.scene.add(plane);
}

//Light functions
function ambientLightInit() {
    ambientLight = new THREE.AmbientLight(0xFFFFFF);
    ambientLight.intensity = 0.5;
    window.scene.add(ambientLight);
}
function pointLightInit() {
    pointLight = new THREE.PointLight(0xFFFFFF); //Color value
    pointLight.position.set(15, 20, 20); //Position
    pointLight.intensity = 2; //Intensity (Default: 1)

    pointLight.castShadow = true; //Shadow activated
    pointLight.shadow.mapSize.set(1024*2, 1024*2);

    /*pointLight.shadow.camera.aspect = 1;
    pointLight.shadow.camera.near = 10;
    pointLight.shadow.camera.far = 40;*/

    window.scene.add(new THREE.CameraHelper(pointLight.shadow.camera)); //Shadow camera
    window.scene.add(pointLight); //Add to scene
}