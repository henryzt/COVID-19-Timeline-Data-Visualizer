<template>
  <div id="app">
    <div class="mContent" v-if="dataGlobal || dataUk" :class="{mContentDesktop: desktopLayout}">
      <div :class="{'d-flex': desktopLayout}">
        <div :class="{'mSectionDesktop': desktopLayout}">
          <!-- header section -->
          <div class="covid_header">
            <div>
              <vSelect
                class="select"
                :clearable="false"
                :value="currentCountry"
                :options="countryList"
                @input="switchCountry"
              ></vSelect>
            </div>
            <div class="header_title">
              <h2>COVID-19</h2>
              <h3 v-html="$t('title')"></h3>
            </div>
          </div>

          <!-- number display-->
          <TodayNumberSection :display="display" v-if="display"></TodayNumberSection>

          <!-- UK number display and postcode -->
          <UkRegionSection
            v-if="renderAll && isCurrentUk"
            :dataUk="dataCurrent.uk && dataCurrent.uk.nation"
            :class="{disabled:currentDate != endDate}"
          ></UkRegionSection>

          <!-- near by cases -->
          <div v-if="renderAll && (isCurrentUk || countryName==='US')">
            <div class="title">{{ $t('subtitles.nearby') }}</div>
            <div class="mBlock">
              <NearbyCasesFinder :regionData="sortedRegionData" :currentCountry="countryName"></NearbyCasesFinder>
            </div>
          </div>

          <!-- time machine -->
          <div v-if="renderAll && endDate && dataGlobal">
            <div class="title">{{ $t('subtitles.timeMachine') }}</div>
            <div class="mBlock">
              <SlideController
                :startDate="startDate"
                :endDate="endDate"
                :hidePlayButton="true"
                :disableClick="true"
                :currentDate="currentDate"
                @changeIndex="changeDateIdx"
                @change="changeDate"
                @dragEnded="onTMDragEnd"
                :enableEvenIfPaused="true"
                :playing="false"
              ></SlideController>
              <div class="displayInfo" style="text-align: center; opacity:0.5;padding-top:6px">
                {{ $t('tmHint')
                }}
              </div>
            </div>
            <div
              class="fix_bottom"
              style="background: orange;"
              :class="{'hide-popup': (currentDate === endDate || (section && !desktopLayout))}"
            >
              {{ $t('tmSticky') }} ({{currentDate}})
              <span
                style="margin-left: 5px;text-decoration: underline;cursor: pointer;"
                @click="revertTM"
              >{{ $t('tmRevert') }}</span>
            </div>
          </div>

          <!-- loading -->
          <div v-if="!renderAll" class="mSection">
            <Loading></Loading>
          </div>

          <!-- charts (show on desktop layout) -->
          <div class="mSection" v-if="renderAll && desktopLayout" style="padding-top: 0">
            <ChartSection
              :chartData="chartData ? chartData : dataCurrent.history"
              :isUk="isUkRealtime"
            ></ChartSection>
          </div>
        </div>

        <!-- nav bar -->
        <div id="navPlaceholder" ref="navPlaceholder" v-if="renderAll && !desktopLayout"></div>
        <div class="mNav" ref="nav" id="mNavbar" v-if="renderAll && !desktopLayout">
          <ul
            class="nav nav-pills nav-fill"
            v-scroll-spy-active="{selector: 'li a', class: 'active'}"
          >
            <li class="nav-item">
              <a class="nav-link" href="#charts">{{ $t('nav.current') }}</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#analysis">{{ $t('nav.analysis') }}</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#regionData">{{ $t('nav.map') }}</a>
            </li>
          </ul>
        </div>

        <div
          v-if="renderAll"
          :class="{'d-flex': desktopLayout}"
          v-scroll-spy="{data: 'section', offset: 100, allowNoActive: false}"
        >
          <!-- charts (show on mobile layout) -->
          <div class="mSection" v-if="!desktopLayout" id="charts" style="padding-top: 0">
            <ChartSection
              v-if="dataCurrent.history || chartData"
              :chart-data="chartData ? chartData : dataCurrent.history"
              :isUk="isUkRealtime"
            ></ChartSection>
          </div>

          <!-- analysis -->
          <div class="mSection" :class="{'mSectionDesktop': desktopLayout}" id="analysis">
            <div v-if="dataUk && isCurrentUk">
              <UkDetailSection :dataUk="dataUk"></UkDetailSection>
            </div>
            <div v-if="dataGlobal">
              <div class="title">{{ $t('subtitles.historyAnimation') }}</div>
              <BarRaceSection v-if="hasTableData" :countryName="countryName" :table-data="tableData"></BarRaceSection>
              <div class="title">{{ $t('subtitles.ratio') }}</div>
              <PieSection
                v-if="dataCurrent.history"
                :allHistoryData="dataCurrent.history"
                :mainDate="mainDate"
              ></PieSection>
              <div class="title">{{ $t('subtitles.countryCompare') }}</div>
              <CountryCompareSection :global-data="dataGlobal" :country-list="countryList"></CountryCompareSection>
            </div>
            
            <!-- global data load button if not shown -->
            <div v-if="dataUk && !dataGlobal">
              <div class="title">{{ $t('nav.analysis') }}</div>
              <div class="mBlock" @click="loadAdditionalUkAndGlobalData">
                <div class="showMore">{{ $t('loadWorldAnalysis') }}</div>
              </div>
            </div>
          </div>

          <!-- map and table -->
          <div class="mSection" :class="{'mSectionDesktop': desktopLayout}" id="regionData">
            <div class="title">{{ $t('subtitles.map') }}</div>
            <MapSection
              v-if="hasTableData"
              :tableData="tableData"
              :countryName="countryName"
              :mainDate="mainDate"
            ></MapSection>
            <br />
            <div class="title">{{ $t('subtitles.regionList') }}</div>
            <RegionTable
              :regionData="tableData"
              v-if="hasTableData"
              :mainDate="mainDate"
              :isUk="isCurrentUk"
              @expanded="hideFab=$event"
              @switchCountry="switchCountry"
              :currentCountry="currentCountry"
              :desktopLayout="desktopLayout"
            ></RegionTable>
          </div>
        </div>
      </div>

      <!-- share and credit -->
      <div class="mSection" id="share" :class="{mContent:desktopLayout}">
        <Credits
          :isMiniApp="isMiniApp"
          :isLocaleCN="isLocaleCN"
          :showWechatPopup="showWechatPopup"
          :lastUpdated="lastUpdated"
          :changeLang="changeLang"
          :isWeChat="isWeChat"
        ></Credits>
        <FAB
          v-if="isDesktop && !hideFab"
          :isDesktop="desktopLayout"
          @switchLayout="desktopLayout=$event"
        ></FAB>
      </div>
    </div>

    <!-- loading indicator -->
    <div v-else>
      <div class="vertical-center">
        <div
          class="spinner-border text-primary"
          style="width: 3rem; height: 3rem;"
          role="status"
          v-if="!networkError"
        >
          <span class="sr-only">Loading...</span>
        </div>
        <div v-else>
          Network Error
          <br />
          <a href="/">Retry</a>
        </div>
      </div>
    </div>

    <!-- launch indicator -->
    <div
      class="fix_bottom"
      style="font-size: 14px;font-weight: bold;"
      :class="{'hide-popup': !showWechatPopup}"
    >{{launchIndicator}}</div>
  </div>
</template>

<script>
import TodayNumberSection from "./components/analysis/TodayNumberSection.vue";
import UkRegionSection from "./components/uk/UkRegionSection.vue";
import SlideController from "./components/common/SlideController.vue";
import NearbyCasesFinder from "./components/analysis/NearbyCasesFinder.vue";
import FAB from "./components/common/FAB.vue";
import Credits from "./components/common/Credits.vue";
import Loading from "./components/common/Loading.vue";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

const RegionTable = () => ({
  component: import("./components/analysis/RegionTable.vue"),
  loading: Loading,
});
const BarRaceSection = () => ({
  component: import("./components/barrace/BarRaceSection.vue"),
  loading: Loading,
});
const MapSection = () => ({
  component: import("./components/map/MapSection.vue"),
  loading: Loading,
});
const ChartSection = () => ({
  component: import("./components/charts/ChartSection.vue"),
  loading: Loading,
});
const CountryCompareSection = () => ({
  component: import("./components/analysis/CountryCompareSection.vue"),
  loading: Loading,
});
const PieSection = () => ({
  component: import("./components/analysis/PieSection.vue"),
  loading: Loading,
});
const UkDetailSection = () => ({
  component: import("./components/uk/UkDetailSection.vue"),
  loading: Loading,
});

import {
  getGlobalHistoryTableData,
  getAllCountries,
  getCountryData,
  getCountryHistoryData,
  getUSRegionData,
} from "./js/locationUtils";
import {countryList} from "./js/countryList"

const moment = require("moment");

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
    SlideController,
    CountryCompareSection,
    FAB,
    NearbyCasesFinder,
    Credits,
    UkDetailSection,
    Loading
  },
  data: () => {
    return {
      shouldRender: true,
      dataCurrent: {},
      dataUk: null,
      dataGlobal: null,
      sortedRegionData: null,
      section: 0,
      currentCountry: null,
      countryList: [],
      display: {
        confirmed: 0,
        confirmedChange: 0,
        deaths: 0,
        deathsChange: 0,
        tested: 0,
        testedChange: 0,
        cured: 0,
        curedChange: 0,
      },
      tableData: {
        country: null,
        global: null,
        uk: null,
        hasData: false,
      },
      chartData: null,
      isLocaleCN: false,
      showWechatPopup: true,
      currentDate: null,
      mainDate: null,
      lastUpdated: "NEVER",
      launchIndicator: "",
      isDesktop: false,
      desktopLayout: false,
      networkError: false,
      hideFab: false,
      startDate: null,
      endDate: null,
      countryName: null
    };
  },
  async mounted() {
    window.dateFormat = "DD MMM YY";
    let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (this.isWeChat()) {
      this.$i18n.locale = "zh";
    }
    this.isLocaleCN = this.$i18n.locale === "zh";
    document.title = this.$t("pageTitle");
    window.dateFormat = this.$t("dateFormat");
    // random welcome message
    this.launchIndicator = this.$t("launchIndicator")[
      Math.floor(Math.random() * this.$t("launchIndicator").length)
    ];
    
    this.updateCountryList(countryList)

    const lastCountry = localStorage.getItem("lastCountry");
    if (lastCountry) {
      this.switchCountry(lastCountry);
    } else {
      this.initLocation(timeZone);
    }

    setTimeout(() => {
      this.showWechatPopup = false;
    }, 2000);
  },
  methods: {
    async initLocation(timezone) {
      if (timezone.includes("Europe/London") || this.isMiniApp) {
        this.currentCountry = this.countryList[1];
      } else if (timezone.includes("America")) {
        this.currentCountry = this.countryList[3];
      } else {
        this.currentCountry = this.countryList[0];
      }
      this.switchCountry(this.currentCountry);
      window.ga(
        "send",
        "event",
        "timezone-acquired",
        this.currentCountry,
        timezone
      );
    },
    loadGlobalData(){
      return new Promise((resolve, reject) =>{
        console.time("fetch");
        let performanceTimeStart = performance.now();
        fetch("https://uk.henryz.cc/covid/api.php")
          .then(async (res) => {
            console.timeEnd("fetch");
            let data = await res.json();
            let resTime = Math.round(performance.now() - performanceTimeStart);
            console.log(data);
            this.dataUs = data.us;
            this.dataGlobal = data.global;
            this.lastUpdated = `Data updated ${moment(
              data.global.confirmed.last_updated
            ).fromNow()}, data is ${data.isUpToDate ? "" : "NOT"} up to date.
                              Data might not reflect the real number, and might be delayed.`;
            //global data
            console.time("getGlobalHistoryTableData");
            setImmediate(() => {
              this.tableData.global = getGlobalHistoryTableData(
                this.dataGlobal,
                false,
                true
              );
            });
            console.timeEnd("getGlobalHistoryTableData");
            let countryArr = getAllCountries(this.dataGlobal.confirmed.locations);
            this.updateCountryList(countryArr)

            let performanceTime = Math.round(
              performance.now() - performanceTimeStart
            );
            console.log("Data loaded", resTime, performanceTime);
            window.ga(
              "send",
              "event",
              "net-request",
              "initial-fetch-loaded",
              `${this.currentCountry};${resTime};${performanceTime};`
            );
            resolve()
          })
          .catch((err) => {
            this.networkError = true;
            console.error(err);
            window.ga(
              "send",
              "event",
              "net-request",
              "errored",
              `initial-load-failed`
            );
            reject()
          });
      })
    },
    async switchCountry (e) {
      console.time("switchCountry");
      this.shouldRender = false;
      this.chartData = null;
      this.currentCountry = e;
      localStorage.setItem("lastCountry", e);
      window.ga("send", "event", "country", "country-changed", e);

      if(!this.dataGlobal && e !== this.countryList[1]){
        await this.loadGlobalData();
      }

      if (e === this.countryList[0]) {
        this.loadCountryData("world");
      } else if (e === this.countryList[1] || e === "United Kingdom") {
        this.loadUkData();
      } else if (e === this.countryList[2] || e === "US") {
        await this.loadUsData();
      } else {
        this.loadCountryData(e);
      }
      this.forceReload();
      this.getNavScrollAnchor();
      console.timeEnd("switchCountry");
    },
    async loadCountryData(countryName) {
      this.shouldRender = false;
      this.countryName = countryName;
      let countryData = getCountryData(this.dataGlobal, countryName);
      this.dataCurrent = {};
      //history data
      if (countryName === "US") {
        this.tableData.country = await getUSRegionData(this.dataUs);
      } else {
        this.tableData.country =
          countryName === "world"
            ? null
            : getGlobalHistoryTableData(countryData, true);
      }
      this.dataCurrent.history = getCountryHistoryData(countryData);
      this.startDate = moment(this.dataCurrent.history[0].date).format(
        window.dateFormat
      );
      this.endDate = moment(
        this.dataCurrent.history[this.dataCurrent.history.length - 1].date
      ).format(window.dateFormat);
      this.currentDate = this.endDate;
      this.calculateDisplay(this.dataCurrent.history.length - 1);
    },
    async loadUsData() {
      await this.loadCountryData("US");
      this.forceReload();
    },
    async calculateDisplay(idx) {
      let current = this.dataCurrent.history[idx];
      let last = this.dataCurrent.history[idx - 1]
        ? this.dataCurrent.history[idx - 1]
        : current;
      this.display = {
        confirmed: current.confirmed,
        confirmedChange: current.confirmed - last.confirmed,
        deaths: current.death,
        deathsChange: current.death - last.death,
        tested: current.tested,
        testedChange: current.tested ?? current.tested - last.tested,
        cured: current.cured,
        curedChange: current.cured - last.cured,
      };
    },
    async loadUkData() {
      if(!this.isUkRealtime) this.loadCountryData("United Kingdom");
      this.countryName = "UK";
      this.dataCurrent.uk = {};
      fetch("https://uk.henryz.cc/covid/uk.php").then(async (res) => {
        let data = await res.json();
        console.log(data);
        this.dataUk = data;
        this.dataCurrent.uk.nation = data.nation.data;
        const utla = data.utla.data;
        this.dataCurrent.uk.utla = utla;
        this.tableData.uk = utla;
        this.sortedRegionData = [...utla].sort(
          (a, b) => b.confirmed - a.confirmed
        );
        this.loadUkRealtimeDisplay()
      });
    },
    async loadAdditionalUkAndGlobalData(){
      await this.loadGlobalData();
      this.loadCountryData("United Kingdom");
      await this.loadUkData();
      this.forceReload();
    },
    loadUkRealtimeDisplay() {
      let latest = this.dataUk.latest;
      this.display = {
        confirmed: latest.confirmed,
        confirmedChange: latest.confirmedNew,
        deaths: latest.death,
        deathsChange: latest.deathNew,
        admission: latest.hospitalCases,
        admissionChange: latest.admissionsNew,
      };
      this.chartData = this.dataUk.overview.data.reverse();
    },
    changeDateIdx(idx) {
      this.calculateDisplay(idx);
    },
    changeDate(date) {
      this.currentDate = date;
    },
    onTMDragEnd(idx) {
      this.chartData = this.dataCurrent.history.slice(0, idx);
      this.mainDate = this.currentDate;
      window.ga("send", "event", "time-machine", "drag-end", idx);
    },
    revertTM() {
      this.currentDate = this.endDate;
      this.chartData = this.dataCurrent.history;
      this.calculateDisplay(this.dataCurrent.history.length - 1);
      window.ga("send", "event", "time-machine", "reverted", this.endDate);
    },
    changeLang(lang) {
      this.$i18n.locale = lang;
      this.isLocaleCN = this.$i18n.locale === "zh";
      document.title = this.$t("pageTitle");
      this.switchCountry(this.currentCountry);
    },
    forceReload() {
      //force reload
      this.shouldRender = false;
      this.$nextTick(() => {
        this.shouldRender = true;
      });
    },
    updateCountryList(countryArr){
      this.countryList = [
            this.$t("selector.world"),
            this.$t("selector.uk"),
            this.$t("selector.us"),
            ...countryArr,
          ];
    },
    isWeChat() {
      let ua = window.navigator.userAgent.toLowerCase();
      return ua.match(/MicroMessenger/i) == "micromessenger";
    },
    getNavScrollAnchor() {
      document.addEventListener("scroll", () => {
        if (this.$refs["navPlaceholder"]) {
          if (window.scrollY > this.$refs["navPlaceholder"].offsetTop) {
            this.$refs["nav"].classList.add("fixed_nav");
            this.$refs["navPlaceholder"].classList.add("navPlaceholder");
          } else {
            this.$refs["nav"].classList.remove("fixed_nav");
            this.$refs["navPlaceholder"].classList.remove("navPlaceholder");
          }
        }
      });

      let checkLayout = () => {
        this.isDesktop = window.innerWidth > 1200;
        this.desktopLayout = window.innerWidth > 1400;
      };

      window.onresize = checkLayout;
      checkLayout();
    },
  },
  computed: {
    isMiniApp() {
      // WeChat Mini app
      let url = new URL(window.location.href);
      let query = url.searchParams.get("source");
      return query === "apptab";
    },
    isCurrentUk() {
      return (
        this.currentCountry === "United Kingdom" ||
        this.currentCountry.includes("UK Realtime") ||
        this.currentCountry === this.$t("selector.uk")
      );
    },
    isUkRealtime() {
      return this.currentCountry === this.countryList[1];
    },
    renderAll() {
      return this.dataCurrent && this.shouldRender && this.hasTableData;
    },
    hasTableData() {
      if(this.isUkRealtime){
        return this.tableData.uk;
      }
      return (
        this.tableData.global &&
        !(this.currentCountry === "US" && !this.tableData.country)
      );
    },
  },
  watch: {
    desktopLayout() {
      this.forceReload();
    },
  },
};
</script>

<style scoped>
.vertical-center {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

h6 {
  padding-left: 20px;
}

.covid_header {
  padding: 20px 10px;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header_title {
  opacity: 0.5;
}

.fix_bottom {
  position: fixed;
  bottom: 20px;
  width: 100%;
  background: deepskyblue;
  color: white;
  line-height: 40px;
  text-align: center;
  transition: 2s;
  z-index: 100;
  max-width: 500px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 6px;
}

.select {
  width: 190px;
}

.mContentDesktop {
  max-width: 100%;
}

.mSectionDesktop {
  width: 30vw;
  margin: 1.3vw;
  padding-top: 0;
}

.disabled {
  opacity: 0.5;
}

@media only screen and (max-width: 600px) {
  .covid_header {
    padding: 20px 10px;
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-end;
  }

  .header_title h2 {
    font-size: 30px;
  }

  .header_title h3 {
    font-size: 25px;
  }

  .fix_bottom {
    max-width: 100%;
    margin-bottom: 0px;
    left: 0;
    bottom: 0;
    transform: none;
    border-radius: 0;
  }
}

.hide-popup {
  bottom: -40px;
  opacity: 0;
}
</style>
