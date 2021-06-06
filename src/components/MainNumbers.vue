<template>
  <div class="block">
    <div v-for="(item, idx) of display" :key="idx">
      <div v-if="item">{{ item.title }}|{{ item.today }}</div>
    </div>
  </div>
</template>

<script lang="ts">
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
      display: [null, null, null, null]
    }
  },
  watch: {
    overviewData(data) {
      console.log(data);
      const cases = {
        title: "Cases",
        today: data.todayCases,
        total: data.cases,
      };
      const deaths = {
        title: "Deaths",
        today: data.todayDeaths,
        total: data.deaths,
      };
      const active = {
        title: "Active",
        critical: data.critical,
        total: data.active,
      };
      const recovered = {
        title: "Recovered",
        today: data.todayRecovered,
        total: data.recovered,
      };
      this.display = [cases, deaths, active, recovered];
    }
  },
});
</script>

<style scoped>
</style>
