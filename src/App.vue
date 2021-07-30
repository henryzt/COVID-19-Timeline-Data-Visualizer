<template>
  <div v-if="render" class="main-content fade-in">
    <Header :country-list="countryList" v-model="selectedCountry" />
    <MainNumbers
      :loading="!loaded.overviewData"
      :overview-data="overviewData"
      :all-time-series="loaded.timeSeries ? timeSeries : null"
    />
    <component v-if="localComponent" :is="localComponent" @local-data-ready="handleLocalData"></component>
    <ChartSection :loading="!loaded.timeSeries" :all-time-series="timeSeries" />
    <ChartSection
      :loading="!loaded.timeSeries"
      :all-time-series="timeSeries"
      :is-daily="true"
    />
    <TableSection
      :loading="!loaded.globalTableData"
      :global-table-data="globalTableData"
      :local-table-data="localTableData"
    />
    <Credits @changeLang="changeLang" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "./components/Header.vue";
import MainNumbers from "./components/MainNumbers.vue";
import ChartSection from "./components/ChartSection.vue";
import TableSection from "./components/TableSection.vue";
import Credits from "./components/Credits.vue";
import {
  getAllCountryData,
  getOverviewData,
  getTimeSeries,
  getCountryList,
} from "./utils/api";
import {getLocalComponent} from "./utils/local"

export default defineComponent({
  name: "App",
  components: {
    Header,
    MainNumbers,
    ChartSection,
    TableSection,
    Credits,
  },
  data() {
    return {
      render: true,
      overviewData: null,
      timeSeries: null,
      globalTableData: null,
      localTableData: null,
      countryList: [],
      selectedCountry: "all",
      loaded: {
        overviewData: false,
        timeSeries: false,
        globalTableData: false,
      },
    };
  },
  async mounted() {
    this.initLanguage();
    this.initLocation();
    this.countryList = getCountryList([], this.$t);
    this.updateCountryData();
    this.globalTableData = await getAllCountryData();
    this.loaded.globalTableData = true;
    this.countryList = getCountryList(this.globalTableData, this.$t);
  },
  watch: {
    selectedCountry() {
      this.updateCountryData();
    },
  },
  computed: {
    localComponent(){
      return getLocalComponent(this.selectedCountry)
    }
  },
  methods: {
    async updateCountryData() {
      localStorage.setItem("lastCountry", this.selectedCountry);
      this.localTableData = null;
      this.loaded.overviewData = false;
      this.loaded.timeSeries = false;
      this.overviewData = await getOverviewData(this.selectedCountry);
      this.loaded.overviewData = true;
      this.timeSeries = await getTimeSeries(this.selectedCountry);
      this.loaded.timeSeries = true;
    },
    handleLocalData(data) {
      if("tableData" in data){
        this.localTableData = data.tableData;
      }
    },
    initLocation() {
      let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const lastCountry = localStorage.getItem("lastCountry");
      if (lastCountry) {
        this.selectedCountry = lastCountry;
        return;
      }
      if (timezone.includes("Europe/London")) {
        this.selectedCountry = "UK";
      } else if (timezone.includes("America")) {
        this.selectedCountry = "USA";
      } else {
        this.selectedCountry = "UK"; // "all"
      }
    },
    initLanguage() {
      const lastLang = localStorage.getItem("lastLang");
      if (lastLang) {
        this.changeLang(lastLang);
      }
    },
    changeLang(lang: string) {
      this.$i18n.locale = lang;
      document.title = this.$t("pageTitle");
      if (this.globalTableData) {
        this.countryList = getCountryList(this.globalTableData, this.$t);
      }
      localStorage.setItem("lastLang", lang);
      this.forceReload();
    },
    forceReload() {
      this.render = false;
      this.$nextTick(() => {
        this.render = true;
        window.scrollTo({ top: 0 });
      });
    },
  },
});
</script>

<style>
</style>
