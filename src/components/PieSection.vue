<template>
    <div class="mBlock" v-if="currentData">
        <VueApexCharts width="100%" type="donut" :options="options" :series="series"></VueApexCharts>
        <SlideController v-if="date" :start-date="startDate" :end-date="endDate" :doNotFormat="true" :hidePlayButton="true" :current-date="date" @changeIndex="changeDateIdx" @playPause="playing = $event" :enableEvenIfPaused="true" :playing="false"></SlideController>
    </div>
</template>

<script>
    import VueApexCharts from "vue-apexcharts";
    import SlideController from "./SlideController";
    const moment = require('moment');
    export default {
        name: "PieSection",
        props: ['allHistoryData', 'mainDate'],
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
        watch: {
            mainDate: function () {
                if(this.mainDate) {
                    this.changeDate(this.mainDate)
                }
            }
        },
        mounted(){
            const moment = require('moment');
            this.startDate = moment(this.allHistoryData[0].date).format(window.dateFormat);
            this.endDate = moment(this.allHistoryData[this.allHistoryData.length-1].date).format(window.dateFormat);
            this.currentData = this.allHistoryData[this.allHistoryData.length-1];
            this.date = this.endDate;
        },
        computed: {
            options: function () {
                return {
                    labels: this.currentData.negative?
                        [this.$t('negative'), this.$t('totalCured'), this.$t('active'), this.$t('totalDeaths')]:
                        [this.$t('active'), this.$t('totalCured'), this.$t('totalDeaths')],
                }
            },
            series: function () {
                let d = this.currentData;
                return d.negative?
                    [d.negative, d.cured, d.confirmed - d.death - d.cured, d.death]:
                    [d.confirmed - d.death - d.cured, d.cured, d.death];
            }
        },
        methods:{
            changeDate: function(date){
                let idx = this.allHistoryData.findIndex(ele=> moment(ele.date).format(window.dateFormat) == date);
                this.date = date;
                this.changeDateIdx(idx)
            },
            changeDateIdx(e){
                this.currentData = this.allHistoryData[e];
                this.date = moment(this.currentData.date).format(window.dateFormat);
            }
        }
    }
</script>

<style scoped>

</style>