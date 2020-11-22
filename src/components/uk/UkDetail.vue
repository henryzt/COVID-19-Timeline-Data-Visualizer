<template>
  <div>
    <div class="title">{{ $t('dataSwitch.' + type) }}</div>
    <div class="mBlock">
      <div class="uk_numbers">
        <div :class="{[type]: true}">
          <div class="number_title">{{ $t('today') }}</div>
          <div class="number" ref="num"><ICountUp  :options="countOpt" :endVal="latestDaily"/></div>
          <div class="number_title">{{ $t('last7days') }}</div>
          <div class="number"><ICountUp  :options="countOpt" :endVal="latest"/></div>
        </div>
        <div style="max-width:60%">
        <Chart
          id="chart"
          type="area"
          :colors="[colors[type]]"
          :dataHistory="dataUk.overview.data"
          :seriesData="chartData"
          :minimum="true"
        ></Chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ICountUp from 'vue-countup-v2';
import Chart from "../charts/Chart.vue";

export default {
  name: "UkDetail",
  props: ["dataUk", "type"],
  computed: {
    latest(){
      return this.dataUk.latest[this.type];
    },
    latestDaily(){
      return this.dataUk.latest[this.type + "New"];
    },
    chartData() {
      return [
        {
          name: this.$t('daily') + this.$t('dataSwitch.' + this.type),
          data: this.dataUk.overview.data.map((a) => {
            return a[this.type + "NewBySpecimen"] ?? a[this.type + "New"];
          }),
        }
      ];
    },
  },
  mounted() {},
  data() {
    return {
      countOpt: {
        duration: 0
      },
      colors: {
        confirmed: "#ff5151",
        death: "#575757",
        tested: "#0094b9",
        cured: "#28ca00",
        admissions: "#ff7300",
      }
    };
  },
  components:{
    ICountUp,
    Chart
  }
}
</script>

<style scoped>
  .uk_numbers {
    display:flex;
    justify-content: space-between;
  }
  .number {
    font-size: 1.7em;
    padding-bottom: 10px;
  }
  .confirmed .number {
    color: var(--red);
  }
  .death .number {
    color: var(--black);
  }
  .tested .number {
    color: var(--blue);
  }
  .admissions .number {
    color: var(--orange);
  }
</style>