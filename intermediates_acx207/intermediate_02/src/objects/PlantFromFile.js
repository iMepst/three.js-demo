import * as THREE from 'three';
import {GLTFLoader} from 'gltfloader';

export default class PlantFromFile extends THREE.Group {
    constructor() {
        super();

        this.gltfloader = new GLTFLoader();
        this.loadingDone = false;
        this.load(this);
    }

    load(thisPlant) {
        this.gltfloader.load('src/models/plant.gltf', function (gltf) {

            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                }
            });
            gltf.scene.position.set(0, -75, 0);
            thisPlant.add(gltf.scene);
            thisPlant.loadingDone = true;
        });
    }

    addPhysics() {
        if (this.loadingDone === false) {
            window.setTimeout(this.addPhysics.bind(this), 100);
        } else {
            window.physics.addCylinder(this, 5, 20, 10, 150, 12, 0, 0);
        }
    }
}