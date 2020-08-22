<template>
    <div>
        <div class="title">{{ $t('subtitles.today') }}</div>
        <div class="overview mBlock">
            <div class="overview_item" style="color: #ff5151;">
                <div class="overview_title">{{ $t('totalConfirmed') }}</div>
                <div class="overview_number"><Countup :instant="instant" :number="displayData.confirmed"/></div>
                <div class="daily-increase">{{ '+' + display.confirmedChange }}</div>
            </div>
            <div class="overview_item" style="color: #575757;">
                <div class="overview_title">{{ $t('totalDeaths') }}</div>
                <div class="overview_number"><Countup :instant="instant" :number="displayData.deaths "/></div>
                <div class="daily-increase">{{ '+' + display.deathsChange}}</div>
            </div>
            <div class="overview_item" style="color: #0094b9;" v-if="display.tested">
                <div class="overview_title">{{ $t('totalTests') }}</div>
                <div class="overview_number"><Countup :instant="instant" :number=" displayData.tested "/></div>
                <div class="daily-increase"> {{ '+' + display.testedChange }} </div>
            </div>
            <div class="overview_item" style="color: #28ca00;">
                <div class="overview_title">{{ $t('totalCured') }}</div>
                <div class="overview_number"><Countup :instant="instant" :number=" displayData.cured "/></div>
                <div class="daily-increase">{{ '+' + display.curedChange }}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import Countup from "./Countup.vue";
    let timeout = null;
    export default {
        name: "TodayNumberSection",
        props: ["display", "instant"],
        data: function(){
            return {
                displayData: {
                    confirmed: 0,
                    deaths: 0,
                    tested: 0,
                    cured: 0
                }
            }
        },
        watch: {
          display: function () {
              this.updateDisplay()
          }
        },
        mounted(){
            this.updateDisplay()
        },
        methods:{
          updateDisplay(){
              clearTimeout(timeout);
              timeout = setTimeout(()=>{
                  this.displayData = this.display;
              },100);
          }
        },
        components:{
            Countup
        }
    }
</script>

<style scoped>

</style>