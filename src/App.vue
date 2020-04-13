<template>
  <div id="app">
    <div class="mContent" v-if="dataNow && dataHistory && dataUK">
      <div class="title">今日概览</div>
      <div class="overview mBlock">
        <div class="overview_item" style="color: #ff5151;">
          <div class="overview_title">累计确诊</div>
          <div class="overview_number">{{ dataNow[0].confirmed }}</div>
          <div class="daily-increase">{{ '+' + dataUK.dailyConfirmed }}</div>
        </div>
        <div class="overview_item" style="color: #575757;">
          <div class="overview_title">累计死亡</div>
          <div class="overview_number">{{ dataNow[0].death }}</div>
          <div class="daily-increase">{{ '+' + (todayData.death - yestData.death)}}</div>
        </div>
        <div class="overview_item" style="color: #0094b9;">
          <div class="overview_title">累计测试</div>
          <div class="overview_number">{{ dataNow[0].tested }}</div>
          <div class="daily-increase"> {{ '+' + (todayData.tested - yestData.tested)}} </div>
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

      <div id="navPlaceholder" ref="navPlaceholder"></div>
      <div class="mNav" ref="nav" id="mNavbar">
        <ul class="nav nav-pills nav-fill" v-scroll-spy-active="{selector: 'li a', class: 'active', offset: 50}" v-scroll-spy-link>
          <li class="nav-item">
            <a class="nav-link" href="#charts">当前数据</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#animation">数据动画</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#regionData">地图列表</a>
          </li>
        </ul>
      </div>

      <div v-scroll-spy="{data: 'section'}">
        <div class="mSection" id="charts" style="padding-top: 0">
          <div class="title">确诊及死亡</div>
          <Chart
                  id="confirmedAndDeathChart1"
                  type="area"
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

          <div class="mSection" id="animation" v-if="regionBarRaceData">
              <div class="title">数据动画</div>
                <BarRace :raceData="regionBarRaceData"></BarRace>
          </div>

        <div class="mSection" id="regionData">
            <div class="title">地区列表</div>
            <RegionTable :dataNow="dataNow" :dataYesterday="dataHistory[dataHistory.length - 1]"></RegionTable>
        </div>


      </div>
    </div>
    <div v-else>
      <div class="vertical-center">
        <div class="spinner-border text-primary"  style="width: 3rem; height: 3rem;" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "./components/Chart.vue";
import RegionTable from "./components/RegionTable.vue";
import BarRace from "./components/BarRace.vue";
import {getD3Data} from "./assets/locationUtils"

export default {
  name: "App",
  components: {
    Chart,
    RegionTable,
      BarRace
  },
  data: () => {
    return {
      dataNow: null,
      dataHistory: null,
      dataUK: null,
      todayData: null,
      yestData: null,
      section: 0,
      regionBarRaceData: null
    };
  },
  mounted() {
    fetch("https://api.covid19uk.live/").then(async res => {
      let data = await res.json();
      this.$data.dataNow = data.data;
    });

    fetch("https://api.covid19uk.live/history").then(async res => {
      let data = await res.json();
      this.$data.dataHistory = data.data;
      this.todayData = this.dataHistory[this.dataHistory.length - 1];
      this.yestData = this.dataHistory[this.dataHistory.length - 2];
      this.regionBarRaceData = getD3Data(data.data);
    });

    fetch("https://api.apify.com/v2/key-value-stores/KWLojgM5r1JmMW4b4/records/LATEST?disableRedirect=true").then(async res => {
      let data = await res.json();
      this.$data.dataUK = data;
    });

    document.addEventListener('scroll', ()=>{
      if(window.scrollY > this.$refs["navPlaceholder"].offsetTop){
        this.$refs["nav"].classList.add("fixed_nav");
        this.$refs["navPlaceholder"].classList.add("navPlaceholder");
      }else {
        this.$refs["nav"].classList.remove("fixed_nav");
        this.$refs["navPlaceholder"].classList.remove("navPlaceholder");
      }
    })



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
            let rate = (a.death / a.confirmed).toPrecision(2) ;
            return rate
          })
        },
        {
          name: '治愈率',
          data: this.dataHistory.map(a => {
            let rate = (a.cured / a.confirmed).toPrecision(2) ;
            return rate
          })
        }
      ]
    }
  },

};
</script>

<style scoped>
  .vertical-center {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
</style>
