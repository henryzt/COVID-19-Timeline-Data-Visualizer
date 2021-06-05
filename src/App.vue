<template>
  <div class="covid-header">
    <div class="header-title">
      <h2>COVID-19</h2>
      <h3>{{$t('title')}}</h3>
    </div>
  </div>
  <MainNumbers />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MainNumbers from "./components/MainNumbers.vue";
import { getAllCountryData, getTimeSeries } from "./utils/api";

export default defineComponent({
  name: "App",
  components: {
    MainNumbers,
  },
  async mounted() {
    const countryData = await getAllCountryData();
    console.log(countryData);
  },
});
</script>

<style>
</style>
