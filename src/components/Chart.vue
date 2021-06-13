<template>
  <v-chart class="chart" :option="option" />
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { graphic } from "echarts/core";
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

      if (this.type == "full") {
        this.fullLineChart();
      } else if (this.type == "minimum") {
        this.minimumLineChart();
      }
    },
    minimumLineChart() {
      const timeSeries = this.timeSeries;
      const labels = Object.keys(timeSeries);
      const data = Object.values(timeSeries);

      const option = {
        xAxis: {
          show: false,
          type: "category",
          data: labels,
        },
        yAxis: {
          show: false,
          type: "value",
          axisLabel: {
            formatter: function (value) {
              return value >= 100000 ? value.toExponential() : value;
            },
          },
        },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          right: 0,
          left: 0,
          top: 0,
          bottom: 0,
          height: 150,
        },
        series: [
          {
            name: this.dataType,
            data: data,
            type: "line",
            itemStyle: {
              color: this.color,
            },
            lineStyle: {
              color: this.color,
            },
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: this.color + "a0", // hex rgba
                },
                {
                  offset: 1,
                  color: this.color + "09",
                },
              ]),
            },
          },
        ],
      };

      this.option = option;
    },
    fullLineChart() {
      const timeSeries = this.timeSeries;
      const labels = Object.keys(timeSeries);
      const data = Object.values(timeSeries);

      const option = {
        xAxis: {
          type: "category",
          data: labels,
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: function (value) {
              return value >= 100000 ? value.toExponential() : value;
            },
          },
        },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          right: 5,
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
          },
        },
        dataZoom: [
          {
            type: "inside",
            start: 50,
            end: 100,
          },
          {
            start: 0,
            end: 100,
          },
        ],
        series: [
          {
            name: this.dataType,
            data: data,
            type: "line",
            itemStyle: {
              color: this.color,
            },
            lineStyle: {
              color: this.color,
            },
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: this.color + "a0", // hex rgba
                },
                {
                  offset: 1,
                  color: this.color + "09",
                },
              ]),
            },
          },
        ],
      };

      this.option = option;
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
