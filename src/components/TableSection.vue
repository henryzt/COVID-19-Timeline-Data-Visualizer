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
        <Selector :types="tableTypes" v-model="selectedType" />
        <Table
          class="table"
          v-if="globalTableData"
          :data-type="selectedType"
          :table-data="tableData"
        />
      </div>
    </n-spin>
  </div>
</template>

<script>
import Table from "./Table.vue";
import Selector from "./Selector.vue";
import { NSpin } from "naive-ui";

export default {
  props: {
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
  },
  data() {
    return {
      tableTypes: ["total", "daily", "rate"],
      selectedType: "total",
      locationTypes: ["global", "local"],
      selectedLocation: "global",
    };
  },
  components: {
    Table,
    NSpin,
    Selector,
  },
  computed: {
    tableData() {
      return this.selectedLocation === "local"
        ? this.localTableData
        : this.globalTableData;
    },
  },
  watch: {
    localTableData(newValue) {
      this.selectedLocation = newValue ? "local" : "global";
    }
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