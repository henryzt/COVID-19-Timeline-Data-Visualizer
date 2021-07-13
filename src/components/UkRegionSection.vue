<template>
  <div>
    <div class="title">{{ $t("subtitles.country") }}</div>
    <div class="mBlock" v-if="dataUk">
      <div class="overview">
        <div class="overview-item">
          <div class="overview-title">{{ $t("england") }}</div>
          <div class="overview-number">
            <count-to :end-val="item.total" :duration="1000" />
          </div>
          <div class="country-death">{{ getNewData("England") }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CountTo } from "vue3-count-to";

export default {
  name: "UkRegionSection",
  props: ["dataUk"],
  data() {
    return {
      tag: "confirmed",
      nations: ["england", "scotland", "wales", "nIreland"],
      options: [
        "confirmed",
        "death",
        "hospitalCases",
        "covidOccupiedMVBeds",
        "confirmedRate",
      ],
    };
  },
  components: {
    CountTo,
  },
  methods: {
    getCumData(nation) {},
    getNewData(nation) {},
  },
};
</script>

<style scoped>

.overview {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  text-overflow: fade;
  white-space: nowrap;
  overflow-x: hidden;
}

.overview-item {
  margin: 1px 15px;
  text-align: center;
  width: 25% !important;
}

.overview-number {
  font-size: 1.7em;
  padding-top:3px;
}
</style>