<template>
  <div>
    <div class="title">Trend Analysis</div>
    <n-spin :show="loading">
      <div class="block">
        <Selector :types="chartTypes" v-model="selectedType" />
        <n-empty
          v-if="!currentTimeSeries && !loading"
          class="empty"
          description="No data yet"
        />
        <Chart
          v-else-if="currentTimeSeries"
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
      chartTypes: [
        "cases",
        "deaths",
        "recovered",
        "active"
      ],
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