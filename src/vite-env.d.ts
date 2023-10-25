/// <reference types="vite/client" />
import type Cesium from "cesium";

type ObjectAttribute = {
    ip: string,
    id: string,
    type: string,
    longitude: number,
    latitude: number,
    altitude: number,
    speed: number,
    course: number,
    source: string,
    confidence: number,
    time: string,
    priority: number,
    isMix?: boolean,
    imageURL?: string,
    videoURL?: string,
    label?: string
}


type EntityMap = {
    [key: string]: Cesium.Entity
}

type SensorMap = {
    [key: string]: {
        label: string,
        color: string
    }
}

type ObjectTreeClass = {
    id: string,
    label: string,
    selectable: boolean,
    children: Array<ObjectAttribute | ObjectTreeClass>
}

type ObjectTree = ObjectTreeClass[]

type LayerOptions = {
    ip: string,
    id: string,
    url: string,
    west: number,
    south: number,
    east: number,
    north: number
}

type ImageAttribute = {
    ip: string,
    id: string
}

type tileProvider = {
    dir: string,
    extent: [],
    minZoom: number,
    maxZoom: number
}