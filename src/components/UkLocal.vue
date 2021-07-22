<template>
  <div>
    <UkRegionSection :NationData="nation"></UkRegionSection>
  </div>
</template>

<script>
import UkRegionSection from "./UkRegionSection.vue";

export default {
  name: "UkLocal",
  data() {
    return {
      dataUk: null,
      nation: null,
      ulta: null,
      display: null,
      chartData: null
    };
  },
  mounted() {
    fetch("https://uk.henryzt.com/covid/uk.php").then(async (res) => {
      let data = await res.json();
      this.dataUk = data;
      this.nation = data.nation.data;
      this.utla = data.utla.data;
      this.loadUkRealtimeDisplay()
    });
  },
  methods: {
    loadUkRealtimeDisplay() {
      let latest = this.dataUk.latest;
      this.display = {
        confirmed: latest.confirmed,
        confirmedChange: latest.confirmedNew,
        deaths: latest.death,
        deathsChange: latest.deathNew,
        admission: latest.hospitalCases,
        admissionChange: latest.admissionsNew,
      };
      this.chartData = this.dataUk.overview.data.reverse();
    },
  },
  components: {
    UkRegionSection,
  },
};
</script>

<style scoped>
</style>