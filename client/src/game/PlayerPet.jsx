import { Group, Object3D, Vector3 } from "three";
import { getCamera } from "./Player";
import { getModelInstance } from "./Models";


var pet = new Object3D();
var intermediateVector = new Vector3();

export var petGroup = new Group();

export function createPet(petID, data, team) {
    if (!petID) return;
    pet = getModelInstance(petID)
    pet.position.x = data.x;
    pet.position.z = data.z + (team == 0 ? -1 : 1);
    petGroup.add(pet);
}

export function deletePet() {
    if (!pet) return;
    petGroup.remove(pet);
    pet = null;
}

export function update(isAlive) {
    if (!pet || !isAlive) return;

    let camera = getCamera(true);
    intermediateVector.copy(camera.position);
    intermediateVector.y = 0;
    let distance = pet.position.distanceTo(intermediateVector);
    pet.lookAt(intermediateVector);
    if (distance > 3) {
        pet.position.lerp(intermediateVector,0.08);
    }
}