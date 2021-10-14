<template>
  <div v-if="render" class="main-content fade-in">
    <Header 
      :override-title="branding?.mainTitle" 
      :country-list="countryList" 
      v-model="selectedCountry" 
    />
    <n-alert
      v-if="errorMsg"
      title="Network Error"
      type="error"
      @on-close="errorMsg = null"
      closable
    >
      {{ errorMsg }}
    </n-alert>
    <MainNumbers
      :loading="!loaded.overviewData"
      :overview-data="overviewData"
      :all-time-series="loaded.timeSeries ? timeSeries : null"
    />
    <!-- additional link -->
    <div v-if="branding?.additionalLink">
      <div class="title">{{ branding.additionalLink.title }}</div>
      <div class="block alink">
        <n-a class="alink" :href="branding.additionalLink.url">
          {{ branding.additionalLink.linkTitle }}
        </n-a>
      </div>
    </div>
    <!-- local component -->
    <component
      v-if="localComponent"
      :is="localComponent"
      @local-data-ready="handleLocalData"
      @error="errorMsg = $event"
    ></component>
    <ChartSection :loading="!loaded.timeSeries" :all-time-series="timeSeries" />
    <ChartSection
      :loading="!loaded.timeSeries"
      :all-time-series="timeSeries"
      :is-daily="true"
    />
    <TableMapSection
      section-type="map"
      :country="selectedCountry"
      :loading="!loaded.globalTableData"
      :global-table-data="globalTableData"
      :local-table-data="localTableData"
    />
    <TableMapSection
      :loading="!loaded.globalTableData"
      :global-table-data="globalTableData"
      :local-table-data="localTableData"
    />
    <Brandings @brandingReady="setBranding" />
    <Credits @changeLang="changeLang" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "./components/Header.vue";
import MainNumbers from "./components/MainNumbers.vue";
import ChartSection from "./components/ChartSection.vue";
import TableMapSection from "./components/TableMapSection.vue";
import Credits from "./components/Credits.vue";
import Brandings from "./components/Brandings.vue";
import {
  getAllCountryData,
  getOverviewData,
  getTimeSeries,
  getCountryList,
  combineVaccineData
} from "./utils/api";
import { getLocalComponent } from "./utils/local";
import { NAlert, NA } from "naive-ui";

interface DataTypes {
  render: boolean,
  overviewData: DataItem | null,
  timeSeries: Timeseries | null,
  globalTableData: DataItem[] | null,
  localTableData: DataItem[] | null,
  countryList: CountryListItem[],
  selectedCountry: string,
  errorMsg: string | null,
  loaded: {
    overviewData: boolean,
    timeSeries: boolean,
    globalTableData: boolean,
  },
  branding: Branding | null,
}

export default defineComponent({
  name: "App",
  components: {
    Header,
    MainNumbers,
    ChartSection,
    TableMapSection,
    Credits,
    NAlert,
    Brandings,
    NA
  },
  data(): DataTypes {
    return {
      render: true,
      overviewData: null,
      timeSeries: null,
      globalTableData: null,
      localTableData: null,
      countryList: [],
      selectedCountry: "all",
      errorMsg: null,
      loaded: {
        overviewData: false,
        timeSeries: false,
        globalTableData: false,
      },
      branding: null,
    };
  },
  async mounted() {
    try {
      this.initLanguage();
      this.initLocation();
      this.countryList = getCountryList([], this.$t);
      this.updateCountryData();
      this.globalTableData = await getAllCountryData();
      this.loaded.globalTableData = true;
      this.countryList = getCountryList(this.globalTableData, this.$t);
      await combineVaccineData(this.globalTableData);
    } catch (error) {
      this.handleError(error.toString());
    }
  },
  watch: {
    selectedCountry() {
      this.updateCountryData();
    },
  },
  computed: {
    localComponent(): unknown {
      return getLocalComponent(this.selectedCountry);
    },
  },
  methods: {
    async updateCountryData() {
      try {
        localStorage.setItem("lastCountry", this.selectedCountry);
        this.localTableData = null;
        this.loaded.overviewData = false;
        this.loaded.timeSeries = false;
        this.overviewData = await getOverviewData(this.selectedCountry);
        this.loaded.overviewData = true;
        this.timeSeries = await getTimeSeries(this.selectedCountry);
        this.loaded.timeSeries = true;
      } catch (error) {
        this.handleError(error.toString());
      }
    },
    handleLocalData(data: LocalData) {
      if ("tableData" in data) {
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
    handleError(error: string) {
      this.errorMsg = error;
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
    setBranding(branding: Branding) {
      this.branding = branding;
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
.alink {
  text-align: center;
  font-size: 1.1em;
  text-decoration: none;
}
</style>
