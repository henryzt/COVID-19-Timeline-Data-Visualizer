<template>
  <div>
    <div class="title">
      {{ $t("subtitles.country") }}
      <div v-if="NationData" class="title-date">
        {{ $t("updatedAt") + $d(new Date(NationData[0].date)) }}
      </div>
    </div>
    <n-tabs justify-content="space-around" :tab-style="{ margin: '0 5px' }">
      <n-tab-pane
        v-for="option in options"
        :key="option"
        :name="option"
        :tab="$t(`uk.option.${option}`)"
        @click="tag = option"
      >
        <div></div>
      </n-tab-pane>
    </n-tabs>
    <div class="block" v-if="NationData">
      <div class="overview">
        <div class="overview-item" v-for="nation in nations" :key="nation">
          <div class="overview-title">{{ $t(`uk.nation.${nation}`) }}</div>
          <div class="overview-number">
            <count-to :end-val="getCumData(nation)" :duration="1000" />
          </div>
          <div class="country-death">{{ getNewData(nation) }}</div>
        </div>
      </div>
    </div>
    <n-spin v-else show>
      <div class="block" style="height: 150px"></div>
    </n-spin>
  </div>
</template>

<script>
import { CountTo } from "vue3-count-to";
import { NTabs, NTabPane, NSpin } from "naive-ui";

export default {
  name: "UkRegionSection",
  props: {
    NationData: {
      type: Array,
      default: null,
    },
  },
  components: {
    CountTo,
    NTabs,
    NTabPane,
    NSpin,
  },
  data() {
    return {
      tag: "confirmed",
      nations: ["England", "Scotland", "Wales", "Northern Ireland"],
      options: [
        "confirmed",
        "death",
        "hospitalCases",
        "covidOccupiedMVBeds",
        "confirmedRate",
      ],
    };
  },
  methods: {
    // need refactor below
    getCumData(nation) {
      let data = this.NationData.filter((e) => e.areaName === nation);
      if (data.length === 0) return;
      return data[0][this.tag] ?? data[1][this.tag] ?? data[2][this.tag] ?? "-";
    },
    getNewData(nation) {
      let data = this.NationData.filter((e) => e.areaName === nation);
      if (data.length === 0) return;
      let newData = data[0][this.tag + "New"];
      if (newData) return "+" + newData;
      const today = data[0][this.tag];
      const yesterday = data[1][this.tag];
      if (!today) return "+0";
      if (!yesterday) return "-";
      const diff = today - yesterday;
      return (diff > 0 ? "+" : "") + diff.toFixed(0);
    },
  },
};
</script>

<style scoped>
.overview-item {
  margin: 1px 15px;
  text-align: center;
  width: 25% !important;
}

.overview-number {
  font-size: 1.7em;
  padding-top: 3px;
}

.overview-item {
  margin: 1px 10px;
  /*overflow: scroll;*/
}
.overview-title {
  font-size: 0.9em;
}

@media only screen and (max-width: 600px) {
  .block {
    padding: 15px;
  }
  .overview-number {
    font-size: 1em;
    font-weight: bold;
  }
  .overview-item {
    margin: 1px 3px;
    overflow: hidden;
  }
  .overview-title {
    font-size: 0.9em;
  }

  .country-death {
    font-size: 1em;
  }
  .daily-increase {
    font-size: 1em;
  }
}
</style>