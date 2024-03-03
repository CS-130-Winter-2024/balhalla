import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Group } from "three";
import { MODEL_IDS } from "../constants";


var models = {
}
var loaded = 0;
var totalModels = 0;

const ModelLoader = new GLTFLoader();

export function loadDefault() {
    updateModelList({"0":true})
}

export function getProgress() {
    if (totalModels == 0) {
        return 1
    }
    return loaded/totalModels;
}

export function updateModelList(modelList) {
    for (const model in Object.keys(modelList)) {
        if (!(model in models)) {
            totalModels++;
            models[model] = new Group();
            ModelLoader.load(
                MODEL_IDS[model],
                (gltf) => {
                    models[model].add(gltf.scene);
                    loaded++;
                }
            )
        }
    }
}

export function getModelInstance(modelID) {
    if (modelID in models) {
        return models[modelID]
    }
}