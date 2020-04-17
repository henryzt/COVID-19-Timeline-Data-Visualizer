<template>
  <div id="app">
    <div class="mContent" v-if="dataCurrent">
      <div class="covid_header">
        <h2>COVID-19</h2>
        <h3>{{ $t('title') }}</h3>
      </div>

      <div class="title">{{ $t('subtitles.today') }}</div>
      <div class="overview mBlock">
        <div class="overview_item" style="color: #ff5151;">
          <div class="overview_title">{{ $t('totalConfirmed') }}</div>
          <div class="overview_number"><ICountUp :endVal="dataUk.now[0].confirmed"/></div>
          <div class="daily-increase">{{ '+' + dataUk.regional.dailyConfirmed }}</div>
        </div>
        <div class="overview_item" style="color: #575757;">
          <div class="overview_title">{{ $t('totalDeaths') }}</div>
          <div class="overview_number"><ICountUp :endVal=" dataUk.now[0].death"/></div>
          <div class="daily-increase">{{ '+' + (todayData.death - yestData.death)}}</div>
        </div>
        <div class="overview_item" style="color: #0094b9;">
          <div class="overview_title">{{ $t('totalTests') }}</div>
          <div class="overview_number"><ICountUp :endVal=" dataUk.now[0].tested "/></div>
          <div class="daily-increase"> {{ '+' + (todayData.tested - yestData.tested)}} </div>
        </div>
        <div class="overview_item" style="color: #28ca00;">
          <div class="overview_title">{{ $t('totalCured') }}</div>
          <div class="overview_number"><ICountUp :endVal=" dataUk.now[1].cured "/></div>
          <div class="daily-increase">{{ '+' + (todayData.cured - yestData.cured)}}</div>
        </div>
      </div>

      <div class="title">{{ $t('subtitles.country') }}</div>
      <div class="overview mBlock">
        <div class="overview_item">
          <div class="overview_title">{{ $t('england') }}</div>
          <div class="overview_number"><ICountUp :endVal="dataUk.now[0].england "/></div>
          <div class="country-death">{{ dataUk.regional.englandDeceased }}</div>
        </div>
        <div class="overview_item">
          <div class="overview_title">{{ $t('scotland') }}</div>
          <div class="overview_number"><ICountUp :endVal=" dataUk.now[0].scotland "/></div>
          <div class="country-death">{{ dataUk.regional.scottlandDeceased }}</div>
        </div>
        <div class="overview_item">
          <div class="overview_title">{{ $t('wales') }}</div>
          <div class="overview_number"><ICountUp :endVal="dataUk.now[0].wales "/></div>
          <div class="country-death">{{ dataUk.regional.walesDeceased }}</div>
        </div>
        <div class="overview_item">
          <div class="overview_title">{{ $t('nIreland') }}</div>
          <div class="overview_number"><ICountUp :endVal="dataUk.now[0].nireland "/></div>
          <div class="country-death">{{ dataUk.regional.northenIrelandDeceased }}</div>
        </div>
      </div>

      <div>
        <div class="title">{{ $t('subtitles.nearby') }}</div>
        <div class="mBlock">
          <NearbyCasesFinder :regionData="sortedRegionData"></NearbyCasesFinder>
        </div>

      </div>

      <div id="navPlaceholder" ref="navPlaceholder"></div>
      <div class="mNav" ref="nav" id="mNavbar">
        <ul class="nav nav-pills nav-fill" v-scroll-spy-active="{selector: 'li a', class: 'active', offset: 500}" v-scroll-spy-link>
          <li class="nav-item">
            <a class="nav-link" href="#charts">{{ $t('nav.current') }}</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#animation">{{ $t('nav.animation') }}</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#regionData">{{ $t('nav.map') }}</a>
          </li>
        </ul>
      </div>

      <div v-scroll-spy="{data: 'section'}">
        <div class="mSection" id="charts" style="padding-top: 0">
            <ChartSection :chart-data="dataUk.history"></ChartSection>
        </div>

          <div class="mSection" id="animation">
              <div class="title">{{ $t('subtitles.historyAnimation') }}</div>
                <BarRaceSection v-if="barRaceData.hasData" :bar-race-data="barRaceData"></BarRaceSection>
            <div class="title">{{ $t('subtitles.historyAnimation') }}</div>
            <PieSection :allHistoryData="dataUk.history"></PieSection>
          </div>

        <div class="mSection" id="regionData">
            <div class="title">{{ $t('subtitles.map') }}</div>
            <MapSection :commonLocationsData="commonLocationsData"></MapSection>
          <br>
            <div class="title">{{ $t('subtitles.regionList') }}</div>
            <RegionTable :regionData="tableData" v-if="tableData.hasData"></RegionTable>
        </div>

      </div>

      <div class="mSection">

        <!-- WeChat notification, for CN only -->
        <div v-if="isLocaleCN">
          <div class="title">实时更新订阅</div>
          <div class="mBlock" style="text-align: center;padding:30px">
            <div>微信长按下方二维码，或搜索"<span style="text-wrap: none">UCLCSSA学联社区</span>"</div>
            <img src="./assets/qr.png" style="max-width: 260px;"/>
            <div>订阅每日实时疫情数据更新通知</div>
          </div>
        </div>

        <br>
        <div class="title">{{ $t('subtitles.source') }}</div>
        <ul>
          <li><a href="https://github.com/isjeffcom/coronvirusFigureUK">Coronavirus UK Data API - isjeffcom</a></li>
          <li><a href="https://github.com/CSSEGISandData/COVID-19">COVID-19 Data Repository - Johns Hopkins CSSE</a></li>
          <li><a href="https://apify.com/covid-19">COVID-19 Data APIs for statistics - APIFY</a></li>
          <li><a href="https://github.com/ExpDev07/coronavirus-tracker-api">Coronavirus Tracker API - ExpDev07</a></li>
          <li><a href="https://www.iconfinder.com/p/coronavirus-awareness-icons">Coronavirus Awareness Icons - iconfinder</a></li>
          <li v-if="isLocaleCN">感谢 <a href="https://github.com/isjeffcom/">@isjeff</a> 提供的英国数据API</li>
        </ul>

        <div class="title">{{ $t('subtitles.about') }}</div>
        <ul>
          <li>This project is open sourced at <a href="https://github.com/henryz00/COVID-19-Data-Visualizer-UK">Github Repository</a>, pull requests and issues welcomed!</li>
          <li>© 2020 <a href="https://github.com/henryz00">@henryz00</a> and <a href="https://github.com/DaviesXue">@DaviesXue</a> for UCLCSSA.</li>

        </ul>

        <div style="text-align: center;margin: 50px 0;opacity: 0.5;color: silver;">
          <img src="./assets/logo_grey.png" style="max-width: 200px;" v-if="isLocaleCN"/>
          <br><br>
          <a href="#" @click="changeLang('en')">English</a> | <a href="#" @click="changeLang('zh')">中文</a>
        </div>

      </div>


    </div>
    <div v-else>
      <div class="vertical-center">
        <div class="spinner-border text-primary"  style="width: 3rem; height: 3rem;" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Chart from "./components/Chart.vue";
import RegionTable from "./components/RegionTable.vue";
import BarRaceSection from "./components/BarRaceSection.vue";
import MapSection from "./components/MapSection.vue";
import ChartSection from "./components/ChartSection.vue";
import PieSection from "./components/PieSection.vue";
import NearbyCasesFinder from "./components/NearbyCasesFinder.vue";
import ICountUp from 'vue-countup-v2';
import {getNHSRegionD3Data, getD3GlobalData, getRegionHistoryTableData, parseLocationData, combineHighCharts} from "./js/locationUtils"

export default {
  name: "App",
  components: {
    RegionTable,
    BarRaceSection,
    ChartSection,
    PieSection,
    NearbyCasesFinder,
    ICountUp,
    MapSection
  },
  data: () => {
    return {
      dataCurrent: null,
      dataUk: null,
      todayData: null,
      yestData: null,
      sortedRegionData: null,
      section: 0,
      barRaceData: {
        hasData: false
      },
      commonLocationsData: [],
      tableData:{
        hasData: false
      },
      isLocaleCN: false
    };
  },
  mounted() {
    if(this.isWeChat()){
      this.$i18n.locale = "zh";
    }
    this.isLocaleCN = this.$i18n.locale === "zh";
    document.title = this.$t('pageTitle');

    fetch("https://henryz.cc/projects/covid/api.php").then(async res => {
      let data = await res.json();
      this.dataUk = data.uk;
      this.dataCurrent = this.dataUk;
      console.log(data);
      let currentUkAreaData = parseLocationData(this.dataUk.now[0].area);
      //history data
      this.todayData = data.uk.history[data.uk.history.length - 1];
      this.yestData = data.uk.history[data.uk.history.length - 2];
      this.tableData.uk = getRegionHistoryTableData(data.uk.history, currentUkAreaData);
      this.barRaceData.ukRegions = getNHSRegionD3Data(this.tableData.uk);
      this.commonLocationsData = combineHighCharts(currentUkAreaData);
      //global data
      this.barRaceData.global = getD3GlobalData(data.global.confirmed);
      this.barRaceData.hasData = true;

      this.sortedRegionData = [...currentUkAreaData].sort((a, b) => b.number - a.number);
      this.tableData.hasData = true;

      this.getNavScrollAnchor();
    });

  },
  methods: {
    changeLang: function(lang){
      this.$i18n.locale = lang;
      this.isLocaleCN = this.$i18n.locale === "zh";
      document.title = this.$t('pageTitle');
      //force reload
      this.dataCurrent = null;
      this.$nextTick(() => {
        this.dataCurrent = this.dataUk;
      });
    },
    isWeChat: function(){
      let ua = window.navigator.userAgent.toLowerCase();
      return (ua.match(/MicroMessenger/i) == 'micromessenger');
    },
    getNavScrollAnchor: function () {
      document.addEventListener('scroll', ()=>{
        if(window.scrollY > this.$refs["navPlaceholder"].offsetTop){
          this.$refs["nav"].classList.add("fixed_nav");
          this.$refs["navPlaceholder"].classList.add("navPlaceholder");
        }else {
          this.$refs["nav"].classList.remove("fixed_nav");
          this.$refs["navPlaceholder"].classList.remove("navPlaceholder");
        }
      })
    }
  }

};
</script>

<style scoped>
  .vertical-center {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  h6{
    padding-left: 20px;
  }
  .covid_header{
    opacity: 0.5; padding: 20px 10px;
    text-align: right;
  }
</style>
