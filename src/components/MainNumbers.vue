<template>
  <div class="title">Overview</div>
  <div class="overview-wrapper">
    <div
      class="block overview"
      :class="{ 'loading-block': loading || !allTimeSeries }"
      v-for="(item, idx) of display"
      :key="idx"
    >
      <div v-if="item">
        <transition name="fade">
          <div class="bg-chart" v-if="!loading">
            <Chart
              v-if="allTimeSeries"
              :time-series="allTimeSeries[item.type]"
              :data-type="item.type"
              type="minimum"
            ></Chart>
          </div>
        </transition>
        <div :class="{ [item.color]: true, 'ov-item': true }">
          <div class="ov-title">{{ item.title }}</div>
          <div class="number" ref="num">
            {{ $padNum(item.today) }}
          </div>
          <div class="number-title">{{ item.totalTitle ?? "Total" }}</div>
          <div class="number total">
            {{ $padNum(item.total) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from "vue";
import Chart from "./Chart.vue";

export default defineComponent({
  name: "MainNumbers",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    overviewData: {
      type: Object,
      required: true,
    },
    allTimeSeries: {
      type: Object,
      required: true,
    },
  },
  components: {
    Chart,
  },
  data() {
    return {
      display: [null, null, null, null],
    };
  },
  watch: {
    overviewData(data) {
      console.log(data);
      const cases = {
        color: "red",
        type: "cases",
        title: "Cases Today",
        today: data.todayCases,
        total: data.cases,
      };
      const deaths = {
        color: "purple",
        type: "deaths",
        title: "Deaths Today",
        today: data.todayDeaths,
        total: data.deaths,
      };
      const recovered = {
        color: "green",
        type: "recovered",
        title: "Recovered Today",
        today: data.todayRecovered,
        total: data.recovered,
      };
      const active = {
        color: "orange",
        type: "active",
        title: "Current Cirtical",
        today: data.critical,
        totalTitle: "Current Active",
        total: data.active,
      };
      this.display = [cases, deaths, recovered, active];
    },
  },
});
</script>

<style scoped>
.overview-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.overview {
  display: flex;
  justify-content: space-between;
  width: 48%;
  margin-bottom: 30px;
  /* font-weight: bold; */
  font-size: 14px;
  overflow: hidden;
  height: 160px;
}

.ov-title {
  font-size: 1em;
  opacity: 0.6;
}

.ov-item {
  position: relative;
  z-index: 100;
}

.number-title {
  opacity: 0.6;
  line-height: 1.2em;
}

.number {
  font-size: 2em;
  padding-bottom: 10px;
}

.total {
  font-size: 1.3em;
  padding-bottom: 0;
}

.bg-chart {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.bg-chart::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    90deg,
    white,
    white,
    rgba(255, 255, 255, 0)
  );
}

.red {
  color: var(--red);
}
.black {
  color: var(--black);
}
.blue {
  color: var(--blue);
}
.orange {
  color: var(--orange);
}
.purple {
  color: var(--purple);
}
.green {
  color: var(--green);
}
</style>
