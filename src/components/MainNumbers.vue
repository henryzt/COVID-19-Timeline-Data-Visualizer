<template>
  <div class="block">

  </div>

</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
export default defineComponent({
  name: 'MainNumbers',
  props: {
    overviewData: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    console.log(props.overviewData)
  }
})
</script>

<style scoped>

</style>
