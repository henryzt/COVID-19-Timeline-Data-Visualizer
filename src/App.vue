<template>
  <div class="main-content">
    <Header />
    <MainNumbers :overview-data="overviewData"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "./components/Header.vue";
import MainNumbers from "./components/MainNumbers.vue";
import { getAllCountryData, getOverviewData, getTimeSeries } from "./utils/api";

export default defineComponent({
  name: "App",
  components: {
    Header,
    MainNumbers,
  },
  data(){
    return {
      overviewData: null,
      allCountryData: null,
    }
  },
  async mounted() {
    this.overviewData = await getOverviewData("all");
    this.allCountryData = await getAllCountryData();
  },
});
</script>

<style>
</style>
