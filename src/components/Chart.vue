<template>
  <div class="mBlock">
    <div class="btn-group center" role="group" aria-label="date range">
      <button type="button" class="btn btn-secondary" onclick="renderConfirmedChart(-7,true)">
        一周内
      </button>
      <button type="button" class="btn btn-secondary" onclick="renderConfirmedChart(-31,false)">
        一个月内
      </button>
      <button
        type="button"
        class="btn btn-secondary active"
        onclick="renderConfirmedChart(0,false)"
      >
        全部数据
      </button>
    </div>

    <VueApexCharts width="500" type="line" :options="options" :series="series"></VueApexCharts>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

// written by https://github.com/DaviesXue/UCLCSSA_COVID19

// function renderConfirmedChart(range, showLabel) {
//   app.confirmedAndDeathChart = {};
// }

export default {
  name: "Chart",
  components: {
    VueApexCharts
  },
  props: {seriesData: Array, range: Number, dataHistory:Array},
  data: function () {
    return {
      series: this.seriesData,
      options: {
        chart: {
          id: "confirmedAndDeathChart",
          height: 350,
          type: "line",
          zoom: {
            enabled: true
          }
        },
        colors: ["#3d0707", "#ff0000"],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth"
        },

        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: {
          type: "datetime",
          categories: this.dataHistory
            .map(a => {
              return a.date;
            })
            .slice(this.range),
          labels: {
            format: "dd/MM",
            rotate: -10
          }
        }
      }
    };
  }
};
</script>

<style scoped></style>
