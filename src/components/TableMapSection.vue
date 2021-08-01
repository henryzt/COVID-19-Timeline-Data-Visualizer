<template>
  <div>
    <div class="title">
      {{ $t("subtitles.region") }}
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
          <Map
            class="table"
            v-if="globalTableData"
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
import Map from "./Map.vue";
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
  mounted(){
    if(!this.isTableType){
      // section is a map
      this.dataTypes = ["cases", "deaths", "recovered", "active"]
      this.selectedType = this.dataTypes[0];
    }
  },
  components: {
    Table,
    Map,
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