<template>
  <div>
    <div class="title">{{ $t('Confirmed') }}</div>
    <div class="mBlock">
      <div class="uk_numbers">
        <div :class="{[type]: true}">
          <div class="number_title">Daily</div>
          <div class="number">{{latestDaily}}</div>
          <div class="number_title">Last 7 days</div>
          <div class="number">{{latest}}</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
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
    color: red;
  }
</style>