<template>
  <div>
    <div class="title">{{ $t('subtitles.country') }}</div>
    <data-switch-uk style="margin:auto;margin-bottom:10px;" v-model="tag"></data-switch-uk>
    <div class="mBlock" v-if="dataUk">
      <div class="overview">
        <div class="overview_item">
          <div class="overview_title">{{ $t('england') }}</div>
          <div class="overview_number">{{ getCumData("England") }}</div>
          <div class="country-death">{{ getNewData("England") }}</div>
        </div>
        <div class="overview_item">
          <div class="overview_title">{{ $t('scotland') }}</div>
          <div class="overview_number">{{ getCumData("Scotland") }}</div>
          <div class="country-death">{{ getNewData("Scotland") }}</div>
        </div>
        <div class="overview_item">
          <div class="overview_title">{{ $t('wales') }}</div>
          <div class="overview_number">{{ getCumData("Wales") }}</div>
          <div class="country-death">{{ getNewData("Wales") }}</div>
        </div>
        <div class="overview_item">
          <div class="overview_title">{{ $t('nIreland') }}</div>
          <div class="overview_number">{{ getCumData("Northern Ireland") }}</div>
          <div class="country-death">{{ getNewData("Northern Ireland") }}</div>
        </div>
      </div>
    </div>
    <Loading v-else></Loading>
  </div>
</template>

<script>
import Loading from "../common/Loading.vue";
import DataSwitchUk from "./DataSwitchUk.vue";

export default {
  name: "UkRegionSection",
  props: ["dataUk"],
  data() {
    return {
      tag: "cumCasesByPublishDate",
    };
  },
  components: {
    DataSwitchUk,
    Loading,
  },
  methods: {
    getCumData(nation) {
      let data = this.dataUk.filter((e) => e.areaName === nation);
      return data[0][this.tag] ?? data[1][this.tag] ?? data[2][this.tag] ?? "-";
    },
    getNewData(nation) {
      let data = this.dataUk.filter((e) => e.areaName === nation);
      const today = data[0][this.tag];
      const yesterday = data[1][this.tag];
      if (!today) return "+0";
      if (!yesterday) return "-";
      const diff = today - yesterday;
      return (diff > 0 ? "+" : "") + diff;
    },
  },
};
</script>

<style scoped>
</style>