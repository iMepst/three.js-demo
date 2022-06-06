import * as THREE from 'three';
import * as DATGUI from 'datgui';
import * as CONTROLS from 'controls';
import * as TWEEN from 'tween';
import Stats from 'stats';


//Own modules
import Television from './objects/Television.js';
import TelevisionFromFile from './objects/TelevisionFromFile.js';
import TableFromFile from "./objects/TableFromFile.js";
import Plant from './objects/PlantFromFile.js';
import Floor from "./objects/Floor.js";
import Physics from './physics/Physics.js';

//Event functions
import {calculateMousePosition} from "./eventfunctions/calculateMousePosition.js";
import {executeRaycast} from "./eventfunctions/executeRaycast.js";
import {keyDownAction, keyUpAction} from "./eventfunctions/executeKeyAction.js";

//Variable
let floor;
let plane;
let pointLight;
let ambientLight;
let spotLight;
let tv = new Television();
const tvff = new TelevisionFromFile();
const tableff = new TableFromFile();
const plant = new Plant();
const clock = new THREE.Clock();
const stats = new Stats();

function main() {
    //Initializing the camera, scene and window
    sceneInit();
    cameraInit();
    windowInit();

    //Using the Orbit Controls
    let orbitControls = new CONTROLS.OrbitControls(window.camera, window.renderer.domElement);
    orbitControls.target = new THREE.Vector3(0,0,0); //replaces window.camera.lookAt(0, 0, 0)

    //Intializing the physics
    physicInit();

    //Initalizing audio listener
    audioInit();

    //Integration of the renderer output into the HTML structure
    document.getElementById('3d_content').appendChild(window.renderer.domElement);

    //Resizes the view if the aspect ratio of the window changes
    window.addEventListener( 'resize', onWindowResize, false );

    //Initializing the geometric objects
    floorInit();
    tvInit();
    tvFromFileInit();
    tableFromFileInit();
    plantInit();

    document.body.appendChild(stats.dom);
    mainLoop();

    //Initializing the light and the GUI
    spotLightInit();
    guiInit();

    orbitControls.update(); //Activate/acquire the target
}


function mainLoop() {
    stats.begin();
    const delta = clock.getDelta(); //Time since last frame
    knobTurnAuto(delta);
    TWEEN.update(); //Update tweens
    if (tvff.animationMixer !== null) {
        tvff.animationMixer.update(delta);
    }
    window.physics.update(delta); //Update the physics
    window.renderer.render(window.scene, window.camera); //Rendering the scene
    stats.end();
    requestAnimationFrame(mainLoop); //Request for the next possible execution of the mainLoop()
}

window.onload = main; //fired when the entire page loads, including its content
window.onmousemove = calculateMousePosition; //Mouse position
window.onclick = executeRaycast; //Light functions
window.onkeydown = keyDownAction; //Keyboard events
window.onkeyup = keyUpAction;


//Scene, window, camera, GUI and physics functions
function sceneInit() {
    window.scene = new THREE.Scene(); //Scene graph Object
    window.scene.add(new THREE.AxesHelper(50)); //Length of the Coordinate axes
}
function windowInit() {
    window.renderer = new THREE.WebGLRenderer({antialias: true}); //Renderer-Object
    window.renderer.setSize(window.innerWidth, window.innerHeight); //Size of the Framebuffer
    window.renderer.setClearColor(0xFFFFFF); //Background color of the frame buffer
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

    window.camera.position.set(-100, 300, 300);

}
function guiInit() {
    let gui = new DATGUI.GUI();

    const lightFolder = gui.addFolder('Spot Light');
    lightFolder.add(spotLight.position, 'x', -300, 300);
    lightFolder.add(spotLight.position, 'y', -300, 300);
    lightFolder.add(spotLight.position, 'z', -300, 300);

    lightFolder.open();
}
function physicInit() {
    window.physics = new Physics(true);
    window.physics.setup(0, -200, 0, 1/960, true);
}
function audioInit() {
    window.audioListener = new THREE.AudioListener();
    window.camera.add (window.audioListener);
}

//Object functions
function planeInit() {
    let planeGeometry = new THREE.PlaneGeometry(200, 200);
    let planeMaterial = new THREE.MeshLambertMaterial({color: 0x888888, side: THREE.DoubleSide, wireframe: false});
    plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.receiveShadow = true;
    plane.rotation.x = Math.PI / 2;
    window.scene.add(plane);
}
function floorInit() {
    floor = new Floor();
    floor.position.set(0, 0, 0);
    window.scene.add(floor);
}
function tvInit() {
    tv.position.set(-30, 55.8, 0);
    tv.rotation.set(0, THREE.MathUtils.degToRad(10), 0);
    tv.addPhysics();
    window.scene.add(tv);
}
function tvFromFileInit() {
    tvff.position.set(30, 55.8, 0);
    tvff.rotation.set(0, THREE.MathUtils.degToRad(-10), 0);
    tvff.addPhysics();
    window.scene.add(tvff);
}
function tableFromFileInit() {
    tableff.position.set(0, 0, 0);
    tableff.addPhysics();
    window.scene.add(tableff);
}
function plantInit() {
    plant.position.set(-60, 75, -60);
    plant.addPhysics();
    plant.addSound();
    window.scene.add(plant);
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
function spotLightInit() {
    spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(100, 200, 200);
    spotLight.intensity = 1.5;
    spotLight.target = floor;
    spotLight.angle = THREE.MathUtils.degToRad(30);
    spotLight.penumbra = 1;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.set(2048, 2048);
    spotLight.shadow.camera.aspect = 1;
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 500;
    window.scene.add(new THREE.CameraHelper(spotLight.shadow.camera));
    window.scene.add(spotLight);

}

//Animation
function knobTurnManual() {
    let powerKnob = tv.children[3].children[0];
    window.televisionPowerOn = false;
    const delta = clock.getDelta();

    if (window.televisionPowerOn) {
        if (powerKnob.rotation.y > THREE.MathUtils.degToRad(-90)){
            powerKnob.rotation.y -= THREE.MathUtils.degToRad(360) * delta;
        } else {
            powerKnob.rotation.y = THREE.MathUtils.degToRad(-90);
        }
    } else {
        if (powerKnob.rotation.y < 0) {
            powerKnob.rotation.y += THREE.MathUtils.degToRad(360) * delta;
        } else {
            powerKnob.rotation.y = 0;
        }
    }
}
function knobTurnAuto(delta){
    tv.animations.forEach(function (animation){animation.update(delta)});

}