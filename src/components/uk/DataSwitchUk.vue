<template>
  <div class="tabs">
    <ul class="nav nav-pills">
      <li class="nav-item" v-for="type in options" :key="type">
        <a
          class="nav-link"
          href="#"
          :class="{active: value===type}"
          @click.prevent="changeType(type)"
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
        "cumCasesBySpecimenDateRate"
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
  padding: 0px;
  border-radius: 0;
  color: #afafaf;
  margin: 0 0.5rem;
  border-bottom: 1px solid transparent;
}

.active {
  background: none !important;
  color: #007bff !important;
  border-bottom: 1px solid #007bff;
}

.tabs {
  max-width: calc(100% - 20px);
  width: fit-content;
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
}

.nav {
  flex-wrap: nowrap;
  white-space: nowrap;
}

.tabs::-webkit-scrollbar {
  display: none;
}
</style>