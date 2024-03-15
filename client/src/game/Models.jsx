import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Group } from 'three'
import { MODEL_IDS } from '../constants'
import { set_global } from '../constants'

var models = {}
var loaded = 0
var totalModels = 0

const ModelLoader = new GLTFLoader()
/**
 * Function to load default models for the game.
 * @function
 * @name loadDefault
 */
export function loadDefault() {
  updateModelList({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
  })
}

/**
 * Function to calculate the loading progress of models.
 * @function
 * @name getProgress
 * @returns {number} The progress of loaded models as a fraction.
 */
export function getProgress() {
  if (totalModels == 0) {
    return 1
  }
  return loaded / totalModels
}

/**
 * Function to apply transformations to a 3D model scene based on the model ID.
 * @function
 * @name applyTransformations
 * @param {string} modelID - The ID of the model.
 * @param {Scene} scene - The 3D scene to apply transformations to.
 */
export function applyTransformations(modelID, scene) {
  switch (modelID) {
    case '0':
      scene.scale.set(2, 2, 2)
      scene.position.set(0, 0, 0)
      scene.rotateY(Math.PI)
      break
    case '5':
      scene.scale.set(20, 20, 20)
      scene.position.y = 0
      scene.rotateY(Math.PI)
      break
    case '6':
      scene.scale.set(8, 8, 8)
      scene.position.y = 0
      scene.rotateY(Math.PI)
      break
    case '7':
      scene.scale.set(8, 8, -8)
      scene.position.y = 0
      scene.rotateY(Math.PI)
      break
    case '8':
      scene.scale.set(8, 8, 8)
      scene.position.y = 0
      scene.rotation.y = Math.PI * 0.5
      break
    case '9':
      scene.scale.set(1.25, 1, 1.25)
      scene.rotateY(Math.PI)
      break
  }
}

/**
 * Function to update the model list with new models.
 * @function
 * @name updateModelList
 * @param {Object} modelList - List of models to update.
 */
export function updateModelList(modelList) {
  for (const model in Object.keys(modelList)) {
    if (!(model in models)) {
      totalModels++
      models[model] = new Group()
      ModelLoader.load(MODEL_IDS[model], gltf => {
        applyTransformations(model, gltf.scene)
        models[model].add(gltf.scene)
        loaded++
        if (loaded == totalModels) {
          set_global('LOADED', true)
        }
      })
    }
  }
}

/**
 * Function to get an instance of a 3D model by its ID.
 * @function
 * @name getModelInstance
 * @param {string} modelID - The ID of the model.
 * @returns {Group} An instance of the specified 3D model.
 */
export function getModelInstance(modelID) {
  if (modelID in models) {
    return models[modelID].clone()
  }
}
