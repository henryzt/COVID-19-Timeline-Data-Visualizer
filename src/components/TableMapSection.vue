<template>
  <div>
    <div class="title">
      {{ isTableType ? $t("subtitles.region") : $t("subtitles.map") }}
      <div class="title-selector" v-if="localTableData">
        <Selector :types="locationTypes" v-model="selectedLocation" />
      </div>
    </div>
    <n-spin :show="loading">
      <div class="block">
        <Selector :types="dataTypes" v-model="selectedType" />
        <div v-if="isTableType">
          <Table
            class="table"
            v-if="globalTableData"
            :data-type="selectedType"
            :table-data="tableData"
          />
        </div>
        <div v-else>
          <MapView
            class="table"
            v-if="globalTableData"
            :is-local="selectedLocation === 'local'"
            :country="country"
            :data-type="selectedType"
            :table-data="tableData"
          />
        </div>
      </div>
    </n-spin>
  </div>
</template>

<script>
import Table from "./Table.vue";
import MapView from "./MapView.vue";
import Selector from "./Selector.vue";
import { NSpin } from "naive-ui";

export default {
  props: {
    sectionType: {
      type: String,
      default: "table",
    },
    globalTableData: {
      type: Object,
      default: null,
    },
    localTableData: {
      type: Object,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    country: {
      type: String,
      default: "all",
    },
  },
  data() {
    return {
      dataTypes: ["total", "daily", "rate"],
      selectedType: "total",
      locationTypes: ["global", "local"],
      selectedLocation: "global",
    };
  },
  mounted() {
    if (!this.isTableType) {
      // section is a map
      this.dataTypes = [
        "cases",
        "deaths",
        "todayCases",
        "todayDeaths",
        "todayRecovered",
        "recovered",
        "tests",
        "critical",
        "active",
        "casesPerOneMillion",
        "deathsPerOneMillion",
        "testsPerOneMillion",
        "activePerOneMillion",
        "recoveredPerOneMillion",
        "criticalPerOneMillion",
        "population",
      ];
      this.selectedType = this.dataTypes[0];
    }
  },
  components: {
    Table,
    MapView,
    NSpin,
    Selector,
  },
  computed: {
    tableData() {
      return this.selectedLocation === "local"
        ? this.localTableData
        : this.globalTableData;
    },
    isTableType() {
      return this.sectionType === "table";
    },
  },
  watch: {
    localTableData(newValue) {
      this.selectedLocation = newValue ? "local" : "global";
    },
  },
};
</script>

<style scoped>
.block {
  min-height: 430px;
}
.table {
  padding-top: 10px;
}
</style>