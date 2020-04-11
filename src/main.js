import Vue from 'vue'
import App from './App.vue'
import scrollSpy, {Easing} from 'vue2-scrollspy';

Vue.use(scrollSpy, {
  easing: Easing.Quartic.InOut
});

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
