<template>
    <div>
        <div class="date">{{date}}</div>
        <div class="title">{{ $t('subtitles.today') }}</div>
        <div class="overview mBlock">
            <div class="overview_item" style="color: var(--red);">
                <div class="overview_title">{{ $t('totalConfirmed') }}</div>
                <div class="overview_number">{{ num(displayData.confirmed) }}</div>
                <div class="daily-increase">{{ '+' + display.confirmedChange }}</div>
            </div>
            <div class="overview_item" style="color: var(--black);">
                <div class="overview_title">{{ $t('totalDeaths') }}</div>
                <div class="overview_number">{{ num(displayData.deaths) }}</div>
                <div class="daily-increase">{{ '+' + display.deathsChange}}</div>
            </div>
            <div class="overview_item" style="color: var(--blue);" v-if="display.tested">
                <div class="overview_title">{{ $t('totalTests') }}</div>
                <div class="overview_number">{{ num(displayData.tested) }}</div>
                <div class="daily-increase"> {{ '+' + display.testedChange }} </div>
            </div>
            <div class="overview_item" style="color: var(--green);" v-if="display.admission">
                <div class="overview_title">{{ $t('hospitalCases') }}</div>
                <div class="overview_number">{{ num(displayData.admission) }}</div>
                <div class="daily-increase"> {{ '+' + display.admissionChange }} </div>
            </div>
            <div class="overview_item" style="color: var(--green);" v-if="display.cured != undefined">
                <div class="overview_title">{{ $t('totalCured') }}</div>
                <div class="overview_number">{{ num(displayData.cured) }}</div>
                <div class="daily-increase">{{ '+' + display.curedChange }}</div>
            </div>
        </div>
    </div>
</template>

<script>
    const moment = require('moment');

    export default {
        name: "TodayNumberSection",
        props: ["display"],
        data: function(){
            return {
                displayData: {
                    confirmed: 0,
                    deaths: 0,
                    tested: 0,
                    admission: 0,
                    cured: 0
                },
                date: moment().format("YYYY-MM-DD")
            }
        },
        watch: {
          display() {
              this.displayData = this.display;
          }
        },
        mounted(){
            this.displayData = this.display;
        },
        methods:{
          num(x) {
                return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        }
    }
</script>

<style scoped>
.date{
    float:right;
    margin-top: -3px;
    opacity: 0.5;
}
</style>