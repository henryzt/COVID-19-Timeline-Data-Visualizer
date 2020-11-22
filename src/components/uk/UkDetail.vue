<template>
  <div>
    <div class="title">{{ $t('Confirmed') }}</div>
    <div class="mBlock">
      <div class="uk_numbers">
        <div :class="{[type]: true}">
          <div class="number_title">Daily</div>
          <div class="number"><ICountUp  :options="countOpt" :endVal="latestDaily"/></div>
          <div class="number_title">Last 7 days</div>
          <div class="number"><ICountUp  :options="countOpt" :endVal="latest"/></div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import ICountUp from 'vue-countup-v2';

export default {
  name: "UkDetail",
  props: ["dataUk", "type"],
  computed: {
    latest(){
      return this.dataUk.latest[this.type];
    },
    latestDaily(){
      return this.dataUk.latest[this.type + "New"];
    },
  },
  data() {
    return {
      countOpt: {
        duration: 0.5
      }
    };
  },
  components:{
    ICountUp
  }
}
</script>

<style scoped>
  .uk_numbers {
    
  }
  .number {
    font-size: 1.7em;
    padding-bottom: 10px;
  }
  .confirmed .number {
    color: var(--red);
  }
</style>