import * as THREE from 'three';

window.raycaster = new THREE.Raycaster();
export function executeRaycast() {

    window.raycaster.setFromCamera(window.mousePosition, window.camera);
    let intersects = window.raycaster.intersectObject(window.scene, true);

    if (intersects.length > 0) {
        let firstHit = intersects[0].object;
        let name = firstHit.name;
        console.log(name);

        if(name === 'powerKnob' || name === 'volumeKnob') {
            if(firstHit.children.length > 0){
                firstHit.linearAnimation.toggleEndPosition();
            } else {
                firstHit.parent.linearAnimation.toggleEndPosition();
            }
        }
    }
}