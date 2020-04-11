import Vue from 'vue'
import App from './App.vue'
import scrollSpy from 'vue2-scrollspy';

Vue.use(scrollSpy);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
