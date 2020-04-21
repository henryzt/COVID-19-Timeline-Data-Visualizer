<template>
    <div v-if="series && dates" class="mBlock" style="color: grey">

        <div class="btn-group-wrap">
            <div class="btn-group btn-group-sm" role="group" aria-label="date range">
                <button type="button" class="btn btn-secondary" :class="{active: dataType==='confirmed'}" @click="dataType='confirmed'">
                    {{ $t('totalConfirmed') }}
                </button>
                <button type="button" class="btn btn-secondary" :class="{active: dataType==='active'}" @click=" dataType='active'">
                    {{ $t('active') }}
                </button>
                <button type="button" class="btn btn-secondary" :class="{active: dataType==='death'}" @click=" dataType='death'">
                    {{ $t('totalDeaths') }}
                </button>
                <button type="button" class="btn btn-secondary" :class="{active: dataType==='cured'}" @click="dataType='cured'">
                    {{ $t('totalCured') }}
                </button>
            </div>
        </div>

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
    import {
        getCountryCompareData
    } from "../js/locationUtils"
    export default {
        name: "CountryCompareSection",
        props: ["globalData", "countryList"],
        components:{
            VueApexCharts,
            vSelect
        },
        data: function () {
            return {
                countryListFiltered: [],
                selectedCountries: ["United Kingdom", "Spain", "France", "Italy", "Germany"],
                dates: null,
                dataType: "confirmed"
            }
        },
        mounted(){
            this.countryListFiltered = this.countryList.slice(2)
        },
        computed:{
            series: function () {
                if(this.selectedCountries.length===0) return [];
                let data = this.selectedCountries.map(country=>{
                    return {
                        name: country,
                        data: getCountryCompareData(this.globalData, country)?.map(a => {
                            if(this.dataType==="active"){
                                return a.confirmed - a.death - a.cured;
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
                window.ga('send', 'event', "compare", "countries-loaded", this.selectedCountries);
                return data;
            },
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
                }
            }
        }
        }
    }
</script>

<style scoped>

</style>