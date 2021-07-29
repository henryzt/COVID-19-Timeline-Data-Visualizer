<template>
  <div class="title">
    {{ $t("subtitles.overview") }}
    <div v-if="overviewData" class="title-date">
      {{ $t("updatedAt") + $d(new Date(overviewData.updated)) }}
    </div>
  </div>
  <div class="overview-wrapper">
    <div
      class="block overview"
      :class="{ 'loading-block': loading }"
      v-for="(item, idx) of display"
      :key="idx"
    >
      <div v-if="item">
        <transition name="fade">
          <div class="bg-chart" v-if="allTimeSeries">
            <Chart
              :time-series="allTimeSeries[item.type]"
              :data-type="item.type"
              type="minimum"
            ></Chart>
          </div>
        </transition>
        <div :class="{ [item.color]: true, 'ov-item': true }">
          <div class="ov-title">{{ item.title }}</div>
          <div class="number" ref="num">
            <count-to :end-val="item.today" :duration="1000" />
          </div>
          <div class="number-title">
            {{ item.totalTitle ?? $t("type.total") }}
          </div>
          <div class="number total">
            <count-to :end-val="item.total" :duration="1000" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from "vue";
import Chart from "./Chart.vue";
import { CountTo } from "vue3-count-to";

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
    CountTo,
  },
  data() {
    return {
      display: [null, null, null, null],
    };
  },
  mounted() {
    if (this.overviewData) {
      this.loadDisplay();
    }
  },
  watch: {
    overviewData() {
      this.loadDisplay();
    },
  },
  methods: {
    loadDisplay() {
      const data = this.overviewData;
      const cases = {
        color: "red",
        type: "cases",
        title: this.$t("today.cases"),
        today: data.todayCases,
        total: data.cases,
      };
      const deaths = {
        color: "purple",
        type: "deaths",
        title: this.$t("today.deaths"),
        today: data.todayDeaths,
        total: data.deaths,
      };
      const recovered = {
        color: "green",
        type: "recovered",
        title: this.$t("today.recovered"),
        today: data.todayRecovered,
        total: data.recovered,
      };
      const active = {
        color: "orange",
        type: "active",
        title: this.$t("today.critical"),
        today: data.critical,
        totalTitle: this.$t("today.active"),
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
