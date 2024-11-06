import { createApp } from 'vue';
import router from "./router";
import './css/global.css';
import './css/ls.css'

import App from './App.vue'

createApp(App).use(router).mount('#app')
