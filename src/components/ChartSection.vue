<template>
    <div>
        <div class="title">确诊及死亡</div>
        <Chart
                id="confirmedAndDeathChart1"
                type="area"
                :dataHistory="ChartData"
                :seriesData="confirmedAndDeathChart1"
        ></Chart>


        <div class="title">新增死亡</div>
        <Chart
                id="deathChart2"
                type="bar"
                :stacked="true"
                :dataHistory="ChartData"
                :seriesData="deathChart2"
                :colors='["#c40000","#3d000d","#2c9100"]'
        ></Chart>

        <div class="title">死亡率及治愈率</div>
        <Chart
                id="rateChart3"
                type="area"
                :dataHistory="ChartData"
                :seriesData="rateChart3"
                :colors='["#ca0011","#0088ff"]'
        ></Chart>
    </div>
</template>

<script>
    import Chart from "./Chart.vue";
    export default {
        name: "ChartSection",
        props: ["ChartData"],
        components: {
           Chart
        },
        computed: {
            confirmedAndDeathChart1: function () {
                return [
                    {
                        name: '总确诊',
                        data: this.ChartData.map(a => {
                            return a.confirmed;
                        })
                    },
                    {
                        name: '总死亡',
                        data: this.ChartData.map(a => {
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
                        data: this.ChartData.map(a => {
                            let newConfirmed = a.confirmed - lastConfirmed;
                            lastConfirmed = a.confirmed;
                            return newConfirmed
                        })
                    },
                    {
                        name: '新增死亡',
                        data: this.ChartData.map(a => {
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
                        data: this.ChartData.map(a => {
                            let rate = (a.death / a.confirmed).toPrecision(2) ;
                            return rate
                        })
                    },
                    {
                        name: '治愈率',
                        data: this.ChartData.map(a => {
                            let rate = (a.cured / a.confirmed).toPrecision(2) ;
                            return rate
                        })
                    }
                ]
            }
        },
    }
</script>

<style scoped>

</style>