<template>
  <div class="main-content fade-in">
    <Header :country-list="countryList" v-model="selectedCountry" />
    <MainNumbers
      :loading="!loaded.overviewData"
      :overview-data="overviewData"
      :all-time-series="loaded.timeSeries ? timeSeries : null"
    />
    <ChartSection :loading="!loaded.timeSeries" :all-time-series="timeSeries" />
    <ChartSection
      :loading="!loaded.timeSeries"
      :all-time-series="timeSeries"
      :is-daily="true"
    />
    <TableSection
      :loading="!loaded.allCountryData"
      :all-country-data="allCountryData"
    />
    <Credits />
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
      overviewData: null,
      timeSeries: null,
      allCountryData: null,
      countryList: [],
      selectedCountry: "all",
      loaded: {
        overviewData: false,
        timeSeries: false,
        allCountryData: false,
      },
    };
  },
  async mounted() {
    // this.$i18n.locale = "zh";

    this.countryList = getCountryList([]);
    this.updateCountryData();
    this.allCountryData = await getAllCountryData();
    this.loaded.allCountryData = true;
    this.countryList = getCountryList(this.allCountryData);
  },
  watch: {
    selectedCountry() {
      this.updateCountryData();
    },
  },
  methods: {
    async updateCountryData() {
      this.loaded.overviewData = false;
      this.loaded.timeSeries = false;
      this.overviewData = await getOverviewData(this.selectedCountry);
      this.loaded.overviewData = true;
      this.timeSeries = await getTimeSeries(this.selectedCountry);
      this.loaded.timeSeries = true;
    },
  },
});
</script>

<style>
</style>
