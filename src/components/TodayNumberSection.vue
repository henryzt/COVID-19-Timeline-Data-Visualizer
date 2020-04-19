<template>
    <div>
        <div class="title">{{ $t('subtitles.today') }}</div>
        <div class="overview mBlock">
            <div class="overview_item" style="color: #ff5151;">
                <div class="overview_title">{{ $t('totalConfirmed') }}</div>
                <div class="overview_number"><ICountUp :endVal="display.confirmed"/></div>
                <div class="daily-increase">{{ '+' + display.confirmedChange }}</div>
            </div>
            <div class="overview_item" style="color: #575757;">
                <div class="overview_title">{{ $t('totalDeaths') }}</div>
                <div class="overview_number"><ICountUp :endVal="display.deaths "/></div>
                <div class="daily-increase">{{ '+' + display.deathsChange}}</div>
            </div>
            <div class="overview_item" style="color: #0094b9;" v-if="display.tested">
                <div class="overview_title">{{ $t('totalTests') }}</div>
                <div class="overview_number"><ICountUp :endVal=" display.tested "/></div>
                <div class="daily-increase"> {{ '+' + display.testedChange }} </div>
            </div>
            <div class="overview_item" style="color: #28ca00;">
                <div class="overview_title">{{ $t('totalCured') }}</div>
                <div class="overview_number"><ICountUp :endVal=" display.cured "/></div>
                <div class="daily-increase">{{ '+' + display.curedChange }}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import ICountUp from 'vue-countup-v2';
    export default {
        name: "TodayNumberSection",
        props: ["display"],
        components:{
            ICountUp
        }
    }
</script>

<style scoped>

</style>