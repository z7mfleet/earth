import { defineStore } from 'pinia';
import { ref, reactive, Ref, shallowReactive } from 'vue';
import { EntityMap, ObjectAttribute, ObjectTree, SensorMap, ImageAttribute } from '../vite-env';
import type Cesium from 'cesium';

export const useDataStore = defineStore('data', () => {
    const objectPool: EntityMap = shallowReactive({});
    const focusObject: Ref<ObjectAttribute | null> = ref(null);
    const attrMap = shallowReactive(new Map<string, ObjectAttribute>());
    const objectTree: ObjectTree = reactive([]);
    const mixObjTree: { id: string, label: string, children: Array<any>, selectable: boolean }[] = reactive([]);
    const imageMap = shallowReactive(new Map<string, ImageAttribute>());
    const layerMap = shallowReactive(new Map<string, Cesium.ImageryLayer>());
    const layerTree: { id: string, children: Array<any>, selectable: boolean }[] = reactive([]);
    const selectedSet = shallowReactive(new Set<string>());
    let sourceMap: SensorMap = shallowReactive({});
    return {
        objectPool, focusObject, attrMap, objectTree, mixObjTree, imageMap, layerMap, layerTree, sourceMap, selectedSet
    }
})