import axios from "axios";
import { getRandomStr } from './utils'
import type { LayerOptions, ObjectAttribute } from '../vite-env'

export const getWsUrl = () => {
    return axios({
        method: 'GET',
        url: '/ws'
    });
}

type eventCallBack = {
    'object': Function | null,
    'mutilplay': Function | null,
    'layer': Function | null,
    'page': Function | null,
    'open': Function | null
}
export class Pipeline extends WebSocket {
    protected eventHandler: eventCallBack = {
        'object': null,
        'mutilplay': null,
        'layer': null,
        'page': null,
        'open': null
    }
    constructor(url: string) {
        super(url);
        this.onopen = () => {
            console.log(`${this.url} has been created.`);
            this.send(`33 04 ${getRandomStr()} 02`)
        }

        this.onclose = () => {
            console.warn(`${this.url} has been closed.`);
        }

        this.onerror = (e: any) => {
            console.error(e);
        }

        this.onmessage = (e: MessageEvent<any>) => {
            console.log(`${this.url} received:`, e.data);
            let msg: Array<any> = e.data.split(' ');
            if (msg[0] == '33' && msg[1] == '01') {
                let data: ObjectAttribute[] = [];
                let ip = msg[3];
                for (let i = 4; i < msg.length; i++) {
                    let unit = msg[i];
                    let arr = unit.substring(1, unit.length - 1).split(',');
                    let [id, type, longitude, latitude, altitude, speed, course, source, confidence, time, priority] = arr;
                    longitude = longitude * 1;
                    latitude = latitude * 1;
                    altitude = altitude * 1;
                    course = course * 1;
                    priority *= 1;
                    let obj = {
                        ip, id, type, longitude, latitude, altitude
                        , speed, course, source, confidence, time, priority
                    }
                    data.push(obj as ObjectAttribute);
                }
                this.dispatchCustomEvent('object', data);
            }

            if (msg[0] == '33' && msg[1] == '05') {
                let id: string = msg[4];
                let flag = id[0];
                id = flag === 'A' ? id.substring(1).split('-')[1] : id.substring(1);

                let fileName = /[\w-]+.[\w]+$/.exec(msg[5])![0];
                this.dispatchCustomEvent('mutilplay', id, fileName);
            }

            if (msg[0] == '33' && msg[1] == '06') {
                let arr = msg.slice(3);
                let [ip, id, path, west, south, east, north] = arr;
                west = west * 1;
                south = south * 1;
                east = east * 1;
                north = north * 1;
                let fileName = /[\w]+.[\w]+$/.exec(path)![0];
                let data = {
                    ip, id, fileName, west, south, east, north
                }
                this.dispatchCustomEvent('layer', data);
            }

            if (msg[0] == '33' && msg[1] == '08') {
                let addr = msg[3];
                this.dispatchCustomEvent('page', addr);
            }

            if (msg[0] == '33' && msg[1] == '09') {
                let img = msg[3];
                let txt = msg[4];
                this.dispatchCustomEvent('open', img, txt);
            }

        }
    }

    on(type: keyof eventCallBack, callback: Function) {
        this.eventHandler[type] = callback;
    }

    dispatchCustomEvent(type: keyof eventCallBack, ...data: any) {
        if (this.eventHandler[type]) {
            this.eventHandler[type]!(...data);
        }
    }

    selectObject(ip: string, id: string) {
        if (this.readyState !== WebSocket.OPEN) return;
        this.send(`33 02 ${getRandomStr()} ${ip} ${id}`);
    }

    unselectObject(ip: string, id: string) {
        if (this.readyState !== WebSocket.OPEN) return;
        this.send(`33 03 ${getRandomStr()} ${ip} ${id}`);
    }

    areaOfInterest(ext: []) {
        // if (this.readyState !== WebSocket.OPEN) return;
        // let str = ext.join(' ');
        // this.send(`33 07 ${getRandomStr()} ${str}`);
    }

    detectionImage(id: string) {
        if (this.readyState !== WebSocket.OPEN) return;
        this.send(`33 07 ${getRandomStr()} ${id}`);
    }

}


