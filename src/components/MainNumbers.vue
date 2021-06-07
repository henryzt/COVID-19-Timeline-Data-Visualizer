<template>
  <div class="title">Overview</div>
  <div class="overview-wrapper">
    <div class="block overview" v-for="(item, idx) of display" :key="idx">
      <div v-if="item">
        <div :class="{ [item.color]: true }">
          <div class="overview-title">{{ item.title }}</div>
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
export default defineComponent({
  name: "MainNumbers",
  props: {
    overviewData: {
      type: Object,
      required: true,
    },
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
        title: "Cases Today",
        today: data.todayCases,
        total: data.cases,
      };
      const deaths = {
        color: "purple",
        title: "Deaths Today",
        today: data.todayDeaths,
        total: data.deaths,
      };
      const recovered = {
        color: "green",
        title: "Recovered Today",
        today: data.todayRecovered,
        total: data.recovered,
      };
      const active = {
        color: "orange",
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
  font-weight: bold;
  font-size: 14px;
}

.overview-title {
  font-size: 1em;
  opacity: 0.5;
}

.number-title {
  opacity: 0.5;
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

.red .number {
  color: var(--red);
}
.black .number {
  color: var(--black);
}
.blue .number {
  color: var(--blue);
}
.orange .number {
  color: var(--orange);
}
.purple .number {
  color: var(--purple);
}
.green .number {
  color: var(--green);
}
</style>
