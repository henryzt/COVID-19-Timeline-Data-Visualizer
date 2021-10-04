<template>
  <div class="title">{{ $t("subtitles.about") }}</div>
  <!-- please do not remove the credit links -->
  <ul class="about">
    <li>
      Data provided by <n-a href="https://disease.sh/">disease.sh</n-a> API and GOV.UK.
      Designed with <n-a href="https://naiveui.com">Naive-UI</n-a> and
      <n-a href="https://echarts.apache.org/">ECharts</n-a>.
    </li>
    <li>
      This project is open-sourced at
      <n-a href="https://github.com/henryz00/COVID-19-Timeline-Data-Visualizer"
        >the github repository here</n-a
      >, pull requests and issues are welcomed!
    </li>
    <li>
      © 2021 Developed by
      <n-a href="https://github.com/henryz00">@henryz00</n-a>
      | Previous versions developed by
      <n-a href="https://github.com/henryz00">@henryz00</n-a> and
      <n-a href="https://github.com/Davi-X">@Davi-X</n-a>
      at University College London. Special thanks to
      <n-a href="https://github.com/jieyouxu">@jieyouxu</n-a>, 
      <n-a href="https://github.com/shadowhusky">@shadowhusky</n-a> and
      <n-a href="https://github.com/robinWongM">@robinWongM</n-a>.
    </li>
  </ul>
  <div class="lang-switch">
    <Selector :types="langs" v-model="selectedLang" />
  </div>
</template>

<script>
import Selector from "./Selector.vue";
import { NA } from "naive-ui";

export default {
  name: "Credits",
  components: { NA, Selector },
  data() {
    return {
      langs: ["en", "zh"],
      selectedLang: this.$i18n.locale,
    };
  },
  watch: {
    selectedLang(newValue) {
      this.$emit("changeLang", newValue);
    },
  },
};
</script>

<style scoped>
.about {
  opacity: 0.7;
}

.lang-switch {
  opacity: 0.7;
  padding-top: 20px;
  padding-bottom: 50px;
  text-align: center;
}
</style>