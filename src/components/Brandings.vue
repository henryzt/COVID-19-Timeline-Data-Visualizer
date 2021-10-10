<template>
  <div v-if="b">
    <div class="title">{{ b.title }}</div>
    <div class="block">
      <div>
        {{ b.line1 }}
      </div>
      <img v-if="b.img" :src="b.img" />
      <div>{{ b.line2 }}</div>
      <div v-if="b.url" class="url-block">
        <hr />
        <div style="font-size: 20px">{{ b.urlLine1 }}</div>
        <div class="url">{{ b.url }}</div>
        {{ b.urlLine2 }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
interface DataTypes {
  b: Branding | null
}
export default {
  components: {},
  data(): DataTypes {
    return {
      b: null
    }
  },
  mounted() {
    const baseUrl = "https://henryzt.com/projects/covid-brandings/index.php?hostname=";
    const hostname = window.location.hostname;
    fetch(`${baseUrl}${hostname}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 404) {
          return Promise.reject("404");
        }
      })
      .then((json: Branding) => {
        this.b = json;
        this.$emit("brandingReady", json);
      })
      .catch(() => {});
  },
};
</script>

<style scoped>
.block {
  text-align: center;
}

img {
  max-width: 260px;
}

hr {
  border-style: ridge;
}

.url-block {
  margin-top: 20px;
  user-select: none;
}

.url {
  font-size: 25px;
  font-weight: bold;
  padding: 10px 0;
  user-select: text;
}
</style>