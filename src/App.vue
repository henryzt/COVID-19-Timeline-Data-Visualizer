<template>
  <div id="app">
    <div class="mContent" v-if="dataCurrent">
      <div class="covid_header">
        <div>
          <vSelect class="select" :clearable="false" :value="currentCountry" :options="countryList" @input="switchCountry"></vSelect>
        </div>
        <div class="header_title">
          <h2>COVID-19</h2>
          <h3 v-html="$t('title')"></h3>
        </div>
      </div>

      <TodayNumberSection :display="display"></TodayNumberSection>

      <UkRegionSection v-if="dataCurrent.isUk && dataUk" :dataUk="dataUk" :sortedRegionData="sortedRegionData"></UkRegionSection>

        <div v-if="!dataCurrent.isUk">
            <div class="title">{{ $t('subtitles.timeMachine') }}</div>
            <div class="mBlock">
                <SlideController :start-date="startDate" :end-date="endDate" :hidePlayButton="true" :disableClick="true"
                                 :current-date="currentDate" @changeIndex="changeDateIdx" @change="changeDate" @dragEnded="onTMDragEnd"
                                 :enableEvenIfPaused="true" :playing="false"></SlideController>
                <div class="displayInfo" style="text-align: center; opacity:0.5;padding-top:6px">{{ $t('tmHint') }}</div>
            </div>
            <div class="fix_bottom" style="background: orange;" :class="{'hide-popup': (currentDate === endDate || section)}">
                {{ $t('tmSticky') }} ({{currentDate}})
                <span style="margin-left: 5px;text-decoration: underline;cursor: pointer;" @click="revertTM">{{ $t('tmRevert') }}</span>
            </div>
        </div>

      <div id="navPlaceholder" ref="navPlaceholder"></div>
      <div class="mNav" ref="nav" id="mNavbar">
        <ul class="nav nav-pills nav-fill" v-scroll-spy-active="{selector: 'li a', class: 'active'}" v-scroll-spy-link>
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

      <div v-scroll-spy="{data: 'section', offset: 100, allowNoActive: false}">
        <div class="mSection" id="charts" style="padding-top: 0">
            <ChartSection :chart-data="chartData ? chartData : dataCurrent.history"></ChartSection>
        </div>

          <div class="mSection" id="animation">
              <div class="title">{{ $t('subtitles.historyAnimation') }}</div>
                <BarRaceSection v-if="barRaceData.hasData" :bar-race-data="barRaceData"></BarRaceSection>
            <div class="title">{{ $t('subtitles.ratio') }}</div>
            <PieSection :allHistoryData="dataCurrent.history" :mainDate="currentDate"></PieSection>
          </div>

        <div class="mSection" id="regionData">
            <div v-if="dataCurrent.isUk">
                <div class="title">{{ $t('subtitles.map') }}</div>
                <MapSection :commonLocationsData="commonLocationsData"></MapSection>
                <br>
            </div>
            <div class="title">{{ $t('subtitles.regionList') }}</div>
            <RegionTable :regionData="tableData" v-if="tableData.hasData" :mainDate="currentDate"></RegionTable>
        </div>

      </div>

      <div class="mSection">

        <!-- WeChat notification, for CN only -->
        <div v-if="isLocaleCN">
          <div class="title">实时更新订阅</div>
          <div class="mBlock" style="text-align: center;padding:30px">
            <div>微信扫描或长按下方二维码，或搜索"<span style="text-wrap: none">UCLCSSA学联社区</span>"</div>
            <img src="./assets/qr.png" style="max-width: 260px;"/>
            <div>订阅每日实时数据更新及重要预警通知</div>
            <div v-if="isLocaleCN && isWeChat()" style="margin-top: 20px;text-align:center;user-select: none;">
            <hr>
              <div style="font-size: 20px;">本应用地址</div>
              <div style="font-size: 25px;font-weight:bold;padding: 10px 0;user-select: text;">covid19.uclcssa.cn</div>
              长按复制即可分享给其他人
            </div>
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
          <li>{{lastUpdated}}</li>
          <li v-if="isLocaleCN">感谢 <a href="https://github.com/isjeffcom/">@isjeff</a> 提供的英国数据API</li>
        </ul>


        <div class="title">{{ $t('subtitles.about') }}</div>

        <ul>
          <li>This project is open sourced at <a href="https://github.com/henryz00/COVID-19-Data-Visualizer-UK">Github Repository</a>, pull requests and issues welcomed!</li>
          <li>© 2020 <a href="https://github.com/henryz00">@henryz00</a> and <a href="https://github.com/DaviesXue">@DaviesXue</a>
              <span>{{isLocaleCN ? " | UCLCSSA 伦敦大学学院中国学联" : "at University College London."}}</span>
          </li>

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

    <div class="fix_bottom" v-if="isLocaleCN && isWeChat()" :class="{'hide-popup': !showWechatPopup}">
      将此页面设为微信浮窗，方便第一时间获取更新
    </div>
  </div>
</template>

<script>
    /* eslint-disable */
import RegionTable from "./components/RegionTable.vue";
import UkRegionSection from "./components/UkRegionSection.vue";
import TodayNumberSection from "./components/TodayNumberSection.vue";
import BarRaceSection from "./components/BarRaceSection.vue";
import MapSection from "./components/MapSection.vue";
import ChartSection from "./components/ChartSection.vue";
import SlideController from "./components/SlideController.vue";
import PieSection from "./components/PieSection.vue";
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import {
  getNHSRegionD3Data,
  getD3GlobalData,
  getRegionHistoryTableData,
  getGlobalHistoryTableData,
  parseLocationData,
  combineHighCharts,
  getAllCountries,
  getCountryData,
  getCountryHistoryData
} from "./js/locationUtils"

const moment = require('moment');

export default {
  name: "App",
  components: {
    RegionTable,
    BarRaceSection,
    ChartSection,
    PieSection,
    TodayNumberSection,
    UkRegionSection,
    vSelect,
    MapSection,
    SlideController
  },
  data: () => {
    return {
      dataCurrent: null,
      dataUk: null,
      dataGlobal: null,
      sortedRegionData: null,
      section: 0,
      currentCountry: null,
      display: {
        confirmed: 0,
        confirmedChange: 0,
        deaths: 0,
        deathsChange: 0,
        tested: 0,
        testedChange: 0,
        cured: 0,
        curedChange: 0
      },
      barRaceData: {
        hasData: false
      },
      commonLocationsData: [],
      tableData:{
        hasData: false
      },
      chartData: null,
      isLocaleCN: false,
      showWechatPopup: true,
      currentDate: null,
      lastUpdated: "NEVER"
    };
  },
  mounted() {
    if(this.isWeChat()){
      this.$i18n.locale = "zh";
    }
    this.isLocaleCN = this.$i18n.locale === "zh";
    document.title = this.$t('pageTitle');

    let performanceTimeStart = performance.now();
    fetch("https://henryz.cc/projects/covid/api.php").then(async res => {
      let data = await res.json();
      let resTime = Math.round(performance.now() - performanceTimeStart);
      this.dataUk = data.uk;
      this.dataGlobal = data.global;
      console.log(data);
      this.lastUpdated = `Global data updated ${moment(data.global.confirmed.last_updated).fromNow()},
                          UK data updated ${moment(data.uk.now[0].ts).fromNow()}, data is ${data.isUpToDate?"":"NOT"} up to date.
                          Data might not reflect the real number, and might be delayed.`;
        //global data
      this.tableData.global = getGlobalHistoryTableData(this.dataGlobal.confirmed);
      this.barRaceData.global = getD3GlobalData(this.tableData.global);
      let countryArr = getAllCountries(this.dataGlobal.confirmed.locations);
      this.countryList = [this.$t('selector.uk'), this.$t('selector.world'), ...countryArr];
      this.currentCountry = this.countryList[0];
      this.barRaceData.hasData = true;
      this.loadUkData();

      this.getNavScrollAnchor();
      let performanceTime = Math.round(performance.now() - performanceTimeStart);
      console.log("Data loaded", resTime, performanceTime);
      window.ga('send', 'event', "net-request", "initial-fetch-loaded", `loaded-${resTime}ms;calculated-${performanceTime}ms;`);
    });

    setTimeout(()=>{
      this.showWechatPopup = false
    }, 2000)

  },
  methods: {
      switchCountry: function(e){
          console.log(e);
          this.chartData = null;
          this.currentCountry = e;
          window.ga('send', 'event', "country", "country-changed", e);
          if(e===this.countryList[0]){
              this.loadUkData()
          }else if(e===this.countryList[1]){
              this.loadCountryData("world")
          }else {
              this.loadCountryData(e)
          }
          this.forceReload()
      },
      loadCountryData: function(countryName){
          let countryData = getCountryData(this.dataGlobal, countryName);
          this.dataCurrent = {};
          this.dataCurrent.isUk = false;
          //history data
          //console.log("data loaded", countryData);
          this.tableData.uk = countryName==="world" ? null : getGlobalHistoryTableData(countryData.confirmed, true);
          this.barRaceData.ukRegions = countryName==="world" ? null : getNHSRegionD3Data(this.tableData.uk);
          this.tableData.hasData = true;
          this.dataCurrent.history = getCountryHistoryData(countryData);
          console.log("country loaded", this.dataCurrent);
          this.startDate = moment(this.dataCurrent.history[0].date).format("DD/MM");
          this.endDate = moment(this.dataCurrent.history[this.dataCurrent.history.length-1].date).format("DD/MM");
          this.currentDate = this.endDate;
          this.calculateDisplay(this.dataCurrent.history.length-1)
      },
      calculateDisplay: function(idx){
        let current = this.dataCurrent.history[idx];
        let last = this.dataCurrent.history[idx-1]?this.dataCurrent.history[idx-1]:current;
        this.display = {
            confirmed: current.confirmed,
            confirmedChange: current.confirmed - last.confirmed,
            deaths: current.death,
            deathsChange: (current.death - last.death),
            tested: current.tested,
            testedChange: current.tested??(current.tested - last.tested),
            cured: current.cured,
            curedChange: (current.cured - last.cured)
        };

      },
      loadUkData: function(){
          this.dataCurrent = this.dataUk;
          this.dataCurrent.isUk = true;
          let currentUkAreaData = parseLocationData(this.dataUk.now[0].area);
          //history data
          let todayData = this.dataUk.history[this.dataUk.history.length - 1];
          let yesterData = this.dataUk.history[this.dataUk.history.length - 2];
          this.tableData.uk = getRegionHistoryTableData(this.dataUk.history, currentUkAreaData);
          this.barRaceData.ukRegions = getNHSRegionD3Data(this.tableData.uk);
          this.commonLocationsData = combineHighCharts(currentUkAreaData);

          this.sortedRegionData = [...currentUkAreaData].sort((a, b) => b.number - a.number);
          this.tableData.hasData = true;
          this.currentDate = null;

          let confirmedChange = this.dataUk.now[0].confirmed - todayData.confirmed;
          let deathsChange = this.dataUk.now[0].death - todayData.death;
          let testedChange = this.dataUk.now[0].tested - todayData.tested;

          this.display = {
              confirmed: this.dataUk.now[0].confirmed,
              confirmedChange: confirmedChange!=0?confirmedChange:(todayData.confirmed - yesterData.confirmed),
              deaths: this.dataUk.now[0].death,
              deathsChange: deathsChange!=0?deathsChange:(todayData.death - yesterData.death),
              tested: this.dataUk.now[0].tested,
              testedChange: testedChange!=0?testedChange:(todayData.tested - yesterData.tested),
              cured: this.dataUk.now[1].cured,
              curedChange: (this.dataUk.now[1].cured - todayData.cured)
          };
      },
      changeDateIdx: function(idx){
          this.calculateDisplay(idx)
      },
      changeDate: function(date){
          this.currentDate = date;
      },
      onTMDragEnd: function(idx){
         console.log(idx);
         this.chartData = this.dataCurrent.history.slice(0, idx);
         window.ga('send', 'event', "time-machine", "drag-end", idx);
      },
      revertTM: function(){
          this.currentDate = this.endDate;
          this.chartData = this.dataCurrent.history;
          this.calculateDisplay(this.dataCurrent.history.length-1);
          window.ga('send', 'event', "time-machine", "reverted", this.endDate);
      },
    changeLang: function(lang){
      this.$i18n.locale = lang;
      this.isLocaleCN = this.$i18n.locale === "zh";
      document.title = this.$t('pageTitle');
      this.countryList[0] = this.$t('selector.uk');
      this.countryList[1] = this.$t('selector.world');
      this.currentCountry = this.countryList[0];
      this.forceReload()
    },
      forceReload: function(){
          //force reload
        let cache = this.dataCurrent;
        this.dataCurrent = null;
        this.$nextTick(() => {
            this.dataCurrent = cache;
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
    padding: 20px 10px;
    text-align: right;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header_title{
    opacity: 0.5;
  }

  .fix_bottom{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: deepskyblue;
    color: white;
    line-height: 40px;
    text-align: center;
    transition: 2s;
      z-index: 100;
  }

  .hide-popup{
    bottom: -40px;
    opacity: 0;
  }

  .select{
    width: 190px;

  }


  @media only screen and (max-width: 600px) {
    .covid_header{
      padding: 20px 10px;
      display: flex;
      flex-direction: column-reverse;
      align-items: flex-end;
    }
    .header_title h2{
      font-size: 30px;
    }
    .header_title h3{
      font-size: 25px;
    }
  }
</style>
