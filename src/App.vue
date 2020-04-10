<template>
  <div id="app">
    <div class="mContent" v-if="dataNow && dataHistory">
      <div class="title">今日概览</div>
      <div class="overview mBlock">
        <div class="overview_item" style="color: #ff5151;">
          <div class="overview_title">累计确诊</div>
          <div class="overview_number">{{ dataNow[0].confirmed }}</div>
        </div>
        <div class="overview_item" style="color: #575757;">
          <div class="overview_title">累计死亡</div>
          <div class="overview_number">{{ dataNow[0].death }}</div>
        </div>
        <div class="overview_item" style="color: #0094b9;">
          <div class="overview_title">累计测试</div>
          <div class="overview_number">{{ dataNow[0].tested }}</div>
        </div>
        <div class="overview_item" style="color: #28ca00;">
          <div class="overview_title">累计治愈</div>
          <div class="overview_number">{{ dataNow[1].cured }}</div>
        </div>
      </div>

      <div class="title">国家概览</div>
      <div class="overview mBlock">
        <div class="overview_item">
          <div class="overview_title">英格兰</div>
          <div class="overview_number">{{ dataNow[0].england }}</div>
        </div>
        <div class="overview_item">
          <div class="overview_title">苏格兰</div>
          <div class="overview_number">{{ dataNow[0].scotland }}</div>
        </div>
        <div class="overview_item">
          <div class="overview_title">威尔士</div>
          <div class="overview_number">{{ dataNow[0].wales }}</div>
        </div>
        <div class="overview_item">
          <div class="overview_title">北爱尔兰</div>
          <div class="overview_number">{{ dataNow[0].nireland }}</div>
        </div>
      </div>

      <div class="mNav">
        <ul class="nav nav-pills nav-fill">
          <li class="nav-item">
            <a class="nav-link active" href="#">当前数据</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">历史数据</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">地图列表</a>
          </li>
        </ul>
      </div>

      <div class="title">确诊及死亡</div>
      <Chart
        :dataHistory="dataHistory"
        :seriesData="[
          {
            name: '总确诊',
            data: dataHistory.map(a => {
              return a.confirmed;
            })
          },
          {
            name: '总死亡',
            data: dataHistory.map(a => {
              return a.death;
            })
          }
        ]"
      ></Chart>
    </div>
  </div>
</template>

<script>
import Chart from "./components/Chart.vue";

export default {
  name: "App",
  components: {
    Chart
  },
  data: () => {
    return {
      message: "Test",
      dataNow: null,
      dataHistory: null,
      confirmedAndDeathChart: null
    };
  },
  mounted() {
    fetch("https://api.covid19uk.live/").then(async res => {
      let data = await res.json();
      this.$data.dataNow = data.data;
    });

    fetch("https://api.covid19uk.live/historyfigures").then(async res => {
      let data = await res.json();
      this.$data.dataHistory = data.data;
    });
  }
};


</script>

<style>

</style>
