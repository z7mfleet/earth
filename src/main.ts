import { createApp } from 'vue'
import './css/common.css'
import App from './App.vue'
import axios from 'axios'
import { createPinia } from 'pinia'

if (import.meta.env.DEV) {
    axios.defaults.baseURL = `http://192.168.100.238:7749`;
}
else {
    let urlPath = window.document.location.href;
    let ip_port = /[0-9]+.[0-9]+.[0-9]+.[0-9]+:[0-9]+/.exec(urlPath)![0];
    axios.defaults.baseURL = `http://${ip_port}`;
}
const pinia = createPinia();
createApp(App).use(pinia).mount('#app')
