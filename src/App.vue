<template>
  <div class="main-content">
    <Header :country-list="countryList"/>
    <MainNumbers :overview-data="overviewData" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "./components/Header.vue";
import MainNumbers from "./components/MainNumbers.vue";
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
  },
  data() {
    return {
      overviewData: null,
      allCountryData: null,
      countryList: [],
    };
  },
  async mounted() {
    this.countryList = getCountryList([]);
    this.overviewData = await getOverviewData("all");
    this.allCountryData = await getAllCountryData();
    this.countryList = getCountryList(this.allCountryData);
  },
});
</script>

<style>
</style>
