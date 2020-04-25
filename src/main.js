import Vue from 'vue'
import App from './App.vue'
import scrollSpy, {Easing} from 'vue2-scrollspy';
import {i18n} from './plugins/i18n';
import Highcharts from 'highcharts';
import mapInit from 'highcharts/modules/map'
import HighchartsVue from 'highcharts-vue';
import addUKMap from "./js/ukmap";
import addUSMap from "./js/usmap";
import addWorldMap from "./js/worldmap";

Vue.use(scrollSpy, {
  easing: Easing.Quartic.InOut
});
mapInit(Highcharts);
addUKMap(Highcharts);
addUSMap(Highcharts);
addWorldMap(Highcharts);
Vue.use(HighchartsVue);

Vue.config.productionTip = false;

new Vue({
  i18n,
  render: h => h(App),
}).$mount('#app');
