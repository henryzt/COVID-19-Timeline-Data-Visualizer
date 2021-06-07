import { createApp } from 'vue'
import App from './App.vue'
import { createI18n } from 'vue-i18n'


import zh from "./locales/zh.json";
import en from "./locales/en.json";


const app = createApp(App)

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

app.config.globalProperties.$padNum = numberWithCommas;

const messages = {
  "zh": zh,
  "en": en,
};

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'zh',
  globalInjection: true,
  messages,
})

app.use(i18n)


app.mount('#app')
