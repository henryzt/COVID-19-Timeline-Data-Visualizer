<template>
  <div id="app">
    <div class="mContent" v-if="dataGlobal" :class="{mContentDesktop: desktopLayout}">
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
            :dataUk="dataCurrent.uk"
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
          <div v-if="renderAll && endDate">
            <div class="title">{{ $t('subtitles.timeMachine') }}</div>
            <div class="mBlock">
              <SlideController
                :start-date="startDate"
                :end-date="endDate"
                :hidePlayButton="true"
                :disableClick="true"
                :current-date="currentDate"
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

          <!-- charts (show on desktop layout) -->
          <div class="mSection" v-if="renderAll && desktopLayout" style="padding-top: 0">
            <ChartSection
              :chart-data="chartData ? chartData : dataCurrent.history"
              :is-uk="isCurrentUk"
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
              <a class="nav-link" href="#animation">{{ $t('nav.animation') }}</a>
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
              :is-uk="isCurrentUk"
            ></ChartSection>
          </div>

          <!-- animations -->
          <div class="mSection" :class="{'mSectionDesktop': desktopLayout}" id="animation">
            <div class="title">{{ $t('subtitles.historyAnimation') }}</div>
            <BarRaceSection v-if="hasTableData" :table-data="tableData"></BarRaceSection>
            <div class="title">{{ $t('subtitles.ratio') }}</div>
            <PieSection
              v-if="dataCurrent.history"
              :allHistoryData="dataCurrent.history"
              :mainDate="mainDate"
            ></PieSection>
            <div class="title">{{ $t('subtitles.countryCompare') }}</div>
            <CountryCompareSection :global-data="dataGlobal" :country-list="countryList"></CountryCompareSection>
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
              :is-uk="isCurrentUk"
              @expanded="hideFab=$event"
              @switchCountry="switchCountry"
              :current-country="currentCountry"
              :desktop-layout="desktopLayout"
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
import TodayNumberSection from "./components/TodayNumberSection.vue";
import UkRegionSection from "./components/UkRegionSection.vue";
import SlideController from "./components/SlideController.vue";
import NearbyCasesFinder from "./components/NearbyCasesFinder.vue";
import FAB from "./components/FAB.vue";
import Credits from "./components/Credits.vue";
import Loading from "./components/Loading.vue";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

const RegionTable = () => ({
  component: import("./components/RegionTable.vue"),
  loading: Loading,
});
const BarRaceSection = () => ({
  component: import("./components/BarRaceSection.vue"),
  loading: Loading,
});
const MapSection = () => ({
  component: import("./components/MapSection.vue"),
  loading: Loading,
});
const ChartSection = () => ({
  component: import("./components/ChartSection.vue"),
  loading: Loading,
});
const CountryCompareSection = () => ({
  component: import("./components/CountryCompareSection.vue"),
  loading: Loading,
});
const PieSection = () => ({
  component: import("./components/PieSection.vue"),
  loading: Loading,
});

import {
  getGlobalHistoryTableData,
  getAllCountries,
  getCountryData,
  getCountryHistoryData,
  getUSRegionData,
} from "./js/locationUtils";

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
  },
  data: () => {
    return {
      shouldRender: true,
      dataCurrent: null,
      dataUk: null,
      dataGlobal: null,
      sortedRegionData: null,
      section: 0,
      currentCountry: null,
      countryList: [],
      display: {
        confirmed: 298325,
        confirmedChange: 0,
        deaths: 235,
        deathsChange: 0,
        tested: 453,
        testedChange: 0,
        cured: 0,
        curedChange: 0,
      },
      tableData: {
        country: null,
        global: null,
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
    };
  },
  async mounted() {
    window.dateFormat = "DD MMM";
    let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (this.isWeChat()) {
      this.$i18n.locale = "zh";
    }
    // miniapp china redirect
    // if (this.isMiniApp && timeZone == "Asia/Shanghai") {
    //     window.location.replace("https://uclcssa.cn/public/covid_redirect.html");
    //     window.ga('send', 'event', "china-redirected", "mini-app-tab", "");
    //     return;
    // }
    this.isLocaleCN = this.$i18n.locale === "zh";
    document.title = this.$t("pageTitle");
    window.dateFormat = this.$t("dateFormat");
    this.launchIndicator = this.$t("launchIndicator")[
      Math.floor(Math.random() * this.$t("launchIndicator").length)
    ];

    console.time("fetch");
    let performanceTimeStart = performance.now();
    fetch("https://uk.henryz.cc/covid/api.php")
      .then(async (res) => {
        console.timeEnd("fetch");
        let data = await res.json();
        let resTime = Math.round(performance.now() - performanceTimeStart);
        console.log(data);
        this.dataUs = data.us;
        this.dataUk = data.uk;
        this.dataGlobal = data.global;
        // console.log(data);
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
        this.countryList = [
          this.$t("selector.world"),
          this.$t("selector.uk"),
          this.$t("selector.us"),
          ...countryArr,
        ];
        const lastCountry = localStorage.getItem("lastCountry");
        if (lastCountry) {
          this.switchCountry(lastCountry);
        } else {
          this.initLocation(timeZone);
        }

        this.getNavScrollAnchor();
        let performanceTime = Math.round(
          performance.now() - performanceTimeStart
        );
        console.log("Data loaded", resTime, performanceTime);
        window.ga(
          "send",
          "event",
          "net-request",
          "initial-fetch-loaded",
          `country-${this.currentCountry};loaded-${resTime}ms;calculated-${performanceTime}ms;`
        );
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
      });

    setTimeout(() => {
      this.showWechatPopup = false;
    }, 2000);
  },
  methods: {
    initLocation: async function (timezone) {
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
    switchCountry: async function (e) {
      console.time("switchCountry");
      this.shouldRender = false;
      // console.log(e);
      this.chartData = null;
      this.currentCountry = e;
      localStorage.setItem("lastCountry", e);
      window.ga("send", "event", "country", "country-changed", e);

      if (e === this.countryList[0]) {
        this.loadCountryData("world");
      } else if (e === this.countryList[1]) {
        this.loadUkData();
      } else if (e === this.countryList[2] || e === "US") {
        await this.loadUsData();
      } else {
        this.loadCountryData(e);
      }
      this.forceReload();
      console.timeEnd("switchCountry");
    },
    loadCountryData: async function (countryName) {
      this.shouldRender = false;
      this.countryName = countryName;
      let countryData = getCountryData(this.dataGlobal, countryName);
      // console.log(countryData.confirmed.locations);
      this.dataCurrent = {};
      //history data
      //console.log("data loaded", countryData);
      if (countryName === "US") {
        this.tableData.country = await getUSRegionData(this.dataUs);
      } else {
        this.tableData.country =
          countryName === "world"
            ? null
            : getGlobalHistoryTableData(countryData, true);
      }
      this.dataCurrent.history = getCountryHistoryData(countryData);
      // console.log("country loaded", this.dataCurrent);
      this.startDate = moment(this.dataCurrent.history[0].date).format(
        window.dateFormat
      );
      this.endDate = moment(
        this.dataCurrent.history[this.dataCurrent.history.length - 1].date
      ).format(window.dateFormat);
      this.currentDate = this.endDate;
      this.calculateDisplay(this.dataCurrent.history.length - 1);
    },
    loadUsData: async function () {
      this.loadCountryData("US");
    },
    calculateDisplay: async function (idx) {
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
    loadUkData: async function () {
      this.loadCountryData("United Kingdom");
      this.countryName = "UK";
      this.dataCurrent.uk = {};
      this.dataCurrent.uk.nation = this.dataUk.nation.data;
      const apiUrl =
        "https://api.coronavirus.data.gov.uk/v1/data?filters=areaType%3Dutla&latestBy=date"+
        "&structure=%7B%22date%22:%22date%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22"+
        "areaCode%22,%22hospitalCases%22:%22hospitalCases%22,%22covidOccupiedMVBeds%22:"+
        "%22covidOccupiedMVBeds%22,%22cumCasesBySpecimenDateRate%22:%22cumCasesBySpecimenDateRate%22,"+
        "%22newCasesByPublishDate%22:%22newCasesByPublishDate%22,%22cumCasesByPublishDate%22:"+
        "%22cumCasesByPublishDate%22,%22newDeathsByDeathDate%22:%22newDeaths28DaysByPublishDate%22,"+
        "%22cumDeathsByDeathDate%22:%22cumDeaths28DaysByPublishDate%22%7D";
      fetch(apiUrl).then(
        async (res) => {
          let data = await res.json();
          const utla = data.data;
          console.log(utla);
          this.dataCurrent.uk.utla = utla;
          this.tableData.uk = utla;
          this.sortedRegionData = [...utla].sort((a, b) => b.confirmed - a.confirmed);
        }
      );
    },
    changeDateIdx: function (idx) {
      this.calculateDisplay(idx);
    },
    changeDate: function (date) {
      this.currentDate = date;
    },
    onTMDragEnd: function (idx) {
      this.chartData = this.dataCurrent.history.slice(0, idx);
      this.mainDate = this.currentDate;
      window.ga("send", "event", "time-machine", "drag-end", idx);
    },
    revertTM: function () {
      this.currentDate = this.endDate;
      this.chartData = this.dataCurrent.history;
      this.calculateDisplay(this.dataCurrent.history.length - 1);
      window.ga("send", "event", "time-machine", "reverted", this.endDate);
    },
    changeLang: function (lang) {
      this.$i18n.locale = lang;
      this.isLocaleCN = this.$i18n.locale === "zh";
      document.title = this.$t("pageTitle");
      this.countryList[0] = this.$t("selector.world");
      this.countryList[1] = this.$t("selector.uk");
      this.countryList[2] = this.$t("selector.us");
      // this.currentCountry = this.countryList[0];
      this.forceReload();
    },
    forceReload: function () {
      //force reload
      this.shouldRender = false;
      this.$nextTick(() => {
        this.shouldRender = true;
      });
    },
    isWeChat: function () {
      let ua = window.navigator.userAgent.toLowerCase();
      return ua.match(/MicroMessenger/i) == "micromessenger";
    },
    getNavScrollAnchor: function () {
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
    renderAll() {
      return this.dataCurrent && this.shouldRender && this.hasTableData;
    },
    hasTableData() {
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
