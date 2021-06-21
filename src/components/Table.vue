<template>
  <n-space vertical :size="12">
    <n-data-table
      ref="table"
      :columns="columns"
      :data="allCountryData"
      :pagination="pagination"
      :scroll-x="scrollLength"
    />
  </n-space>
</template>

<script>
import { NSpace, NDataTable } from "naive-ui";

const keys = {};

keys.total = ["cases", "deaths", "active", "critical", "recovered", "tests"];
keys.daily = ["todayCases", "todayDeaths", "todayRecovered"];
keys.rate = keys.total.map((i) => i + "PerOneMillion");

const country = {
  title: "Country",
  key: "country",
  sorter: "default",
  fixed: "left",
  width: 150,
};

export default {
  components: {
    NDataTable,
    NSpace,
  },
  computed: {
    columns() {
      const columns = keys[this.dataType].map((item) => {
        return {
          title: item,
          key: item,
          sorter: (row1, row2) => row1[item] - row2[item],
        };
      });
      const res = [country].concat(columns);
      return res;
    },
    scrollLength(){
      return 200 * this.columns.length;
    }
  },
  props: {
    allCountryData: {
      type: Object,
      default: {},
    },
    dataType: {
      type: String,
      default: "total",
    },
  },
  watch: {
    columns(){
      this.$nextTick(()=>{
        this.$refs.table.sort(this.columns[1].key, "descend");
      })
    }
  },
  data() {
    return {
      pagination: {
        pageSize: 10,
      },
    };
  },
  methods: {},
};
</script>