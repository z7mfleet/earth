<template>
    <div class="message" :class="{ hide: hideComponent }">
        <div id="switch" @click="hideComponent = !hideComponent">
            <svg v-show="hideComponent" t="1678936564295" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="2110" width="16" height="16">
                <path
                    d="M689.024 165.12l-380.8 328.32a24.96 24.96 0 0 0 0 37.12l380.8 328.32c14.208 12.16 34.944 1.28 34.944-18.496V183.68c0-19.712-20.736-30.72-34.944-18.56z"
                    p-id="2111"></path>
            </svg>
            <svg v-show="!hideComponent" t="1678935940183" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="1848" width="16" height="16">
                <path
                    d="M715.776 493.44l-380.8-328.32c-14.144-12.16-34.944-1.28-34.944 18.496V840.32c0 19.712 20.8 30.72 34.944 18.56l380.8-328.448a24.96 24.96 0 0 0 0-36.992z"
                    p-id="1849"></path>
            </svg>
        </div>
        <div class="settings child-center" @click="$emit('settingsClick')">
            <svg t="1679539354996" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="3043" width="32" height="32">
                <path
                    d="M645.5296 932.62336h-0.01024c-16.19968 0-31.9488-6.70208-42.12224-17.92512-13.86496-15.20128-57.7792-54.72256-93.73184-54.72256-35.70176 0-80.29696 39.75168-93.1072 53.67296-10.14784 11.02848-25.78944 17.61792-41.84064 17.61792-7.63904 0-14.85824-1.46944-21.44256-4.36224l-1.14688-0.50688-109.27616-61.1072-1.08032-0.75776c-19.89632-13.93152-27.45856-41.1648-17.60768-63.35488 0.0768-0.17408 10.07616-23.24992 10.07616-44.29824 0-63.86688-51.95264-115.82464-115.83488-115.82464h-3.8656l-0.71168 0.01024c-18.28864 0-33.18784-16.256-37.94944-41.41568-0.37376-1.99168-9.3184-49.69984-9.3184-87.29088 0-37.59104 8.94464-85.2992 9.3184-87.31648 4.81792-25.472 20.03968-41.83552 38.66112-41.38496h3.8656c63.87712 0 115.83488-51.968 115.83488-115.84 0-21.03296-9.98912-44.11904-10.09664-44.3392-9.84576-22.17984-2.2272-49.40288 17.74592-63.28832l1.13152-0.78336 115.32288-63.34976 1.19808-0.50688c6.49216-2.76992 13.60896-4.1728 21.14048-4.1728 16.01536 0 31.67744 6.44096 41.92256 17.23904 13.64992 14.28992 56.79616 51.456 91.7248 51.456 34.57536 0 77.45536-36.43392 91.06944-50.47296 10.17856-10.5728 25.74848-16.90624 41.6-16.90624 7.69024 0 14.93504 1.45408 21.5296 4.3264l1.16736 0.50688 111.3856 61.88544 1.1008 0.76288c19.92704 13.91104 27.50464 41.14432 17.65888 63.35488-0.08704 0.16384-10.08128 23.25504-10.08128 44.29312 0 63.872 51.95264 115.84 115.82464 115.84h3.87584c18.59072-0.42496 33.82784 15.90784 38.65088 41.38496 0.37888 2.01216 9.32864 49.72032 9.32864 87.31136 0 37.5808-8.94976 85.2992-9.32864 87.30112-4.81792 25.48224-20.06016 41.7792-38.65088 41.40544h-3.87584c-63.872 0-115.82464 51.95776-115.82464 115.82464 0 21.0432 9.99424 44.11392 10.09664 44.34944 9.8304 22.14912 2.24256 49.38752-17.70496 63.28832l-1.12128 0.77312-113.25952 62.60224-1.1776 0.50688c-6.48192 2.80064-13.57312 4.21376-21.06368 4.21376z m-3.44064-53.36576c0.51712 0.33792 1.94048 0.90112 3.44064 0.90112l0.16896-0.00512 105.8304-58.48576c-2.55488-5.9392-14.24384-34.72896-14.24384-64.768 0-89.84064 70.76352-163.47136 159.47776-168.06912 1.26976-7.05024 8.20224-46.70976 8.20224-76.47232 0-29.75744-6.93248-69.4016-8.20224-76.47232-88.71424-4.60288-159.47776-78.22848-159.47776-168.06912 0-30.08 11.71456-58.91072 14.25408-64.79872l-104.10496-57.84064c-0.11264-0.00512-0.27136-0.01536-0.4352-0.01536-1.77152 0-3.4304 0.64-3.97312 1.01376-1.75616 1.79712-16.8448 17.09568-38.51264 32.34816-32.09216 22.5792-62.42816 34.0224-90.17856 34.0224-28.032 0-58.624-11.6736-90.91072-34.69824-21.79584-15.54432-36.97152-31.13472-38.71232-32.96256-0.55808-0.37888-2.23232-1.03936-4.02432-1.03936l-0.37888 0.01024-107.8272 59.22304c2.58048 6.01088 14.22848 34.74944 14.22848 64.73728 0 89.84064-70.75328 163.46624-159.47264 168.07424-1.28 7.05536-8.21248 46.70976-8.21248 76.47232 0 29.75232 6.93248 69.39136 8.21248 76.47232 88.71936 4.59776 159.47264 78.21824 159.47264 168.05888 0 30.14656-11.76064 59.0336-14.26944 64.8448l102.05696 57.06752a7.1168 7.1168 0 0 0 3.63008-0.8704c1.90976-2.048 17.15712-18.18112 39.1168-34.26816 32.72192-23.9872 63.8208-36.1472 92.42624-36.1472 28.88192 0 60.22144 12.3904 93.1328 36.82816 22.08256 16.39936 37.39648 32.83968 39.28576 34.90816z"
                    p-id="3044"></path>
                <path
                    d="M510.03904 666.03008c-85.05344 0-154.25024-69.20192-154.25024-154.25536 0-85.05344 69.1968-154.25024 154.25024-154.25024 85.0688 0 154.26048 69.1968 154.26048 154.25024s-69.19168 154.25536-154.26048 154.25536z m0-256.04608c-56.12032 0-101.7856 45.66528-101.7856 101.7856 0 56.12544 45.66016 101.7856 101.7856 101.7856 56.13568 0 101.80096-45.66016 101.80096-101.7856 0-56.12032-45.66528-101.7856-101.80096-101.7856z"
                    p-id="3045"></path>
            </svg>
        </div>
        <card-header>侦测目标</card-header>
        <section>
            <a-tree ref="objectList" :checkable="true" :data="dataStore.objectTree" :fieldNames="fieldName"
                :show-line="true" @select="selectObject" @check="checkObject" />
            <a-tree ref="mixObjList" :checkable="true" :data="dataStore.mixObjTree" :fieldNames="fieldName"
                :show-line="true" @select="selectObject" @check="checkObject" />
            <a-tree ref="layerList" :checkable="true" :data="dataStore.layerTree" :fieldNames="{ key: 'id', title: 'id' }"
                :show-line="true" @select="selectLayer" @check="checkLayer">
                <template #extra="nodeData">
                    <div class="diff-button" v-show="nodeData.children === undefined"
                        @click="() => $emit('layerClick', nodeData.id)">
                        <svg t="1679998753688" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="4730" width="32" height="32">
                            <path
                                d="M426.666667 768h341.333333v-341.333333h-42.666667v298.666666h-298.666666v42.666667z m0 85.333333H341.333333v-128H213.333333V213.333333h512v128h128v512H426.666667z m213.333333-426.666666h-213.333333v213.333333h213.333333v-213.333333z m0-85.333334V298.666667H298.666667v341.333333h42.666666V341.333333h298.666667z"
                                fill="#ffffff" p-id="4731"></path>
                        </svg>
                    </div>
                </template>
            </a-tree>
        </section>
        <footer>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineEmits, computed, watch, onMounted, nextTick } from 'vue';
import CardHeader from './CardHeader.vue'
import { useDataStore } from '../base/DataStore';
import type { ObjectAttribute } from '../vite-env';
const dataStore = useDataStore();
const attrMap = dataStore.attrMap;
const layerMap = dataStore.layerMap;
const hideComponent = ref(false);
const emit = defineEmits(['itemClick', 'settingsClick', 'layerClick']);
const objectList: any = ref(null);
const mixObjList: any = ref(null);
const layerList: any = ref(null);

const fieldName = {
    key: 'id',
    title: 'label',
}

let stopSelect = false;//阻止selectNode()对selectObject()的触发
watch(() => dataStore.focusObject, (val, oldVal) => {
    if (val?.id) {
        stopSelect = true;
        objectList.value.selectNode(val.id, true);
        // mixObjList.value.selectNode(val.id, true);
    }
    else if (oldVal?.id) {
        stopSelect = true;
        objectList.value.selectNode(oldVal.id, false);
        // mixObjList.value.selectNode(oldVal.id, false);
    }
});

const selectObject = (key: string[]) => {
    if (stopSelect) {
        stopSelect = false;
        return;
    }

    if (attrMap.has(key[0])) {
        //隐藏目标转为显示状态
        let entity = dataStore.objectPool[key[0]];
        entity.show = true;
        if (attrMap.get(key[0])?.isMix) {
            mixObjList.value.checkNode(key[0], true);
        }
        else {
            objectList.value.checkNode(key[0], true);
        }

        emit('itemClick', key[0], 'object');
    }
}
const checkObject = (k: any, data: any) => {
    const { checked, node } = data;
    if (checked === undefined) return;
    // console.log(checked, node);
    if (attrMap.has(node.id)) {
        let entity = dataStore.objectPool[node.id];
        entity.show = checked;
    }
    else {
        node.children.forEach((item: any) => {
            if (Array.isArray(item.children)) {
                let os = item.children;
                os.forEach((obj: any) => {
                    let entity = dataStore.objectPool[obj.id];
                    entity.show = checked;
                });
            }
            else {
                let entity = dataStore.objectPool[item.id];
                entity.show = checked;
            }
        });
    }
}
const selectLayer = (key: string[]) => {
    if (layerMap.has(key[0])) {
        emit('itemClick', key[0], 'layer');
    }
}
const checkLayer = (k: any, data: any) => {
    const { checked, node } = data;
    if (checked === undefined) return;
    if (layerMap.has(node.id)) {
        let layer = layerMap.get(node.id)!;
        layer.alpha = checked ? 1 : 0;
    }
    else {
        node.children.forEach((li: any) => {
            let layer = layerMap.get(li.id)!;
            layer.alpha = checked ? 1 : 0;
        });
    }
}


onMounted(() => {

});

defineExpose({ objectList, mixObjList, layerList });
</script>

<style lang="less" scoped>
.message {
    position: absolute;
    width: 400px;
    height: 100%;
    top: 0;
    right: 0;
    background-color: #2f3542;
    display: flex;
    flex-direction: column;
    transition: .5s;
    box-sizing: border-box;
    border-left: solid 1px #2d80c2;

    #switch {
        position: absolute;
        height: 40px;
        width: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        border: solid 1px #2d80c2;
        border-right: none;
        background-color: rgba(17, 19, 24, 0.8);
        left: 0;
        top: 50%;
        transform: translate(-100%);
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        cursor: pointer;

        svg {
            fill: #2d80c2;
        }
    }

    section {
        width: 100%;
        height: 90%;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 0 10px;
        background: center/80% no-repeat url('../assets/map.png'),
            center no-repeat url('../assets/bg.jpg');

        :deep(.arco-tree-node) {
            color: #fff;
            font-weight: bold;
        }

        :deep(.arco-tree-node-title:hover) {
            color: #fff;
            box-shadow: inset 0 0 10px 5px #3071fd;
            background-color: transparent;
        }

        :deep(.arco-tree-node-selected .arco-tree-node-title) {
            color: #eccc68;
            box-shadow: inset 0 0 10px 5px #eccc68;
        }

        :deep(.arco-tree-node-title-text) {
            width: 260px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }

    >footer {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        // border: solid 2px red;
        background: linear-gradient(0deg, #1d59a2, #002896 50%, #1d59a2);
        box-shadow: 0px -1px 3px 0 #05a3ff;
    }

    .toggle {
        position: relative;
        height: 10px;
        width: 40px;
        box-sizing: border-box;
        background-color: #f1f2f6;
        border-radius: 5px;

        >div {
            position: absolute;
            top: -5px;
            left: -5px;
            width: 20px;
            height: 20px;
            box-sizing: border-box;
            background-color: #f1f2f6;
            border: solid 2px #002896;
            border-radius: 50%;
            transition: .6s;
        }
    }

    .toggle:hover,
    .toggle>div:hover {
        cursor: pointer;
    }


}

.settings {
    height: 50px;
    width: 50px;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    cursor: pointer;

    svg {
        fill: #3887ff;
        transition: 1s;
    }
}

.settings:hover svg {
    transform: rotate(360deg);
}

.diff-button {
    position: absolute;
    height: 32px;
    width: 32px;
    right: 8px;
    font-size: 12px;
    top: 0;
}

.hide {
    right: -400px;
}

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    background-color: #F5F5F5;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
    -webkit-box-shadow: 0 0 4px rgba(255, 253, 253, 0.7);
    border-radius: 10px;
    background-color: #F5F5F5;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
    // border-radius: 10px;  
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #2d80c2;
}
</style>