<template>
  <div>
    <div class="title">{{ $t('subtitles.country') }}</div>
    <div class="overview mBlock" v-if="dataUk">
      <div class="overview_item">
        <div class="overview_title">{{ $t('england') }}</div>
        <div class="overview_number">{{dataUk.regional.englandConfirmed }}</div>
        <div class="country-death">{{ dataUk.regional.englandDeceased }}</div>
      </div>
      <div class="overview_item">
        <div class="overview_title">{{ $t('scotland') }}</div>
        <div class="overview_number">{{ dataUk.regional.scotlandConfirmed }}</div>
        <div class="country-death">{{ dataUk.regional.scotlandDeceased }}</div>
      </div>
      <div class="overview_item">
        <div class="overview_title">{{ $t('wales') }}</div>
        <div class="overview_number">{{dataUk.regional.walesConfirmed }}</div>
        <div class="country-death">{{ dataUk.regional.walesDeceased }}</div>
      </div>
      <div class="overview_item">
        <div class="overview_title">{{ $t('nIreland') }}</div>
        <div class="overview_number">{{dataUk.regional.northenIrelandConfirmed }}</div>
        <div class="country-death">{{ dataUk.regional.northenIrelandDeceased }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Cov19API from "@publichealthengland/uk-covid19";
export default {
  name: "UkRegionSection",
  data(){
    return {
      dataUk: null,
    };
  },
  components: {},
  async mounted() {
    const casesAndDeaths = {
      date: "date",
      areaName: "areaName",
      areaCode: "areaCode",
      newCasesByPublishDate: "newCasesByPublishDate",
      cumCasesByPublishDate: "cumCasesByPublishDate",
      newDeathsByDeathDate: "newDeaths28DaysByPublishDate",
      cumDeathsByDeathDate: "cumDeaths28DaysByPublishDate",
    };
    const allNations = ["areaType=nation"];

    const latestData = new Cov19API({
      filters: allNations,
      structure: casesAndDeaths,
    });

    const data = await latestData.getJSON();

    console.log(data);
  },
};
</script>

<style scoped>
</style>