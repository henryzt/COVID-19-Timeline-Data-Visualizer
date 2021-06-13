<template>
  <v-chart class="chart" :option="option" />
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
  DataZoomSliderComponent,
  ToolboxComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, defineComponent } from "vue";
import { getChartOption } from "../utils/chart";

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
  DataZoomSliderComponent,
  ToolboxComponent,
]);

export default defineComponent({
  name: "Chart",
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: "light",
  },
  props: {
    timeSeries: {
      type: Object,
      default: null,
    },
    dataType: {
      type: String,
      default: "cases",
    },
    type: {
      type: String,
      default: "full",
    },
  },
  data() {
    return {
      option: {},
    };
  },
  mounted() {
    this.updateChart();
  },
  watch: {
    timeSeries() {
      this.updateChart();
    },
  },
  computed: {
    color() {
      const colors = {
        cases: "#ff5151",
        deaths: "#4b3077",
        recovered: "#28ca00",
        active: "#ff7300",
      };
      return colors[this.dataType] ?? "#3a4de9";
    },
  },
  methods: {
    updateChart() {
      if (!this.timeSeries) return;
      this.option = getChartOption(
        this.type,
        this.timeSeries,
        this.dataType,
        this.color
      );
    },
  },
});
</script>

<style scoped>
.chart {
  height: 400px;
}
.empty {
  height: 100%;
}
</style>
