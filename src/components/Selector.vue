<template>
  <div>
    <n-button-group>
      <n-button
        v-for="type in types"
        :key="type"
        round
        ghost
        :type="modelValue == type ? 'primary':'default'"
        size="small"
        @click="changeType(type)"
      >
        {{ type }}
      </n-button>
    </n-button-group>
  </div>
</template>

<script>
import { NButton, NButtonGroup } from "naive-ui";

export default {
  name: "Selector",
  props: {
    types: {
      type: Array,
      default: [],
    },
    modelValue: {
      type: String,
      default: ""
    }
  },
  methods: {
    changeType(e) {
      this.$emit('update:modelValue', e);
    }
  },
  components: {
    NButton,
    NButtonGroup,
  },
};
</script>

<style scoped>
</style>