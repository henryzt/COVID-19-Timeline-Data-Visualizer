<template>
  <div>
    <div class="header">
      <div class="header-title">
        <h2>COVID-19</h2>
        <h3>{{ $t("title") }}</h3>
      </div>
      <div>
        <n-select
          :value="modelValue"
          @update:value="changeCountry"
          filterable
          placeholder="Select Country"
          :options="countryList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { NSelect } from "naive-ui";
export default {
  name: "Header",
  props: {
    countryList: {
      type: Array,
      default: []
    },
    modelValue: {
      type: String,
      default: "all"
    }
  },
  data() {
    return {
    };
  },
  methods: {
    changeCountry(e) {
      this.$emit('update:modelValue', e);
    }
  },
  components: {
    NSelect,
  },
};
</script>

<style scoped>
.header {
  padding: 20px 10px;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title h2 {
  font-size: 30px;
  color: #54c1f9;
  margin-bottom: 10px;
}

.header-title h3 {
  opacity: 0.5;
  font-size: 25px;
  margin-top: 0;
}

@media only screen and (max-width: 600px) {
  .header {
    padding: 20px 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>