import { Group, Object3D, Vector3 } from 'three'
import { getCamera } from './Player'
import { getModelInstance } from './Models'

var pet = new Object3D()
var intermediateVector = new Vector3()

export var petGroup = new Group()

/**
 * Function to create a pet in the scene.
 * @function
 * @name createPet
 * @param {string} petID - The ID of the pet model.
 * @param {Object} data - Data containing position information.
 * @param {number} team - The team the pet belongs to (red or blue).
 */
export function createPet(petID, data, team) {
  if (!petID) return
  pet = getModelInstance(petID)
  pet.position.x = data.x
  pet.position.z = data.z + (team == 0 ? -1 : 1)
  petGroup.add(pet)
}

/**
 * Function to delete a pet.
 * @function
 * @name deletePet
 */
export function deletePet() {
  if (!pet) return
  petGroup.remove(pet)
  pet = null
}

/**
 * Function to update the pet's position and orientation based on the camera.
 * @function
 * @name update
 * @param {boolean} isAlive - Flag indicating if the pet/Player is alive.
 */
export function update(isAlive) {
  if (!pet || !isAlive) return

  let camera = getCamera(true)
  intermediateVector.copy(camera.position)
  intermediateVector.y = 0
  let distance = pet.position.distanceTo(intermediateVector)
  pet.lookAt(intermediateVector)
  if (distance > 3) {
    pet.position.lerp(intermediateVector, 0.08)
  }
}
