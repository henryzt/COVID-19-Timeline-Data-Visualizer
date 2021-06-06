<template>
  <div class="overview-wrapper">
    <div class="block overview" v-for="(item, idx) of display" :key="idx">
      <div v-if="item">
        <div :class="{ [item.color]: true }">
          <div class="number-title">Today</div>
          <div class="number" ref="num">
            {{ $padNum(item.today ?? item.critical) }}
          </div>
          <div class="number-title">Total</div>
          <div class="number">
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
        title: "Cases",
        today: data.todayCases,
        total: data.cases,
      };
      const deaths = {
        color: "black",
        title: "Deaths",
        today: data.todayDeaths,
        total: data.deaths,
      };
      const active = {
        color: "orange",
        title: "Active",
        critical: data.critical,
        total: data.active,
      };
      const recovered = {
        color: "blue",
        title: "Recovered",
        today: data.todayRecovered,
        total: data.recovered,
      };
      this.display = [cases, deaths, active, recovered];
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
}

.number {
  font-size: 1.7em;
  padding-bottom: 10px;
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
</style>
