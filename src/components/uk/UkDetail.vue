<template>
  <div>
    <div class="title">{{ $t('Confirmed') }}</div>
    <div class="mBlock">
      <div class="uk_numbers">
        <div :class="{[type]: true}">
          <div class="number_title">Daily</div>
          <div class="number"><ICountUp  :options="countOpt" :endVal="latestDaily"/></div>
          <div class="number_title">Last 7 days</div>
          <div class="number"><ICountUp  :options="countOpt" :endVal="latest"/></div>
        </div>
        <Chart
          id="chart"
          type="area"
          :dataHistory="dataUk.overview.data"
          :seriesData="chartData"
          :minimum="true"
        ></Chart>
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
          name: this.$t("totalConfirmed"),
          data: this.dataUk.overview.data.map((a) => {
            return a[this.type + "NewBySpecimen"] ?? a[this.type + "New"];
          }),
        }
      ];
    },
  },
  data() {
    return {
      countOpt: {
        duration: 0.5
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
</style>