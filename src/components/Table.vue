<template>
  <n-space vertical :size="12">
    <n-data-table
      ref="table"
      :columns="columns"
      :data="allCountryData"
      :pagination="pagination"
    />
  </n-space>
</template>

<script>
import { NSpace, NDataTable } from "naive-ui";

const columns = [
  {
    title: "Country",
    key: "country",
    defaultSortOrder: "ascend",
    sorter: "default",
  },
  {
    title: "Cases",
    key: "cases",
    sorter: (row1, row2) => row1.cases - row2.cases,
  },
  {
    title: "Active",
    key: "active",
    sorter: (row1, row2) => row1.active - row2.active,
  },
  {
    title: "Deaths",
    key: "deaths",
    sorter: (row1, row2) => row1.deaths - row2.deaths,
  },
];

export default {
  components: {
    NDataTable,
    NSpace,
  },
  props: {
    allCountryData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      columns,
      pagination: {
        pageSize: 10,
        showSizePicker: true,
        pageSizes: [10, 50, 100, 300],
        onChange: (page) => {
          this.pagination.page = page
        },
        onPageSizeChange: (pageSize) => {
          this.pagination.pageSize = pageSize
          this.pagination.page = 1
        }
      },
    };
  },
  methods: {
    filterAddress() {
      this.$refs.table.filter({
        address: ["London"],
      });
    },
    sortName() {
      this.$refs.table.sort("name", "ascend");
    },
    clearFilters() {
      this.$refs.table.filter(null);
    },
    clearSorter() {
      this.$refs.table.sort(null);
    },
  },
};
</script>