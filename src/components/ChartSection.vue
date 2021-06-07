<template>
  <div>
    <div class="title">Trend Analysis</div>
    <div class="block">
      <Chart></Chart>
    </div>
  </div>
</template>

<script>
import Chart from "./Chart.vue";

export default {
  name: "ChartSection",
  components: {
    Chart,
  },
};
</script>

<style scoped>
</style>