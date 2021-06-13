<template>
  <div>
    <div class="title">Trend Analysis</div>
    <n-spin :show="loading">
      <div v-if="!currentTimeSeries" class="block">
        <n-empty v-if="!loading" class="empty" description="No data yet" />
      </div>
      <div v-else class="block">
        <Selector :types="chartTypes" v-model="selectedType" />
        <Chart
          :time-series="currentTimeSeries"
          :data-type="selectedType"
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
    NSpin,
    NEmpty,
  },
  computed: {
    currentTimeSeries() {
      return this.allTimeSeries?.[this.selectedType];
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