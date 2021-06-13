<template>
  <div>
    <n-button-group>
      <n-button
        v-for="type in types.slice(0, limit)"
        :key="type"
        round
        ghost
        :type="modelValue == type ? 'primary' : 'default'"
        size="small"
        @click="changeType(type)"
      >
        {{ type }}
      </n-button>
      <!-- overflow -->

      <n-dropdown
        v-if="limit < types.length"
        trigger="hover"
        @select="changeType"
        placement="bottom-start"
        :options="dropdownOptions"
      >
        <n-button
          round
          ghost
          size="small"
          :type="isOverflowActive ? 'primary' : 'default'"
        >
          <n-icon size="15">
            <ChevronDown />
          </n-icon>
          <span v-if="isOverflowActive">{{modelValue}}</span>
        </n-button>
      </n-dropdown>
    </n-button-group>
  </div>
</template>

<script>
import { ChevronDown } from "@vicons/ionicons5";
import { NButton, NButtonGroup, NIcon, NDropdown } from "naive-ui";

export default {
  name: "Selector",
  props: {
    limit: {
      type: Number,
      default: 3,
    },
    types: {
      type: Array,
      default: [],
    },
    modelValue: {
      type: String,
      default: "",
    },
  },
  methods: {
    changeType(e) {
      this.$emit("update:modelValue", e);
    },
  },
  components: {
    NButton,
    NButtonGroup,
    NIcon,
    ChevronDown,
    NDropdown,
  },
  computed: {
    dropdownOptions() {
      const overflowData = this.types.slice(this.limit);
      const options = overflowData.map((i) => {
        return {
          key: i,
          label: i,
        };
      });
      return options;
    },
    isOverflowActive() {
      return this.dropdownOptions.map((i) => i.key).includes(this.modelValue);
    },
  },
};
</script>

<style scoped>
</style>