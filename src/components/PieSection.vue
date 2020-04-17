<template>
    <div class="mBlock" v-if="pieData">
        <VueApexCharts width="100%" type="donut" :options="options" :series="series"></VueApexCharts>
    </div>
</template>

<script>
    import VueApexCharts from "vue-apexcharts";
    export default {
        name: "PieSection",
        props: ['pieData'],
        components:{
            VueApexCharts
        },
        computed: {
            options: function () {
                return {
                    labels: ['Negative', 'Recovered', 'Active', 'Deaths']
                }
            },
            series: function () {
                let d = this.pieData;
                return [d.negative, d.cured, d.confirmed - d.death - d.cured, d.death];
            }
        }
    }
</script>

<style scoped>

</style>