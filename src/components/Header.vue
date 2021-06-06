<template>
  <div>
    <div class="header">
      <div class="header-title">
        <h2>COVID-19</h2>
        <h3>{{ $t("title") }}</h3>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "Header",
};
</script>

<style scoped>
h6 {
  padding-left: 20px;
}

.header {
  padding: 20px 10px;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title {
  opacity: 0.5;
}

</style>