import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import router from "./router";
import 'element-plus/dist/index.css';
import '../public/css/global.css';
import '../public/css/ls.css'

import App from './App.vue'

createApp(App).use(ElementPlus, {locale: zhCn}).use(router).mount('#app')
