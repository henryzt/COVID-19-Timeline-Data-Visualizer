<template>
  <div>
    <div class="title">Region Analysis</div>
    <div class="block">
      <Table v-if="allCountryData" :all-country-data="allCountryData" />
    </div>
  </div>
</template>

<script>
import Table from "./Table.vue";
export default {
  props: {
    allCountryData: {
      type: Object,
      default: {},
    },
  },
  components: {
    Table,
  },
};
</script>

<style scoped>
</style>