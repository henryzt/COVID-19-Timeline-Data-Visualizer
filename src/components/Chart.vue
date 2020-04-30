<template>
  <div class="mBlock">
    <div class="btn-group-wrap">
      <div class="btn-group btn-group-sm" role="group" aria-label="date range">
        <button type="button" class="btn btn-secondary" :class="{active: range===-7}" @click="updateRange(-7,true)">
          {{ $t('chartTimes.oneWeek') }}
        </button>
        <button type="button" class="btn btn-secondary" :class="{active: range===-14}" @click="updateRange(-14,true)">
          {{ $t('chartTimes.twoWeek') }}
        </button>
        <button type="button" class="btn btn-secondary" :class="{active: range===-31}" @click="updateRange(-31,false)">
          {{ $t('chartTimes.oneMonth') }}
        </button>
        <button type="button" class="btn btn-secondary" :class="{active: range===0}" @click="updateRange(0,false)">
          {{ $t('chartTimes.all') }}
        </button>
      </div>
    </div>

    <VueApexCharts width="100%" :type="type" :options="options" :series="series" ></VueApexCharts>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

// written by https://github.com/DaviesXue/UCLCSSA_COVID19

export default {
  name: "Chart",
  components: {
    VueApexCharts
  },
  props: {seriesData: Array,
    dataHistory:Array,
    id: String,
    type: String,
    colors: Array,
    stacked:Boolean
  },
  data: function () {
    return {
      showLabel: false,
      range: -31,
    };
  },
  methods:{
    updateRange: function (range, showLabel) {
      this.range = range;
      this.showLabel = showLabel;
      window.ga('send', 'event', "chart", "range-updated", range);
    }
  },
  computed: {
      series: function (){
        return this.seriesData.map(a => {
        a.originalData = a.originalData?a.originalData:a.data;
        a.data = a.originalData.slice(this.range);
        return a
      });
      },
      options:function (){ return  {
        chart: {
          id: this.id,
          height: 320,
          type: this.type?this.type:"line",
          stacked: this.stacked,
          zoom: {
            enabled: window.innerWidth > 800
          }
        },
        colors: this.colors?this.colors: ["#ff0000","#3d0707"],
        dataLabels: {
          enabled: this.showLabel,
          textAnchor: 'middle',
          dropShadow: {
            enabled: true,
          },
          style:{
            fontSize: "12px"
          }
        },

        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: {
          type: "datetime",
          categories: this.dataHistory
                  .map(a => {
                    return a.date;
                  })
                  .slice(this.range),
          labels: {
            format: "MM/dd",
            rotate: -10
          }
        }
      }
    }
  }
};
</script>

<style scoped></style>
