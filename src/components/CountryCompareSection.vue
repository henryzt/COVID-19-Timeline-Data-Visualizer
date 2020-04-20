<template>
    <div v-if="chartData && dates">
        <Chart
                id="deathChart2"
                type="line"
                :dataHistory="dates"
                :seriesData="chartData"
                :colors='["#c40000","#3d000d","#2c9100"]'
        ></Chart>
    </div>
</template>

<script>
    import Chart from "./Chart.vue";
    import vSelect from 'vue-select'
    import {
        getCountryData, getCountryHistoryData
    } from "../js/locationUtils"
    export default {
        name: "CountryCompareSection",
        props: ["globalData"],
        components:{
            Chart,
            // eslint-disable-next-line vue/no-unused-components
            vSelect
        },
        data: function () {
            return {
                dates: null
            }
        },
        computed:{
            chartData: function () {
                let uk = getCountryHistoryData(getCountryData(this.globalData, "United Kingdom"));
                let us = getCountryHistoryData(getCountryData(this.globalData, "US"));
                console.log(uk, this.globalData);
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.dates = uk.map(a => {
                                return {date: a.date};
                            });
                return [
                    {
                        name: "UK",
                        data: uk.map(a => {
                            return a.confirmed;
                        })
                    },
                    {
                        name: "US",
                        data: us.map(a => {
                            return a.confirmed;
                        })
                    }
                ]
            }
        }
    }
</script>

<style scoped>

</style>