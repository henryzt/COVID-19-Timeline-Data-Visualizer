<template>
    <div class="mBlock" v-if="currentData">
        <VueApexCharts width="100%" type="donut" :options="options" :series="series"></VueApexCharts>
        <SlideController v-if="date" :start-date="startDate" :end-date="endDate" :doNotFormat="true" :hidePlayButton="true" :current-date="date" @changeIndex="changeDate" @playPause="playing = $event" :enableEvenIfPaused="true" :playing="false"></SlideController>
    </div>
</template>

<script>
    import VueApexCharts from "vue-apexcharts";
    import SlideController from "./SlideController";
    export default {
        name: "PieSection",
        props: ['allHistoryData'],
        components:{
            VueApexCharts,
            SlideController
        },
        data: function(){
            return {
                date: null,
                currentData: null,
                startDate: null,
                endDate: null,
            }
        },
        mounted(){
            const moment = require('moment');
            this.startDate = moment(this.allHistoryData[0].date).format('DD/MM');
            this.endDate = moment(this.allHistoryData[this.allHistoryData.length-1].date).format('DD/MM');
            this.currentData = this.allHistoryData[this.allHistoryData.length-1];
            this.date = this.endDate;
        },
        computed: {
            options: function () {
                return {
                    labels: [this.$t('negative'), this.$t('totalCured'), this.$t('active'), this.$t('totalDeaths')]
                }
            },
            series: function () {
                let d = this.currentData;
                return [d.negative, d.cured, d.confirmed - d.death - d.cured, d.death];
            }
        },
        methods:{
            changeDate(e){
                const moment = require('moment');
                this.currentData = this.allHistoryData[e];
                this.date = moment(this.currentData.date).format('DD/MM');
            }
        }
    }
</script>

<style scoped>

</style>