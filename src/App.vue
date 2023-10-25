<template>
  <div class="fill-container">
    <div class="system-title child-center">目标航迹展示软件</div>
    <div id="map-container" class="fill-container"></div>
    <side-bar ref="sideBar" @item-click="handleClick" @layer-click="triggerDiff"
      @settingsClick="ModalSettingsVis = true"></side-bar>
    <attribute-card v-show="dataStore.focusObject"
      @select="(id, status) => status ? selectObject(id) : unselectObject(id)"></attribute-card>

    <a-modal class="modal-common" v-model:visible="ModalSettingsVis" @ok="" @cancel="ModalSettingsVis = false">
      <template #title>
        <span style="color:#fff;font-weight: bold;">配置项</span>
      </template>
      <a-space direction="vertical" :style="{ width: '100%' }">
        <!-- <a-form class="child-center" :model="{}" auto-label-width>
          <a-form-item label="排序规则">
            <a-select v-model="sortMethod" @change="sortObject" :style="{ width: '120px' }">
              <a-option label="优先级" value="priority"></a-option>
              <a-option label="时间" value="time"></a-option>
            </a-select>
          </a-form-item>
        </a-form> -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="目标高亮时更新属性">
              <a-checkbox v-model="attrRefresh">
              </a-checkbox>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item>
              <a-button type="primary" status="danger" @click="removeTarget">
                <template #icon>
                  <icon-delete />
                </template>删除所有目标
              </a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-space>
    </a-modal>
    <div class="button-draw child-center" @click="toggleDraw">
      <svg t="1679642209710" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="2784" width="24" height="24">
        <path
          d="M385.47911111 902.59911111h83.74044444v41.41511111h-83.74044444zM217.99822222 902.59911111h83.74044445v41.41511111h-83.74044445zM113.55022222 881.89155555h-41.41511111v62.12266667H134.25777778v-41.41511111h-20.70755556zM72.13511111 546.816h41.41511111v83.74044445h-41.41511111zM72.13511111 211.85422222h41.41511111v83.74044445h-41.41511111zM72.13511111 714.41066667h41.41511111v83.74044444h-41.41511111zM72.13511111 379.33511111h41.41511111V463.07555555h-41.41511111zM72.13511111 128.11377778h41.41511111v-20.70755556H134.25777778V65.99111111h-62.12266667zM553.07377778 65.99111111h83.74044444v41.41511111h-83.74044444zM720.55466667 65.99111111h83.74044444v41.41511111h-83.74044444zM385.47911111 65.99111111h83.74044444v41.41511111h-83.74044444zM217.99822222 65.99111111h83.74044445v41.41511111h-83.74044445zM888.03555555 65.99111111v41.41511111h20.70755556v20.70755556h41.41511111V65.99111111zM908.74311111 379.33511111h41.41511111V463.07555555h-41.41511111zM908.74311111 211.85422222h41.41511111v83.74044445h-41.41511111zM738.75911111 637.26933333l70.08711111-54.272c5.23377778-4.096 8.07822222-10.46755555 7.50933333-17.06666666-0.56888889-6.59911111-4.43733333-12.51555555-10.24-15.58755556L451.47022222 359.424c-6.82666667-3.64088889-15.13244445-2.95822222-21.27644444 1.70666667-6.144 4.77866667-8.87466667 12.62933333-7.05422223 20.13866666l95.91466667 391.168c1.59288889 6.48533333 6.25777778 11.60533333 12.51555556 13.76711112 6.25777778 2.16177778 13.19822222 1.024 18.432-2.95822223l70.08711111-54.272 151.552 195.69777778c3.86844445 5.00622222 9.67111111 7.62311111 15.47377778 7.62311111 4.20977778 0 8.41955555-1.36533333 11.94666666-4.096l87.60888889-67.81155556c4.096-3.18577778 6.82666667-7.85066667 7.39555556-12.97066666 0.68266667-5.12-0.79644445-10.35377778-3.98222223-14.44977778l-151.32444444-195.69777778z"
          p-id="2785"></path>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, toRaw, nextTick, onBeforeMount } from 'vue';
import * as Cesium from 'cesium';
import { IconDelete } from '@arco-design/web-vue/es/icon';
import EarthMap from './base/EarthMap';
import SideBar from './components/SideBar.vue';
import AttributeCard from './components/AttributeCard.vue';
import { getWsUrl, Pipeline } from './base/DataBus';
import axios from 'axios';
import type { ObjectAttribute, EntityMap, ObjectTreeClass, LayerOptions, SensorMap, tileProvider } from './vite-env';
import { storeToRefs } from 'pinia';
import { useDataStore } from './base/DataStore';
import { getRandomStr, getRandomNumber, getRandomColorString } from './base/utils';
let earthMap: EarthMap;
let ws: Pipeline;
const dataStore = useDataStore();
const attrMap = dataStore.attrMap;
let materialMap = new Map<string, Cesium.MaterialProperty>();
let preEntity: Cesium.Entity | undefined = undefined;
const drawing = ref(false);
const imageMap = dataStore.imageMap;
const colorMap = new Map<string, string>();
let sensorMap: SensorMap = {};
const selectedSet = dataStore.selectedSet;


const sortMethod = ref('priority');
const sortFn = new Map();
sortFn.set('priority', (a: ObjectAttribute, b: ObjectAttribute) => b.priority - a.priority);
sortFn.set('time', (a: ObjectAttribute, b: ObjectAttribute) => {
  let atime = parseFloat(a.time.replace('_', ''));
  let btime = parseFloat(b.time.replace('_', ''));
  return btime - atime;
});
const sortObject = () => {
  dataStore.objectTree.forEach(sensor => {
    sensor.children.forEach((type: any) => {
      type.children.forEach((arr: []) => arr.sort(sortFn.get(sortMethod)));
    });
  });
}
const sideBar: any = ref(null);
const ModalSettingsVis = ref(false);

const attrRefresh = ref(false);

onMounted(() => {
  earthMap = new EarthMap('map-container');
  earthMap.on('LEFT_CLICK', (entity: Cesium.Entity) => {
    dataStore.focusObject = attrMap.get(entity.id)!;
  });
  earthMap.on('MOUSE_MOVE', (entity: Cesium.Entity | undefined) => {
    if (entity) {
      if (entity !== preEntity) {
        if (preEntity) selectedSet.has(preEntity.id) ? setEntityStyle(preEntity, 'active')
          : setEntityStyle(preEntity, 'default');
        setEntityStyle(entity, 'highlight');

        if (attrRefresh.value) {
          dataStore.focusObject = attrMap.get(entity.id)!;
        }
      }
    }
    else {
      if (preEntity) selectedSet.has(preEntity.id) ? setEntityStyle(preEntity, 'active')
        : setEntityStyle(preEntity, 'default');
    }
    preEntity = entity;
  });
  earthMap.on('DRAW_EXTENT', (ext: any) => {
    console.log(ext);
  });
  // initMaterial();
  if (import.meta.env.DEV) {
    fetch('../public/config.json').then(res => res.json()).then(data => {
      sensorMap = dataStore.sourceMap = data;
    });
  }
  else if (import.meta.env.PROD) {
    fetch('/config.json').then(res => res.json()).then(data => {
      sensorMap = dataStore.sourceMap = data;
    });

    fetch('/tileConfig.json').then(res => res.json()).then(data => {
      let tiles = data.tileParam;
      let href = window.document.location.href;
      let url = /[0-9]+.[0-9]+.[0-9]+.[0-9]+:[0-9]+/.exec(href)![0];
      tiles.forEach((item: tileProvider) => {
        earthMap.addTiles(`${url}/tiles/${item.dir}`
          , item.minZoom, item.maxZoom, item.extent);
      });
    });
  }


  getWsUrl().then(res => {
    let { ip, port } = res.data;
    ws = new Pipeline(`ws://${ip}:${port}`);
    ws.on('object', (objs: any) => {
      console.log(...objs);
      objs.forEach((o: any) => {
        setObject(o);
      });
    });
    ws.on('mutilplay', (id: string, fn: string) => {
      let attr = attrMap.get(id);
      if (!attr) return;
      if (/mp4$/.test(fn)) {
        attr.videoURL = `${axios.defaults.baseURL}/public/${fn}`;
      }
      else if (/(jpg)|(png)|(bmp)$/.test(fn)) {
        attr.imageURL = `${axios.defaults.baseURL}/public/${fn}`;
      }
    });
    ws.on('layer', (data: any) => {
      let { ip, id, fileName, west, south, east, north } = data;
      let url = axios.defaults.baseURL + '/public/' + fileName;
      setLayer({ ip, id, url, west, south, east, north });
    });
    ws.on('page', (page: any) => {
      window.open(page);
    });
    ws.on('open', (img: any, txt: any) => {
      let href = window.document.location.href;
      let url = /[0-9]+.[0-9]+.[0-9]+.[0-9]+:[0-9]+/.exec(href)![0];
      window.open(`http://${url}/change.html?img=${img}&txt=${txt}`);
    });
  }).catch(err => {
    console.log(err);
    console.warn('Failed to get ws.');
  });

  if (import.meta.env.DEV) {
    let objType = ['航母', '驱逐舰', '导弹艇', '民船'];

    setTimeout(() => {

      setObject({
        ip: '127.0.0.1',
        id: 'testId',
        type: '航母',
        longitude: getRandomNumber(-180, 180, { isInt: false }),
        latitude: getRandomNumber(-90, 90, { isInt: false }),
        altitude: 10,
        speed: 100,
        course: 0,
        source: 'sourceeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        confidence: 95.4,
        time: '1998-11-11',
        priority: getRandomNumber(0, 10)
      });
      setObject({
        ip: '127.0.0.1',
        id: 'testId',
        type: '航母',
        longitude: getRandomNumber(-180, 180, { isInt: false }),
        latitude: getRandomNumber(-90, 90, { isInt: false }),
        altitude: 10000,
        speed: 100,
        course: 0,
        source: 'sourceeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        confidence: 95.4,
        time: '1998-11-11',
        priority: getRandomNumber(0, 10)
      });

      setObject({
        ip: '127.0.0.1',
        id: '1',
        type: '航母',
        longitude: getRandomNumber(-180, 180, { isInt: false }),
        latitude: getRandomNumber(-90, 90, { isInt: false }),
        altitude: 10,
        speed: 100,
        course: 0,
        source: 'source1;source2',
        confidence: 95.4,
        time: '1998-11-11',
        priority: getRandomNumber(0, 10)
      });
      setObject({
        ip: '127.0.0.1',
        id: '1',
        type: '航母',
        longitude: getRandomNumber(-180, 180, { isInt: false }),
        latitude: getRandomNumber(-90, 90, { isInt: false }),
        altitude: 10000,
        speed: 100,
        course: 0,
        source: 'source1;source2',
        confidence: 95.4,
        time: '1998-11-11',
        priority: getRandomNumber(0, 10)
      });

      // let attr = attrMap.get('testId');
      // attr!.imageURL = 'https://avatars.mds.yandex.net/i?id=028a3793937f5a8307ed9bfda0b6ee937324046f-8272739-images-thumbs&n=13';
      // console.log(attr);

      let sensorArr = Object.keys(sensorMap);
      for (let i = 0; i < 50; i++) {
        let id = getRandomStr();
        let type = objType[getRandomNumber(0, objType.length)];
        let priority = getRandomNumber(0, 10);
        let sensor = sensorArr[getRandomNumber(0, sensorArr.length)];
        // console.log(sensorMap);
        for (let j = 0; j < getRandomNumber(5, 10); j++) {
          setObject({
            ip: '127.0.0.1',
            id: id,
            type,
            longitude: getRandomNumber(110, 120, { isInt: false }),
            latitude: getRandomNumber(10, 20, { isInt: false }),
            altitude: 0,
            speed: 100,
            course: 0,
            source: sensor,
            confidence: 95.4,
            time: '1998-11-11',
            priority
          });
        }
      }

      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          let id = getRandomStr();
          let type = objType[getRandomNumber(0, objType.length)];
          let priority = getRandomNumber(0, 10);
          let sensor = sensorArr[getRandomNumber(0, sensorArr.length)];
          for (let j = 0; j < getRandomNumber(5, 10); j++) {
            setObject({
              ip: '127.0.0.1',
              id: id,
              type,
              longitude: getRandomNumber(110, 120, { isInt: false }),
              latitude: getRandomNumber(10, 20, { isInt: false }),
              altitude: 0,
              speed: 100,
              course: 0,
              source: sensor,
              confidence: 95.4,
              time: '1998-11-11',
              priority
            });
          }
        }

      }, 3000);

      setTimeout(() => {
        let id = getRandomStr();
        let priority = getRandomNumber(0, 10);
        let x = 130;
        let y = 0;
        let bear = [1, 0];
        setInterval(() => {

          let lon;
          let lat;
          let theta;
          let to;
          do {
            let deltaX = getRandomNumber(-1, 1, { isInt: false });
            let deltaY = getRandomNumber(-1, 1, { isInt: false });
            to = [deltaX, deltaY];
            theta = Math.acos((to[0] * bear[0] + to[1] * bear[1]) /
              (Math.sqrt(to[0] * to[0] + to[1] * to[1])
                * Math.sqrt(bear[0] * bear[0] + bear[1] * bear[1]))) / 3.14 * 180;
            lon = x + deltaX;
            lat = y + deltaY;
          } while (theta > 30);
          bear = to;
          x = lon;
          y = lat;
          setObject({
            ip: '127.0.0.1',
            id: id,
            type: 'test',
            longitude: lon,
            latitude: lat,
            altitude: 0,
            speed: 100,
            course: 0,
            source: 'random',
            confidence: 95.4,
            time: '1998-11-11',
            priority
          });
          // let attr = attrMap.get(id)!;
          // attr.imageURL = 'https://ukrpublic.com/images/2021/06/09/1_large.jpg';
        }, 200);
      }, 200);

      ws = new Pipeline('ws://192.168.100.238:5876');
      ws.on('object', (objs: any) => {
        objs.forEach((o: any) => {
          setObject(o);
        });
      });
      ws.on('layer', (data: LayerOptions[]) => {
        data.forEach((img) => setLayer(img));
      });


      // setLayer({
      //   id: getRandomStr(),
      //   url: 'https://avatars.mds.yandex.net/i?id=1ea6186413b51335bbb27078a49d52777a3c6eaf-5221583-images-thumbs&n=13',
      //   west: 80,
      //   south: 20,
      //   east: 90,
      //   north: 30
      // });
      // setLayer({
      //   id: getRandomStr(),
      //   url: 'https://avatars.mds.yandex.net/i?id=1ea6186413b51335bbb27078a49d52777a3c6eaf-5221583-images-thumbs&n=13',
      //   west: 20,
      //   south: 20,
      //   east: 30,
      //   north: 30
      // });

    }, 500);
  }


});


const initMaterial = (color: string) => {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createLinearGradient(0, 0, 100, 0);
  gradient.addColorStop(0, `${color}00`);
  gradient.addColorStop(1, `${color}ff`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 100, 100);
  return new Cesium.ImageMaterialProperty({
    image: canvas,
    transparent: true
  });
}

const setObject = (options: ObjectAttribute) => {
  let { ip, id, type, longitude, latitude, altitude, speed, course, source, confidence, time } = options;
  let coordinates = [longitude, latitude, altitude];

  if (import.meta.env.DEV) {
    options.source = options.source.padStart(source.length + 1, 'a');
    source = options.source;
  }
  let flag = source[0];
  options.source = source.substring(1);
  source = options.source;
  if (flag === 'A') {
    Object.assign(options, { isMix: true });
    attrMap.set(id, setMixObjTree(options));
  }
  else {
    options.id = `${options.source}-${options.id}`;
    id = options.id;
    Object.assign(options, { isMix: false });
    attrMap.set(id, setObjectTree(options));
  }

  // if (!~source.indexOf(';')) {//单源目标
  //   options.id = `${options.source}-${options.id}`;
  //   id = options.id;
  //   attrMap.set(id, setObjectTree(options));
  // }
  // else {//融合目标
  //   attrMap.set(id, setMixObjTree(options));
  // }
  // let newAttr = setObjectTree(options);
  // attrMap.set(id, newAttr);
  if (dataStore.objectPool[id]) {
    let cs = Cesium.Cartesian3.fromDegreesArrayHeights(coordinates);
    let ps: any = dataStore.objectPool[id].polyline?.positions?.getValue(new Cesium.JulianDate()) as unknown as [];
    // dataStore.objectPool[id].polyline!.positions = [...ps, ...cs] as unknown as Cesium.Property;
    // console.log(ps, cs);
    ps.push(...cs);
    dataStore.objectPool[id].polyline!.positions = ps as unknown as Cesium.Property;
    dataStore.objectPool[id].position = cs[0] as unknown as Cesium.PositionProperty;
  }
  else {
    let ps = Cesium.Cartesian3.fromDegreesArrayHeights(coordinates);
    let entity = new Cesium.Entity({
      id,
      polyline: {
        positions: ps,
        width: 2,
      },
      position: ps[0]
    });
    entity.point = new Cesium.PointGraphics({
      pixelSize: 10,
      outlineWidth: 1
    });
    if (!sensorMap[source]) {
      if (!colorMap.has(source))
        colorMap.set(source, getRandomColorString());
    }
    setEntityStyle(entity, 'default');
    dataStore.objectPool[id] = entity;
    earthMap.viewer.entities.add(entity);
  }

}
const setObjectTree = (attr: ObjectAttribute) => {
  let cls: ObjectTreeClass;
  let arr: Array<ObjectAttribute | ObjectTreeClass>;
  let sensor = sensorMap[attr.source]?.label || attr.source;
  let idx = dataStore.objectTree.findIndex((item) => item.id === sensor);
  let newAttr: ObjectAttribute;

  if (!~idx) {//新的传感器来源
    cls = {
      id: sensor,
      label: sensor,
      selectable: false,
      children: []
    };
    dataStore.objectTree.push(cls);
  }
  else {
    cls = dataStore.objectTree[idx];
  }

  arr = cls.children;
  idx = arr.findIndex((item) => item.id === `${attr.type}-${sensor}`);
  if (!~idx) {//新的类型
    cls = {
      id: `${attr.type}-${sensor}`,
      label: attr.type,
      selectable: false,
      children: []
    };
    arr.push(cls);
  }
  else {
    cls = arr[idx] as ObjectTreeClass;
  }
  arr = cls.children;
  idx = arr.findIndex(item => item.id === attr.id);
  Object.assign(attr, { label: attr.id.split('-')[1] });
  if (!~idx) {//新的目标
    arr.push(attr);
    newAttr = attr;
    nextTick(() => {
      if (sideBar.value) {
        sideBar.value.objectList.checkNode(attr.id, true);
      }
    });
  }
  else {
    newAttr = Object.assign(arr[idx], attr);
  }
  arr.sort(sortFn.get(sortMethod.value));


  return newAttr;
}
const setMixObjTree = (attr: ObjectAttribute) => {
  let arr: Array<ObjectAttribute | ObjectTreeClass>;

  let newAttr: ObjectAttribute;
  let idx = dataStore.objectTree.findIndex((item) => item.id === '融合目标');
  if (!~idx) {
    let node = { id: '融合目标', label: '融合目标', children: [], selectable: false };
    arr = node.children;
    dataStore.objectTree.push(node);
  }
  else {
    arr = dataStore.objectTree[idx].children;
  }
  // if (dataStore.mixObjTree.length) {
  //   arr = dataStore.mixObjTree[0].children;
  // }
  // else {
  //   dataStore.mixObjTree[0] = { id: '融合目标', label: '融合目标', children: [], selectable: false };
  //   arr = dataStore.mixObjTree[0].children;
  // }

  idx = arr.findIndex((item) => item.id === attr.id);

  Object.assign(attr, { label: attr.id });
  if (!~idx) {//新的目标
    arr.push(attr);
    newAttr = attr;
    nextTick(() => {
      if (sideBar.value) {
        sideBar.value.objectList.checkNode(attr.id, true);
      }
    });
  }
  else {
    newAttr = Object.assign(arr[idx], attr);
  }
  arr.sort(sortFn.get(sortMethod.value));
  return newAttr;
}
const setLayer = (options: LayerOptions) => {
  const { ip, id, url, west, south, east, north } = options;
  imageMap.set(id, { ip, id });
  let layer = earthMap.addImage(url, west, south, east, north);
  let arr;
  if (dataStore.layerMap.size) {
    arr = dataStore.layerTree[0].children;
  }
  else {
    dataStore.layerTree[0] = { id: '图层', children: [], selectable: false };
    arr = dataStore.layerTree[0].children;
  }

  arr.push({ id });
  dataStore.layerMap.set(id, layer);

  nextTick(() => {
    if (sideBar.value) {
      sideBar.value.layerList.checkNode(id, true);
    }
  })
}
const setEntityStyle = (entity: Cesium.Entity,
  status: 'default' | 'highlight' | 'active') => {
  switch (status) {
    case 'default': {
      if (entity.point) {
        // entity.point.color = Cesium.Color.WHITE as unknown as Cesium.Property;
        // entity.point.color = Cesium.Color.fromCssColorString(colorMap.get(attrMap.get(entity.id)!.source)!) as unknown as Cesium.Property;
        let attr = attrMap.get(entity.id)!;
        let sensor = attr.isMix ? 'mix' : attr.source;
        let colorStr = sensorMap[sensor] ? sensorMap[sensor].color : colorMap.get(sensor)!;
        entity.point.color = Cesium.Color.fromCssColorString(colorStr) as unknown as Cesium.Property;
        if (materialMap.has(colorStr)) {
          entity.polyline!.material = materialMap.get(colorStr)!;
        }
        else {
          let lineMateria = initMaterial(colorStr);
          materialMap.set(colorStr, lineMateria);
          entity.polyline!.material = lineMateria;
        }

      }
      break;
    }
    case 'highlight': {
      entity.polyline!.material = Cesium.Color.AQUA as unknown as Cesium.MaterialProperty;
      if (entity.point) {
        entity.point.color = Cesium.Color.AQUA as unknown as Cesium.Property;
      }
      break;
    }
    case 'active': {
      entity.polyline!.material = Cesium.Color.RED as unknown as Cesium.MaterialProperty;
      break;
    }
  }
}
const selectObject = (key: string) => {
  if (selectedSet.has(key)) return;
  selectedSet.add(key);
  let entity = dataStore.objectPool[key];
  let attr = attrMap.get(key)!;
  setEntityStyle(entity, 'active');

  ws.selectObject(attr.ip, attr.id);
}
const unselectObject = (key: string) => {
  if (!selectedSet.has(key)) return;
  selectedSet.delete(key);
  let entity = dataStore.objectPool[key];
  let attr = attrMap.get(key)!;
  setEntityStyle(entity, 'default');

  ws.unselectObject(attr.ip, attr.id);
}

const handleClick = (key: string, type: 'object' | 'layer') => {
  if (type === 'layer') {
    let layer = dataStore.layerMap.get(key)!;
    earthMap.flyTo(layer);
  }
  else if (type === 'object') {
    if (preEntity) selectedSet.has(preEntity.id) ? setEntityStyle(preEntity, 'active')
      : setEntityStyle(preEntity, 'default');
    let entity = dataStore.objectPool[key];
    setEntityStyle(entity, 'highlight');
    preEntity = entity;

    dataStore.focusObject = attrMap.get(key)!;
    earthMap.flyTo(toRaw(dataStore.objectPool[key]));
  }
}

const triggerDiff = (id: string) => {
  ws.detectionImage(id);
}

const toggleDraw = () => {
  if (drawing.value) {
    earthMap.drawExtent(false);
    earthMap.selectEntity(true);
  }
  else {
    earthMap.selectEntity(false);
    earthMap.drawExtent(true);
  }
  drawing.value = !drawing.value;
}

const removeTarget = () => {
  const deepRemove = (node: any) => {
    while (node.length) {
      let item = node[node.length - 1];
      if (item.children) {
        deepRemove(item.children);
      }
      node.pop();
    }
  }
  dataStore.$patch((state) => {
    for (let key in state.objectPool) {
      earthMap.removeTarget(state.objectPool[key]);
    }
    for (let layer of state.layerMap.values()) {
      earthMap.removeImage(toRaw(layer));
    }
    deepRemove(state.objectTree);
    deepRemove(state.mixObjTree);
    deepRemove(state.layerTree);
    state.focusObject = null;
    for (let key in state.objectPool) {
      delete state.objectPool[key];
    }
    state.attrMap.clear();
    state.selectedSet.clear();
    state.imageMap.clear();
    state.layerMap.clear();
  });
}
</script>


<style lang="less" scoped>
.system-title {
  width: 400px;
  height: 60px;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  color: #fff;
  font-size: 28px;
  pointer-events: none;
}

.system-title::before {
  content: "";
  width: 400px;
  height: 60px;
  position: absolute;
  transform-origin: bottom;
  transform: perspective(100px) rotateX(-40deg);
  z-index: -1;
  background-color: #002896be;
  // border-bottom-left-radius: 80px;
  // border-bottom-right-radius: 80px;
}

.button-draw {
  width: 32px;
  height: 32px;
  position: absolute;
  top: 10px;
  left: 10px;
  border-radius: 4px;
  // fill: #fff;
  // background: #303336;
  fill: #46acff;
  background: linear-gradient(0deg, #1d59a2, #002896 50%, #1d59a2);
  cursor: pointer;
}

.button-draw:hover {
  color: #fff;
  fill: #fff;
  background: #48b;
  border-color: #aef;
  box-shadow: 0 0 8px #fff;
}
</style>

