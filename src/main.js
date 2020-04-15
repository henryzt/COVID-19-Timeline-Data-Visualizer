import Vue from 'vue'
import App from './App.vue'
import scrollSpy, {Easing} from 'vue2-scrollspy';
import {i18n} from './plugins/i18n';

Vue.use(scrollSpy, {
  easing: Easing.Quartic.InOut
});

Vue.config.productionTip = false;

new Vue({
  i18n,
  render: h => h(App),
}).$mount('#app');
