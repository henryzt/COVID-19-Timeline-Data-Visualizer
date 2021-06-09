<template>
  <div>
    <div class="title">Trend Analysis</div>
    <div class="block">
      <Chart v-if="allTimeSeries" :time-series="currentTimeSeries"></Chart>
    </div>
  </div>
</template>

<script>
import Chart from "./Chart.vue";

export default {
  name: "ChartSection",
  props: {
    allTimeSeries: {
      type: Object,
      default: null
    },
  },
  components: {
    Chart,
  },
  computed: {
    currentTimeSeries() {
      return this.allTimeSeries?.cases 
    }
  },
};
</script>

<style scoped>
</style>