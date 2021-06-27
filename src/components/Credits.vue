<template>
  <div class="title">{{ $t("subtitles.about") }}</div>
  <ul class="about">
    <li>
      This project is open sourced at
      <n-a href="https://github.com/henryz00/COVID-19-Data-Visualizer-UK"
        >github repository here</n-a
      >, pull requests and issues are welcomed!
    </li>
    <li>
      © 2021
      <n-a href="https://github.com/henryz00">@henryz00</n-a>

      Previous versions build by
      <a href="https://github.com/henryz00">@henryz00</a> and
      <n-a href="https://github.com/DaviesXue">@DaviesXue</n-a>
      at University College London.
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
      selectedLang: this.$i18n.locale
    };
  },
  watch: {
    selectedLang(newValue) {
      this.$emit("changeLang", newValue)
    }
  },
};
</script>

<style scoped>
.about{
  opacity: 0.7;
}

.lang-switch{
  opacity: 0.7;
  padding-top: 20px;
  padding-bottom: 50px;
  text-align: center;
}
</style>