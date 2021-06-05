<template>
  <MainNumbers />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MainNumbers from './components/MainNumbers.vue'
import {
  getAllCountryData,
  getTimeSeries
} from './utils/api'

export default defineComponent({
  name: 'App',
  components: {
    MainNumbers
  },
  async mounted(){
    const counrtyData = await getAllCountryCurrentData();
    console.log(counrtyData)
  }
})
</script>

<style>

</style>
