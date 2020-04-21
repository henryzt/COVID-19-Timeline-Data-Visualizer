<template>
    <div v-if="series && dates" class="mBlock">
        <VueApexCharts width="100%" type="line" :options="options" :series="series" ></VueApexCharts>
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
        props: ["globalData"],
        components:{
            VueApexCharts,
            // eslint-disable-next-line vue/no-unused-components
            vSelect
        },
        data: function () {
            return {
                dates: null
            }
        },
        computed:{
            series: function () {
                let countryArray = ["United Kingdom", "US"];
                let data = countryArray.map(country=>{
                    return {
                        name: country,
                        data: getCountryCompareData(this.globalData, country).map(a => {
                            return a.confirmed;
                        })
                    }})
                console.log(data);
                let dayCounter = 0;
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.dates = data[0].data.map(() => {
                                return "D" + (++dayCounter);
                            });
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