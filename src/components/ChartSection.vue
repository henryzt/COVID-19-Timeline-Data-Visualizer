<template>
  <div>
    <div class="title">Trend Analysis</div>
    <div class="block">
      <Selector :types="chartTypes" v-model="selectedType" />
      <Chart
        v-if="allTimeSeries"
        :time-series="currentTimeSeries"
        :data-type="selectedType"
      ></Chart>
    </div>
  </div>
</template>

<script>
import Chart from "./Chart.vue";
import Selector from "./Selector.vue";

export default {
  name: "ChartSection",
  props: {
    allTimeSeries: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      chartTypes: ["cases", "deaths", "recovered", "active"],
      selectedType: "cases",
    };
  },
  components: {
    Chart,
    Selector,
  },
  computed: {
    currentTimeSeries() {
      return this.allTimeSeries?.[this.selectedType];
    },
  },
};
</script>

<style scoped>
</style>