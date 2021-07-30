<template>
  <n-space vertical :size="12">
    <n-data-table
      ref="table"
      :columns="columns"
      :data="tableData"
      :pagination="pagination"
      :scroll-x="scrollLength"
    />
  </n-space>
</template>

<script>
import { NSpace, NDataTable } from "naive-ui";

const keys = {};

keys.total = ["cases", "deaths", "active", "critical", "admission", "recovered", "tests"];
keys.daily = ["todayCases", "todayDeaths", "todayAdmission", "todayRecovered"];
keys.rate = keys.total.map((i) => i + "PerOneMillion");

export default {
  components: {
    NDataTable,
    NSpace,
  },
  computed: {
    columns() {
      const locationName = {
        title: this.$t("country"),
        key: "locationName",
        sorter: "default",
        fixed: "left",
        width: 150,
      };

      let columns = keys[this.dataType].map((item) => {
        return {
          title: this.$t(`type.${item}`),
          key: item,
          sorter: (row1, row2) => row1[item] - row2[item],
        };
      });

      if(this.tableData && this.tableData.length > 0){
        const entryProps = this.tableData[0];
        columns = columns.filter(i => i.key in entryProps);
      }

      const res = [locationName].concat(columns);
      this.$nextTick(() => {
        this.$refs.table?.sort(this.columns[1].key, "descend");
      });
      return res;
    },
    scrollLength() {
      return 150 * this.columns.length;
    },
  },
  props: {
    tableData: {
      type: Array,
      default: [],
    },
    dataType: {
      type: String,
      default: "total",
    },
  },
  watch: {
    columns() {},
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