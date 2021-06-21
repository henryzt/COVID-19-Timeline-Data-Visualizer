<template>
  <div>
    <div class="title">Region Analysis</div>
    <n-spin :show="loading">
      <div class="block">
        <Selector :types="tableTypes" v-model="selectedType" />
        <Table
          class="table"
          v-if="allCountryData"
          :data-type="selectedType"
          :all-country-data="allCountryData"
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
    allCountryData: {
      type: Object,
      default: {},
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
    };
  },
  components: {
    Table,
    NSpin,
    Selector,
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