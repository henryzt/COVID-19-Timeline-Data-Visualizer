import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

const messages = {
    'en': {
        title: "Realtime Data Tracking",
        subtitles: {
            today: "Today Overview",
            country: "Country Overview",
            nearby: "Cases Near Me",
            confirmAndDeath: "Confirmed Cases and Deaths",
            newDeaths: "New Deaths",
            rates: "Death Rate and Recover Rate",
            historyAnimation: "Confirmed Cases Animation",
            regionList: "Region List",
            source: "Source",
            about: "About",
        }
    },
    'zh': {
        title: "实时数据动态",
        subtitles: {
            today: "今日概览",
            country: "国家概览",
            nearby: "查询周边确诊",
            confirmAndDeath: "确诊及死亡",
            newDeaths: "新增死亡",
            rates: "死亡率及治愈率",
            historyAnimation: "历史确诊数据动画",
            regionList: "地域确诊列表",
            source: "数据来源",
            about: "关于",
        }
    }
};

// eslint-disable-next-line no-unused-vars
export const i18n = new VueI18n({
    locale: 'en', // set locale
    fallbackLocale: 'es', // set fallback locale
    messages, // set locale messages
});