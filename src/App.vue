<template>
  <div id="app">
    <div class="mContent" v-if="dataNow && dataHistory && dataUK">
      <div class="title">今日概览</div>
      <div class="overview mBlock">
        <div class="overview_item" style="color: #575757;">
          <div class="overview_title">累计确诊</div>
          <div class="overview_number">{{ dataNow[0].confirmed }}</div>
          <div class="daily-increase">{{ '+' + dataUK.dailyConfirmed }}</div>
        </div>
        <div class="overview_item" style="color: #ff5151;">
          <div class="overview_title">累计死亡</div>
          <div class="overview_number">{{ dataNow[0].death }}</div>
          <div class="daily-increase">{{ '+' + (todayData.death - yestData.death)}}</div>
        </div>
        <div class="overview_item" style="color: #0094b9;">
          <div class="overview_title">累计测试</div>
          <div class="overview_number">{{ dataNow[0].tested }}</div>
          <div class="daily-increase"> -- </div>
        </div>
        <div class="overview_item" style="color: #28ca00;">
          <div class="overview_title">累计治愈</div>
          <div class="overview_number">{{ dataNow[1].cured }}</div>
          <div class="daily-increase">{{ '+' + (todayData.cured - yestData.cured)}}</div>
        </div>
      </div>

      <div class="title">国家概览</div>
      <div class="overview mBlock">
        <div class="overview_item">
          <div class="overview_title">英格兰</div>
          <div class="overview_number">{{ dataNow[0].england }}</div>
          <div class="country-death">{{ dataUK.englandDeceased }}</div>
        </div>
        <div class="overview_item">
          <div class="overview_title">苏格兰</div>
          <div class="overview_number">{{ dataNow[0].scotland }}</div>
          <div class="country-death">{{ dataUK.scottlandDeceased }}</div>
        </div>
        <div class="overview_item">
          <div class="overview_title">威尔士</div>
          <div class="overview_number">{{ dataNow[0].wales }}</div>
          <div class="country-death">{{ dataUK.walesDeceased }}</div>
        </div>
        <div class="overview_item">
          <div class="overview_title">北爱尔兰</div>
          <div class="overview_number">{{ dataNow[0].nireland }}</div>
          <div class="country-death">{{ dataUK.northenIrelandDeceased }}</div>
        </div>
      </div>

      <div class="mNav">
        <ul class="nav nav-pills nav-fill">
          <li class="nav-item">
            <a class="nav-link active" href="#charts">当前数据</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">历史数据</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#regionData">地图列表</a>
          </li>
        </ul>
      </div>
      <div id="charts">
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
                :stacked="true"
                :dataHistory="dataHistory"
                :seriesData="deathChart2"
                :colors='["#c40000","#3d000d","#2c9100"]'
        ></Chart>

        <div class="title">死亡率及治愈率</div>
        <Chart
                id="rateChart3"
                type="area"
                :dataHistory="dataHistory"
                :seriesData="rateChart3"
                :colors='["#ca0011","#0088ff"]'
        ></Chart>
      </div>

      <br>
      <div class="title" id="regionData">地区列表</div>
      <RegionTable :dataNow="dataNow"></RegionTable>

    </div>
  </div>
</template>

<script>
import Chart from "./components/Chart.vue";
import RegionTable from "./components/RegionTable.vue";

export default {
  name: "App",
  components: {
    Chart,
    RegionTable
  },
  data: () => {
    return {
      dataNow: null,
      dataHistory: null,
      dataUK: null,
      todayData: null,
      yestData: null
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
      this.todayData = this.dataHistory[this.dataHistory.length - 1];
      this.yestData = this.dataHistory[this.dataHistory.length - 2];
    });

    fetch("https://api.apify.com/v2/key-value-stores/KWLojgM5r1JmMW4b4/records/LATEST?disableRedirect=true").then(async res => {
      let data = await res.json();
      this.$data.dataUK = data;
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
      let lastConfirmed = 0;
      let lastDeath = 0;
      // let lastCured = 0;
      return [
        {
          name: '新增确诊',
          data: this.dataHistory.map(a => {
            let newConfirmed = a.confirmed - lastConfirmed;
            lastConfirmed = a.confirmed;
            return newConfirmed
          })
        },
        {
          name: '新增死亡',
          data: this.dataHistory.map(a => {
            let newDeath = a.death - lastDeath;
            lastDeath = a.death;
            return newDeath
          })
        }

      ]
    },
    rateChart3:function () {
      return [
        {
          name: '死亡率',
          data: this.dataHistory.map(a => {
            let rate = (a.death / a.confirmed).toPrecision(4) ;
            return rate
          })
        },
        {
          name: '治愈率',
          data: this.dataHistory.map(a => {
            let rate = (a.cured / a.confirmed).toPrecision(4) ;
            return rate
          })
        }
      ]
    }
  },

};
</script>

<style>
</style>
