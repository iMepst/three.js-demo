import * as THREE from 'three';

window.raycaster = new THREE.Raycaster();

export function executeRaycast() {
    window.raycaster.setFromCamera(window.mousePosition, window.camera);
    let intersects = window.raycaster.intersectObjects(window.scene, true);

    console.log(intersects.length);
}