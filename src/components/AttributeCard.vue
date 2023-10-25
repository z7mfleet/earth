<template>
  <div class="container" :class="{ hide: hideComponent }">
    <button @click="dataStore.focusObject = null">
      <svg t="1671616904623" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="1549" width="16" height="16">
        <path d="M155.989333 186.154667l30.165334-30.165334 681.813333 681.813334-30.165333 30.208z" p-id="1550"
          fill="#ffffff"></path>
        <path d="M155.989333 837.845333l681.813334-681.813333 30.208 30.122667-681.813334 681.813333z" p-id="1551"
          fill="#ffffff"></path>
      </svg>
    </button>
    <card-header class="t-header">目标属性</card-header>
    <div><span>ID:</span>{{ object?.id }}</div>
    <div><span>类型:</span>{{ object?.type }}</div>
    <div><span>经度:</span>{{ object?.longitude.toFixed(6) }}</div>
    <div><span>纬度:</span>{{ object?.latitude.toFixed(6) }}</div>
    <div><span>高程:</span>{{ object?.altitude }}</div>
    <div><span>航速:</span>{{ object?.speed }}</div>
    <div><span>航向:</span>{{ object?.course }}</div>
    <div :title="object?.source"><span>传感器来源:</span>{{ sensorFilter }}</div>
    <div><span>置信度:</span>{{ object?.confidence }}</div>
    <div><span>优先级:</span>{{ object?.priority }}</div>
    <div style="width: 100%;"><span>接收时间:</span>{{ object?.time }}</div>
    <!-- <section v-show="object?.imageURL || object?.videoURL">
      <img v-show="object?.imageURL" :src="object?.imageURL" alt="">
      <video v-show="object?.videoURL" controls :src="object?.videoURL"></video>
    </section> -->
    <section>
      <a-image v-show="object?.imageURL" :src="object?.imageURL" alt="" style="width:100%;" show-loader/>
      <video v-show="object?.videoURL" controls :src="object?.videoURL"></video>
    </section>
    <section class="child-center">
      <a-switch v-model:model-value="isSelected" type="round" checked-color="#4978cf"
        @change="$emit('select', object?.id, isSelected)">
        <template #checked>
          已选
        </template>
        <template #unchecked>
          未选
        </template>
      </a-switch>
    </section>
    <card-footer class="t-footer"></card-footer>
  </div>
</template>

<script setup lang="ts">
import CardHeader from './CardHeader.vue';
import CardFooter from './CardFooter.vue';
import { ref, computed, watch, defineEmits, onMounted,nextTick } from 'vue';
import { useDataStore } from '../base/DataStore';
const hideComponent = ref(false);
const dataStore = useDataStore();
const object = computed(() => {
  return dataStore.focusObject;
});
const isSelected = ref(false);
watch(object, (val) => {
  isSelected.value = dataStore.selectedSet.has(val?.id as string);
});

const emit = defineEmits(['select']);
onMounted(() => {
  let media: HTMLDivElement = document.querySelector('div.container')!;
  let header: HTMLHeadElement = document.querySelector('.t-header')!;
  header.onmousedown = (e) => {
    //鼠标按下，计算鼠标触点距离元素左侧和顶部的距离
    let disX = e.clientX - media.offsetLeft;
    let disY = e.clientY - media.offsetTop + media.offsetHeight / 2;//transform没有改变元素锚点
    document.onmousemove = function (e) {
      //计算需要移动的距离
      let tX = e.clientX - disX;
      let tY = e.clientY - disY + media.offsetHeight / 2;
      //移动当前元素
      if (tX >= 0 && tX <= window.innerWidth - media.offsetWidth) {
        media.style.left = tX + 'px';
      }
      if (tY >= media.offsetHeight / 2 && tY <= window.innerHeight - media.offsetHeight / 2) {
        media.style.top = tY + 'px';
      }
      return false;
    };
    //鼠标松开时，注销鼠标事件，停止元素拖拽。
    document.onmouseup = function (e) {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  }
});
const sensorFilter = computed(() => {
  let sensor = object.value?.source;
  if (!sensor) return undefined;
  if (dataStore.sourceMap[sensor!]) {
    return dataStore.sourceMap[sensor].label;
  }
  else {
    return sensor;
  }
})
</script>

<style scoped lang="less">
.container {
  opacity: 1;
  position: absolute;
  width: 500px;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(17, 19, 24, 0.8);
  border: solid 1px #2d80c2;
  color: #4978cf;
  color: #ffffff;
  transition: opacity .3s;
  display: flex;
  flex-wrap: wrap;
  //   pointer-events: none;

  >button:nth-of-type(1) {
    position: absolute;
    top: 15px;
    right: 10px;
    background: transparent;
    border: none;
    cursor: pointer;
  }

  .t-header {
    cursor: move;
    border-bottom: 1px solid #759ebc;
  }

  .t-footer {
    width: 100%;
    height: 20px;
    margin: 0 4px;
  }

  span {
    display: inline-block;
    margin-left: .5em;
    width: 6em;
    color: #cae2fe;
  }

  >div {
    // margin: 0;
    height: 3em;
    width: 50%;
    line-height: 3em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  >div {
    border-bottom: dashed 1px #435877;
  }

  >section:nth-of-type(1) {
    width: 100%;
    border-bottom: dashed 1px #435877;

    img {
      display: block;
      width: 100%;
      max-height: 400px;
      object-fit: contain;
    }

    :deep(.arco-image-img){
      width: 100%;
      max-height: 400px;
      object-fit: contain;
    }

    video {
      display: block;
      width: 100%;
    }
  }

  >section:nth-of-type(2) {
    width: 100%;
    padding: 10px 0;
  }
}

.hide {
  opacity: 0;
}
</style>