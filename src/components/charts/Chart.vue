<template>
  <div :class="{ mBlock: !minimum }">
    <div class="btn-group-wrap" v-if="!minimum">
      <div class="btn-group btn-group-sm" role="group" aria-label="date range">
        <button
          type="button"
          class="btn btn-secondary"
          :class="{ active: range === -14 }"
          @click="updateRange(-14, true)"
        >
          {{ $t("chartTimes.twoWeek") }}
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          :class="{ active: range === -31 }"
          @click="updateRange(-31, false)"
        >
          {{ $t("chartTimes.oneMonth") }}
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          :class="{ active: range === -93 }"
          @click="updateRange(-93, false)"
        >
          {{ $t("chartTimes.threeMonth") }}
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          :class="{ active: range === 0 }"
          @click="updateRange(0, false)"
        >
          {{ $t("chartTimes.all") }}
        </button>
      </div>
    </div>

    <VueApexCharts
      width="100%"
      :height="minimum ? '160px' : undefined"
      :type="type"
      :options="options"
      :series="series"
    ></VueApexCharts>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

// written by https://github.com/DaviesXue/UCLCSSA_COVID19

export default {
  name: "Chart",
  components: {
    VueApexCharts,
  },
  props: {
    seriesData: Array,
    dataHistory: Array,
    id: String,
    type: String,
    colors: Array,
    stacked: Boolean,
    minimum: Boolean,
  },
  data: function () {
    return {
      showLabel: false,
      range: 0,
    };
  },
  methods: {
    updateRange(range, showLabel) {
      this.range = range;
      this.showLabel = showLabel;
      window.ga("send", "event", "chart", "range-updated", range);
    },
  },
  computed: {
    stroke(){
      return this.type=='line' || this.type=='area'
    },
    series() {
      return this.seriesData.map((a) => {
        a.originalData = a.originalData ? a.originalData : a.data;
        a.data = a.originalData.slice(this.range);
        return a;
      });
    },
    options() {
      return {
        chart: {
          id: this.id,
          type: this.type ? this.type : "line",
          stacked: this.stacked,
          zoom: {
            enabled: window.innerWidth > 800 && !this.minimum,
          },
          animations: {
            enabled: false,
            // TODO Performace or animation
          },
          toolbar: {
            show: !this.minimum,
          },
        },
        colors: this.colors ? this.colors : ["#ff0000", "#3d0707"],
        dataLabels: {
          enabled: this.showLabel,
          textAnchor: "middle",
          dropShadow: {
            enabled: true,
          },
          style: {
            fontSize: "12px",
          },
        },
        stroke: {
          show: this.stroke,
          width: !this.stroke || this.minimum ? 2 : 4,
        },
        grid: {
          show: !this.minimum,
          row: {
            colors: this.minimum ? [] : ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          type: "datetime",
          categories: this.dataHistory
            .map((a) => {
              return a.date;
            })
            .slice(this.range),
          labels: {
            show: !this.minimum,
            format: "MM/dd",
            rotate: -10,
          },
          lines: {
            show: !this.minimum,
          },
          axisBorder: {
            show: !this.minimum,
          },
          axisTicks: {
            show: !this.minimum,
          },
        },
        yaxis: {
          lines: {
            show: !this.minimum,
          },
          labels: {
            show: !this.minimum,
          },
        },
      };
    },
  },
};
</script>

<style scoped></style>
