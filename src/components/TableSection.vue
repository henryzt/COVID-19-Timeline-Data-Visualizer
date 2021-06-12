<template>
  <div>
    <div class="title">Region Analysis</div>
    <n-spin :show="loading">
      <div class="block">
        <Table v-if="allCountryData" :all-country-data="allCountryData" />
      </div>
    </n-spin>
  </div>
</template>

<script>
import Table from "./Table.vue";
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
  components: {
    Table,
    NSpin,
  },
};
</script>

<style scoped>
</style>