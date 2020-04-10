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
              id="confirmedAndDeathChart1"
        type="line"
        :dataHistory="dataHistory"
        :seriesData="confirmedAndDeathChart1"
      ></Chart>


      <div class="title">新增死亡</div>
      <Chart
              id="deathChart2"
              type="bar"
              :dataHistory="dataHistory"
              :seriesData="deathChart2"
              :colors='["#ff0000"]'
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
  },
  computed: {
    confirmedAndDeathChart1: function () {
      return [
        {
          name: '总确诊',
          data: this.dataHistory.map(a => {
            return a.confirmed;
          })
        },
        {
          name: '总死亡',
          data: this.dataHistory.map(a => {
            return a.death;
          })
        }
      ]
    },
    deathChart2:function () {
      let lastDeath = 0;
      return [
        {
          name: '死亡人数',
          data: this.dataHistory.map(a => {
            let newDeath = a.death - lastDeath;
            lastDeath = a.death;
            return newDeath
          })
        }
      ]
    }
  },

};


</script>

<style>
</style>
