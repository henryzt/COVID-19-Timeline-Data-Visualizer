<template>
<div>
  <div class="tabs">
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
  <div style="height: 30px;">
  </div>
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
  padding: 5px 0.5rem;
  border-radius: 0;
  color: rgb(180, 180, 180);
}
.nav-link:hover{
  background: rgb(243, 243, 243);
}
.active{
    background: #007bff !important;
}
.tabs{
    position:absolute;
    top:0;
    left:0;
    width: 100%;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    overflow: hidden;
}
.nav-item{
    flex-grow: 1;
}

</style>