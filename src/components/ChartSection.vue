<template>
  <div>
    <div class="title">Trend Analysis</div>
    <n-spin :show="loading">
      <div class="block">
        <Selector :types="dataTypes" v-model="selectedType" />
        <n-empty
          v-if="!currentTimeSeries && !loading"
          class="empty"
          description="No data yet"
        />
        <Chart
          v-else-if="currentTimeSeries"
          :time-series="currentTimeSeries"
          :data-type="selectedType"
          :chart-type="chartType"
        ></Chart>
      </div>
    </n-spin>
  </div>
</template>

<script>
import Chart from "./Chart.vue";
import Selector from "./Selector.vue";
import { NSpin } from "naive-ui";
import { NEmpty } from "naive-ui";

export default {
  name: "ChartSection",
  props: {
    allTimeSeries: {
      type: Object,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    isDaily: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dataTypes: ["cases", "deaths", "recovered", "active"],
      selectedType: "cases",
    };
  },
  components: {
    Chart,
    Selector,
    NSpin,
    NEmpty,
  },
  computed: {
    currentTimeSeries() {
      let timeSeries = this.allTimeSeries?.[this.selectedType];
      if (this.isDaily && timeSeries) {
        const dailyTimeSeries = {};
        const tsEntires = Object.entries(timeSeries);
        let lastNumber = 0;
        for (const [key, value] of tsEntires) {
          console.log(key, value, value - lastNumber)
          dailyTimeSeries[key] = value - lastNumber;
          lastNumber = value;
        }
        return dailyTimeSeries;
      }
      return timeSeries;
    },
    chartType() {
      return this.isDaily ? "bar" : "line";
    },
  },
};
</script>

<style scoped>
.block {
  min-height: 430px;
}

.empty {
  padding-top: 150px;
}
</style>