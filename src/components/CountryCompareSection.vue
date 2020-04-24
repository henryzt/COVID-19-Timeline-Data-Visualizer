<template>
    <div v-if="series && dates" class="mBlock" style="color: grey">

        <DataSwitch :data-type="dataType" @typeChange="dataType = $event"></DataSwitch>

        <div style="padding-bottom: 10px;font-size: 12px;">*{{$t("compareNote")}}</div>

        <VueApexCharts width="100%" height="320" type="line" :options="options" :series="series" v-if="selectedCountries.length>0"></VueApexCharts>

        {{$t("compareSelect")}}
        <v-select
                multiple
                placeholder="Select countries to compare"
                label="countries"
                v-model="selectedCountries"
                :options="countryListFiltered"
                :selectable="() => selectedCountries.length < 10"
        />
    </div>
</template>

<script>
    import VueApexCharts from "vue-apexcharts";
    import vSelect from 'vue-select'
    import DataSwitch from './DataSwitch';
    import {
        getCountryCompareData
    } from "../js/locationUtils"
    export default {
        name: "CountryCompareSection",
        props: ["globalData", "countryList"],
        components:{
            VueApexCharts,
            vSelect,
            DataSwitch
        },
        data: function () {
            return {
                countryListFiltered: [],
                selectedCountries: ["United Kingdom", "Spain", "France", "Italy", "Germany"],
                dates: null,
                dataType: "confirmed",
                series: null
            }
        },
        mounted(){
            if(!window.calculatedCountryData){
                window.calculatedCountryData = {}
            }
            this.countryListFiltered = this.countryList.slice(3);
            this.getSeries();
        },
        watch:{
          selectedCountries:function () {
              this.getSeries();
              window.ga('send', 'event', "compare", "countries-loaded", this.selectedCountries.toString());
          },
          dataType:function () {
              this.getSeries();
              window.ga('send', 'event', "compare", "type-changed", this.dataType);
          }
        },
        methods:{
            getSeries: function () {
                if(this.selectedCountries.length===0) return [];
                let data = this.selectedCountries.map(country=>{
                    let countryData;
                    if(window.calculatedCountryData[country]){
                        countryData = window.calculatedCountryData[country]
                    }else{
                        countryData = getCountryCompareData(this.globalData, country, 50);
                        window.calculatedCountryData[country] = countryData
                    }
                    return {
                        name: country,
                        data: countryData?.map(a => {
                            if(this.dataType==="active") {
                                return a.confirmed - a.death - a.cured;
                            }else if(this.dataType==="dRate"){
                                return (a.death / a.confirmed).toPrecision(2);
                            }else if(this.dataType==="cRate"){
                                return (a.cured / a.confirmed).toPrecision(2);
                            }else {
                                return a[this.dataType];
                            }
                        })
                    }});
                console.log(data);
                let maxLen = Math.max.apply(Math, data.map(a => a.data.length));
                let dateArr = Array.from(Array(maxLen).keys());
                // ref https://stackoverflow.com/questions/3746725/
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.dates = dateArr.map((d) => {
                    return "D" + d;
                });
                this.series = data;
            },
        },
        computed:{
            options:function () { return  {
                chart: {
                    id: "cc",
                    height: 320,
                    type: "line",
                    stacked: false,
                    zoom: {
                        enabled: window.innerWidth > 800
                    }
                },
                tooltip:{
                    shared: true,
                    intersect: false,
                    x: { formatter: (val) => { return "Day "+val; } }
                },
                stroke: {
                    width: 3
                },
                grid: {
                    row: {
                        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                        opacity: 0.5
                    }
                },
                xaxis: {
                    type: "text",
                    categories: this.dates,
                    labels: {
                        rotate: -10
                    }
                },
                yaxis: {
                    logarithmic: false,
                    decimalsInFloat: 2
                }
            }
        }
        }
    }
</script>

<style scoped>

</style>