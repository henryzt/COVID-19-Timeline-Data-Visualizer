<template>
  <div class="mBlock" v-if="renderComponent">
    <div class="switch-header">
      <DataSwitch
        :data-type="dataType"
        @typeChange="changeDataType($event)"
        :disabled="tab === 1 && isUk"
      ></DataSwitch>
      <CountrySwitch v-if="country" :tab="tab" @changeTab="changeTab($event)"></CountrySwitch>
    </div>

    <BarRace
      v-if="global && tab===0"
      :raceData="global"
      :title="$t('barRace.globalTitle')"
      :is-rate="dataType.includes('Rate')"
      :color="$t('barRaceColor.'+dataType)"
      :subtitle="$t('barRace.unit')"
      source="Source: Johns Hopkins University"
      :change-label-position="true"
      id="2"
      :main-date="currentDate"
      @dateChange="currentDate=$event"
    ></BarRace>
    <BarRace
      v-if="country && country.length>0 && tab===1"
      :raceData="country"
      :title="$t('barRace.localTitle')"
      :is-rate="dataType.includes('Rate')"
      :color="$t('barRaceColor.'+dataType)"
      :subtitle="$t('barRace.unit')"
      :source="isUk?'Source: GOV.UK':'Source: Johns Hopkins University'"
      :change-label-position="!isUk"
      id="1"
      :main-date="currentDate"
      @dateChange="currentDate=$event"
    ></BarRace>
    <div v-else v-show="tab===1" style="padding: 30px;text-align: center;">{{$t('noData')}}</div>
  </div>
  <Loading v-else></Loading>
</template>

<script>
import BarRace from "./BarRace.vue";
import DataSwitch from "../common/DataSwitch";
import CountrySwitch from "../common/CountrySwitch";
import Loading from "../common/Loading.vue";
import { getD3Data } from "../../js/locationUtils";

export default {
  name: "BarRaceSection",
  components: {
    BarRace,
    DataSwitch,
    CountrySwitch,
    Loading
  },
  props: {
    tableData: Object,
    countryName: String,
    isUk: Boolean,
  },
  data: function () {
    return {
      renderComponent: false,
      tab: 0,
      dataType: "confirmed",
      global: null,
      country: null,
      currentDate: null,
    };
  },
  methods: {
    changeTab(tab) {
      this.tab = tab;
      this.forceRerender();
    },
    changeDataType(type) {
      console.time("D3");
      this.dataType = type;
      this.global = getD3Data("global", this.tableData.global, type);
      if (this.tableData.country)
        this.country = getD3Data(
          this.countryName,
          this.tableData.country,
          this.isUk ? "number" : type
        );
      this.forceRerender();
      console.timeEnd("D3");
    },
    forceRerender() {
      this.renderComponent = false;
      this.$nextTick(() => {
        this.renderComponent = true;
      });
    },
  },
  mounted() {
    setImmediate(() => {
      this.changeDataType(this.dataType);
    });
  },
};
</script>

<style scoped>
</style>