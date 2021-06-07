<template>
  <div class="main-content">
    <Header :country-list="countryList" v-model="selectedCountry" />
    <MainNumbers :overview-data="overviewData" />
    <ChartSection />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "./components/Header.vue";
import MainNumbers from "./components/MainNumbers.vue";
import ChartSection from "./components/ChartSection.vue";
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
  },
  data() {
    return {
      overviewData: null,
      allCountryData: null,
      countryList: [],
      selectedCountry: "all",
    };
  },
  async mounted() {
    this.countryList = getCountryList([]);
    this.overviewData = await getOverviewData(this.selectedCountry);
    this.allCountryData = await getAllCountryData();
    this.countryList = getCountryList(this.allCountryData);
  },
  watch: {
    async selectedCountry(country) {
      this.overviewData = await getOverviewData(this.selectedCountry);
    },
  },
});
</script>

<style>
</style>
