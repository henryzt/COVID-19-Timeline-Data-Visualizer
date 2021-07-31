<template>
  <div>
    <div class="title">{{title}}</div>
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
      type: boolean,
      default: false,
    },
    isDaily: {
      type: Boolean,
      default: false,
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
      const type = this.selectedType + (this.isDaily ? "Daily" : "");
      return this.allTimeSeries?.[type];
    },
    chartType() {
      return this.isDaily ? "bar" : "line";
    },
    title() {
      return this.isDaily ? this.$t("subtitles.daily") : this.$t("subtitles.cumulative") ;
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
