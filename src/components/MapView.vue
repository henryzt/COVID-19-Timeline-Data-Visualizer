<template>
  <n-spin :show="loading">
    <div v-if="render">
      <v-chart ref="chart" class="chart" :option="option" :updateOptions="{ notMerge: true }" />
      <Selector class="center" :types="['mapView', 'barView']" v-model="viewType" />
    </div>
    <n-empty v-else class="empty" :description="$t('noData')" />
  </n-spin>
</template>

<script>
import { use, registerMap } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { UniversalTransition } from "echarts/features";
import { MapChart } from "echarts/charts";
import Selector from "./Selector.vue";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { NSpin, NEmpty } from "naive-ui";

use([
  CanvasRenderer,
  MapChart,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
  UniversalTransition,
]);

const tooltip = {
  trigger: "item",
  showDelay: 0,
  transitionDuration: 0.2,
  formatter: function (params) {
    var value = (params.value + "").split(".");
    value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, "$1,");
    return params.seriesName + "<br/>" + params.name + ": " + value;
  },
};

const toolbox = {
  show: true,
  left: "right",
  top: "top",
  feature: {
    dataView: { readOnly: false },
    saveAsImage: {},
  },
};

export default {
  components: {
    VChart,
    NSpin,
    NEmpty,
    Selector,
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
    isLocal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      option: {},
      render: true,
      loading: true,
      viewType: "mapView",
    };
  },
  mounted() {
    this.register();
  },
  watch: {
    dataType() {
      this.updateChart();
    },
    tableData() {
      this.register();
    },
    viewType() {
      // this.$refs.chart.clear();
      this.updateChart();
    },
  },
  computed: {
    mapFile() {
      const country = this.country === "all" ? "Global" : this.country;
      return this.isLocal ? country : "Global";
    },
  },
  methods: {
    register() {
      this.loading = true;
      fetch(`/maps/${this.mapFile}.json`)
        .then((response) => response.json())
        .then((mapJson) => {
          let offset = null;
          if (this.mapFile === "USA") {
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
          registerMap(this.mapFile, mapJson, offset);
          this.updateChart();
        });
    },
    updateChart() {
      if (!this.tableData || !(this.dataType in this.tableData[0])) {
        this.loading = false;
        this.render = false;
        return;
      }
      const mapData = this.tableData.map((e) => ({
        name: e.locationName,
        value: e[this.dataType],
      }));

      if (this.viewType === "mapView") {
        this.loadMapOption(mapData);
      } else {
        this.loadBarOption(mapData);
      }
      this.render = true;
      this.loading = false;
    },
    loadBarOption(mapData) {
      const barData = mapData
        .sort(function (a, b) {
          return a.value - b.value;
        })
        .slice(-40);
      this.option = {
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          axisLabel: {
            rotate: 30,
          },
          data: barData.map(function (item) {
            return item.name;
          }),
        },
        tooltip,
        toolbox,
        animationDurationUpdate: 1000,
        series: {
          type: "bar",
          id: "cases",
          name: this.$t(`type.${this.dataType}`),
          data: barData.map(function (item) {
            return item.value;
          }),
          universalTransition: true,
        },
      };
    },
    loadMapOption(mapData) {
      const minItem = mapData.reduce((prev, curr) => (prev.value < curr.value ? prev : curr));
      const maxItem = mapData.reduce((prev, curr) => (prev.value < curr.value ? curr : prev));

      this.option = {
        tooltip,
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
        toolbox,
        series: [
          {
            name: this.$t(`type.${this.dataType}`),
            type: "map",
            roam: true,
            map: this.mapFile,
            id: "cases",
            animationDurationUpdate: 1000,
            universalTransition: true,
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
  height: 430px;
}

.center {
  text-align: center;
}
</style>
