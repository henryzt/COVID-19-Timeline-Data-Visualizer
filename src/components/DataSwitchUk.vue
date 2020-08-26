<template>
  <div style="width:fit-content">
    <ul class="nav nav-pills">
      <li class="nav-item" v-for="type in options" :key="type">
        <a
          class="nav-link"
          href="#"
          :class="{active: value===type}"
          @click="changeType(type)"
        >{{ $t('dataSwitchUk.'+[type]) }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "DataSwitchUk",
  props: ["value"],
  data() {
    return {
      options: [
        "cumCasesByPublishDate",
        "cumDeathsByDeathDate",
        "hospitalCases",
        "covidOccupiedMVBeds",
      ],
    };
  },
  methods: {
    changeType(type) {
      this.$emit("input", type);
      window.ga("send", "event", "data-switch-uk", "type-changed", type);
    },
  },
};
</script>

<style scoped>
.nav-link {
  padding: 0.1rem 0.5rem;
}
</style>