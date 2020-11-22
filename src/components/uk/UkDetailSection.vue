<template>
  <div>
    <UkDetail :dataUk="dataUk" type="confirmed"></UkDetail>
    <UkDetail :dataUk="dataUk" type="death"></UkDetail>
    <UkDetail :dataUk="dataUk" type="tested"></UkDetail>
  </div>
</template>

<script>
import UkDetail from "./UkDetail.vue";

export default {
  name: "UkDetailSection",
  props: ["dataUk"],
  components:{
    UkDetail
  }
}
</script>

<style scoped>
</style>