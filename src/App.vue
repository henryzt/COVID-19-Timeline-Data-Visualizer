<template>
  <div id="app">
    <div class="mContent" v-if="dataUk">
      <div class="covid_header">
        <h2>COVID-19</h2>
        <h3>实时数据动态</h3>
      </div>

      <div class="title">今日概览</div>
      <div class="overview mBlock">
        <div class="overview_item" style="color: #ff5151;">
          <div class="overview_title">累计确诊</div>
          <div class="overview_number"><ICountUp :endVal="dataUk.now[0].confirmed"/></div>
          <div class="daily-increase">{{ '+' + dataUk.regional.dailyConfirmed }}</div>
        </div>
        <div class="overview_item" style="color: #575757;">
          <div class="overview_title">累计死亡</div>
          <div class="overview_number"><ICountUp :endVal=" dataUk.now[0].death"/></div>
          <div class="daily-increase">{{ '+' + (todayData.death - yestData.death)}}</div>
        </div>
        <div class="overview_item" style="color: #0094b9;">
          <div class="overview_title">累计测试</div>
          <div class="overview_number"><ICountUp :endVal=" dataUk.now[0].tested "/></div>
          <div class="daily-increase"> {{ '+' + (todayData.tested - yestData.tested)}} </div>
        </div>
        <div class="overview_item" style="color: #28ca00;">
          <div class="overview_title">累计治愈</div>
          <div class="overview_number"><ICountUp :endVal=" dataUk.now[1].cured "/></div>
          <div class="daily-increase">{{ '+' + (todayData.cured - yestData.cured)}}</div>
        </div>
      </div>

      <div class="title">国家概览</div>
      <div class="overview mBlock">
        <div class="overview_item">
          <div class="overview_title">英格兰</div>
          <div class="overview_number"><ICountUp :endVal="dataUk.now[0].england "/></div>
          <div class="country-death">{{ dataUk.regional.englandDeceased }}</div>
        </div>
        <div class="overview_item">
          <div class="overview_title">苏格兰</div>
          <div class="overview_number"><ICountUp :endVal=" dataUk.now[0].scotland "/></div>
          <div class="country-death">{{ dataUk.regional.scottlandDeceased }}</div>
        </div>
        <div class="overview_item">
          <div class="overview_title">威尔士</div>
          <div class="overview_number"><ICountUp :endVal="dataUk.now[0].wales "/></div>
          <div class="country-death">{{ dataUk.regional.walesDeceased }}</div>
        </div>
        <div class="overview_item">
          <div class="overview_title">北爱尔兰</div>
          <div class="overview_number"><ICountUp :endVal="dataUk.now[0].nireland "/></div>
          <div class="country-death">{{ dataUk.regional.northenIrelandDeceased }}</div>
        </div>
      </div>

      <div>
        <div class="title">查询周边确诊</div>
        <div class="mBlock">
          <NearbyCasesFinder :regionData="sortedRegionData"></NearbyCasesFinder>
        </div>

      </div>

      <div id="navPlaceholder" ref="navPlaceholder"></div>
      <div class="mNav" ref="nav" id="mNavbar">
        <ul class="nav nav-pills nav-fill" v-scroll-spy-active="{selector: 'li a', class: 'active', offset: 500}" v-scroll-spy-link>
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
            <ChartSection :chart-data="dataUk.history"></ChartSection>
        </div>

          <div class="mSection" id="animation">
              <div class="title">历史确诊数据动画</div>
                <BarRaceSection v-if="barRaceData.hasData" :bar-race-data="barRaceData"></BarRaceSection>
          </div>

        <div class="mSection" id="regionData">
            <div class="title">地区列表</div>
            <RegionTable :dataNow="dataUk.now" :dataYesterday="dataUk.history[dataUk.history.length - 1]" @onRegionalDataSorted="sortedRegionData = $event"></RegionTable>
        </div>

      </div>

      <div class="mSection">
        <br>
        <div class="title">数据来源</div>
        <ul>
          <li><a href="https://github.com/isjeffcom/coronvirusFigureUK">Coronavirus UK Data API - isjeffcom</a></li>
          <li><a href="https://github.com/CSSEGISandData/COVID-19">COVID-19 Data Repository - Johns Hopkins CSSE</a></li>
          <li>感谢 <a href="https://github.com/isjeffcom/">@isjeff</a> 提供的英国数据API</li>
        </ul>

        <div class="title">关于</div>
        <ul>
          <li>本应用开源于 <a href="https://github.com/henryz00/COVID-19-Data-Visualizer-UK">Github Repository</a>，欢迎提供任何建议及贡献！</li>
          <li>© 2020 <a href="https://github.com/henryz00">@henryz00</a> and <a href="https://github.com/DaviesXue">@DaviesXue</a> for UCLCSSA.</li>

        </ul>

        <div style="text-align: center;margin: 50px 0;"><img src="./assets/logo_grey.png" style="max-width: 200px;text-align: center;opacity: 0.5;"/></div>

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
// import Chart from "./components/Chart.vue";
import RegionTable from "./components/RegionTable.vue";
import BarRaceSection from "./components/BarRaceSection.vue";
import ChartSection from "./components/ChartSection.vue";
import NearbyCasesFinder from "./components/NearbyCasesFinder.vue";
import ICountUp from 'vue-countup-v2';
import {getNHSRegionD3Data, getD3GlobalData} from "./assets/locationUtils"

export default {
  name: "App",
  components: {
    RegionTable,
    BarRaceSection,
    ChartSection,
    NearbyCasesFinder,
    ICountUp
  },
  data: () => {
    return {
      dataUk: null,
      todayData: null,
      yestData: null,
      sortedRegionData: null,
      section: 0,
      barRaceData: {
        hasData: false
      }
    };
  },
  mounted() {
    fetch("https://henryz.cc/projects/covid/api.php").then(async res => {
      let data = await res.json();
      this.dataUk = data.uk;
      console.log(data);
      //history data
      this.todayData = data.uk.history[data.uk.history.length - 1];
      this.yestData = data.uk.history[data.uk.history.length - 2];
      this.barRaceData.ukRegions = getNHSRegionD3Data(data.uk.history);
      //global data
      this.barRaceData.global = getD3GlobalData(data.global.confirmed);
      this.barRaceData.hasData = true;

      this.getNavScrollAnchor()
    });

  },
  methods: {
    getNavScrollAnchor: function () {
      document.addEventListener('scroll', ()=>{
        if(window.scrollY > this.$refs["navPlaceholder"].offsetTop){
          this.$refs["nav"].classList.add("fixed_nav");
          this.$refs["navPlaceholder"].classList.add("navPlaceholder");
        }else {
          this.$refs["nav"].classList.remove("fixed_nav");
          this.$refs["navPlaceholder"].classList.remove("navPlaceholder");
        }
      })
    }
  }

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
  h6{
    padding-left: 20px;
  }
  .covid_header{
    opacity: 0.5; padding: 20px 10px;
    text-align: right;
  }
</style>
