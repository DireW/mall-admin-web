import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import VCharts from 'v-charts'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

import * as base64 from '@/utils/base64';

import axios from '@/utils/request';
Vue.prototype.$axios = axios;

import dayjs from 'dayjs';
Vue.prototype.$dayjs = dayjs;

import Cookies from 'js-cookie'

Vue.use(ElementUI, {
    size: Cookies.get('size') || 'medium',
    locale
});
Vue.use(VCharts);

Vue.config.productionTip = false;

Vue.filter("lastTwoChars", (val = '') => {
    const value = val === null ? '' : val;
    if (value.length > 2) {
        return value.substr(value.length - 2, 2);
    } else {
        return value;
    }
});
import {formatDate} from "./utils/date";

Vue.filter('formatDate', (time = '') => {
    if (time == null || time === '') {
        return 'N/A';
    }
    let date = new Date(time);
    return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
});

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App}
});
