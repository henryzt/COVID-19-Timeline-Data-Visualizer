<template>
  <div class="mBlock">
    <div class="switch-header">
      <DataSwitch
        :data-type="dataType"
        @typeChange="changeDataType($event)"
      ></DataSwitch>
      <CountrySwitch 
        v-if="(isUk || isUs) && tableData.global" 
        :tab="tab" 
        @changeTab="changeTab($event)">
      </CountrySwitch>
    </div>

    <Map
      v-if="renderComponent && isDataAvailable"
      :locationsData="locationsData"
      :countryName="tab === 1 ? countryName : 'world'"
      :is-rate="dataType.includes('Rate')"
    ></Map>

    <div v-else style="padding: 30px;text-align: center;">{{$t('noData')}}</div>

    <div
      style="text-align: left;opacity: 0.3;"
    >*Data is incomplete, source: GOV.UK and JHU.</div>

    <SlideController
      v-if="date && !(tab===1 && isUk)"
      :start-date="currentData[0].date"
      :end-date="currentData[currentData.length-1].date"
      :hidePlayButton="true"
      :current-date="date"
      @change="changeDate"
      :lazy="false"
      :enableEvenIfPaused="true"
      :playing="false"
    ></SlideController>
  </div>
</template>

<script>
import Map from "./Map.vue";
import DataSwitch from "../common/DataSwitch";
import CountrySwitch from "../common/CountrySwitch";
import {
  combineUKHighCharts,
  combineUSHighCharts,
  combineWorldHighCharts,
  getSmallerDate,
} from "../../js/locationUtils";
import SlideController from "../common/SlideController";
export default {
  name: "MapSection",
  components: {
    SlideController,
    Map,
    DataSwitch,
    CountrySwitch,
  },
  props: {
    tableData: Object,
    countryName: String,
    mainDate: String,
  },
  data: function () {
    return {
      currentData: null,
      tab: 1,
      locationsData: null,
      isUk: true,
      isUs: false,
      isDataAvailable: true,
      date: null,
      renderComponent: false,
      dataType: "confirmed",
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    mainDate() {
      if (this.mainDate) {
        let dateToChange = getSmallerDate(
          this.mainDate,
          this.currentData[this.currentData.length - 1].date
        );
        this.changeDate(dateToChange);
      }
    },
    "tableData.uk"() {
      this.init();
    },
    "tableData.country"() {
      this.init();
    },
    "tableData.global"() {
      this.init();
    },
  },
  methods: {
    init() {
      this.isUk = this.countryName === "UK";
      this.isUs = this.countryName === "US";
      this.changeTab(this.isUk || this.isUs ? 1 : 0);
    },
    changeDate: function (date) {
      this.date = date;
      this.loadMap();
    },
    changeTab(tab) {
      this.tab = tab;
      if ((this.isUk || this.isUs) && this.tab === 1) {
        this.currentData = this.isUk ? this.tableData.uk : this.tableData.country;
      } else {
        this.currentData = this.tableData.global;
      }
      if (!this.currentData) return;
      this.date = this.currentData[this.currentData.length - 1].date;
      this.loadMap(true);
    },
    changeDataType(type) {
      this.dataType = type;
      this.loadMap();
    },
    async loadMap(rerender) {
      setImmediate(() => {
        console.time("map");
        this.renderComponent = false;
        let idx = this.currentData.findIndex((ele) => ele.date === this.date);
        this.isDataAvailable = true;
        if (this.tab === 1) {
          if (this.isUk) {
            this.isDataAvailable = !(["cured", "cRate", "active"].includes(this.dataType));
            this.locationsData = combineUKHighCharts(this.currentData, this.dataType);
          } else {
            this.isDataAvailable = !(
              this.isUs &&
              (this.dataType === "cured" || this.dataType === "cRate")
            );
            this.locationsData = combineUSHighCharts(
              this.currentData[idx].arr,
              this.dataType
            );
          }
        } else {
          this.locationsData = combineWorldHighCharts(
            this.currentData[idx].arr,
            this.dataType
          );
        }
        if (rerender) this.forceRerender();
        this.renderComponent = true;
        console.timeEnd("map");
      });
    },
    forceRerender() {
      this.renderComponent = false;
      this.$nextTick(() => {
        this.renderComponent = true;
      });
    },
  },
};
</script>

<style>
</style>