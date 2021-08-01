<template>
  <v-chart class="chart" :option="option" />
</template>

<script>
import { use, registerMap } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { MapChart } from "echarts/charts";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";

use([
  CanvasRenderer,
  MapChart,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
]);

export default {
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: "light",
  },
  props: {
    tableData: {
      type: Array,
      default: [],
    },
    dataType: {
      type: String,
      default: "total",
    },
    country: {
      type: String,
      default: "all",
    },
  },
  data() {
    return {
      option: {},
      render: true,
    };
  },
  mounted() {
    this.register();
  },
  watch: {
    dataType() {
      this.register();
    },
  },
  methods: {
    register() {
      fetch("/maps/global.json")
        .then((response) => response.json())
        .then((mapJson) => {
          let offset = null;
          if (this.country === "usa") {
            offset = {
              Alaska: {
                left: -131,
                top: 25,
                width: 15,
              },
              Hawaii: {
                left: -110,
                top: 28,
                width: 5,
              },
              "Puerto Rico": {
                left: -76,
                top: 26,
                width: 2,
              },
            };
          }
          registerMap(this.country, mapJson, offset);
          this.updateChart();
        });
    },
    updateChart() {
      if (!this.tableData) return;
      const mapData = this.tableData.map((e) => ({
        name: e.locationName,
        value: e[this.dataType],
      }));
      const minItem = mapData.reduce((prev, curr) =>
        prev.value < curr.value ? prev : curr
      );
      const maxItem = mapData.reduce((prev, curr) =>
        prev.value < curr.value ? curr : prev
      );
      this.option = {
        title: {
          text: "USA Population Estimates",
          left: "right",
        },
        tooltip: {
          trigger: "item",
          showDelay: 0,
          transitionDuration: 0.2,
          formatter: function (params) {
            var value = (params.value + "").split(".");
            value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, "$1,");
            return params.seriesName + "<br/>" + params.name + ": " + value;
          },
        },
        visualMap: {
          left: "right",
          min: minItem.value,
          max: maxItem.value,
          inRange: {
            color: [
              "#313695",
              "#4575b4",
              "#74add1",
              "#abd9e9",
              "#e0f3f8",
              "#ffffbf",
              "#fee090",
              "#fdae61",
              "#f46d43",
              "#d73027",
              "#a50026",
            ],
          },
          text: ["High", "Low"], 
          calculable: true,
        },
        toolbox: {
          show: true,
          //orient: 'vertical',
          left: "left",
          top: "top",
          feature: {
            dataView: { readOnly: false },
            saveAsImage: {},
          },
        },
        series: [
          {
            name: this.$t(`type.${this.dataType}`),
            type: "map",
            roam: true,
            map: this.country,
            emphasis: {
              label: {
                show: true,
              },
            },
            data: mapData,
          },
        ],
      };
    },
  },
};
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>