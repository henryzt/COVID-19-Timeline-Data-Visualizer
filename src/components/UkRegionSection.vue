<template>
    <div>
        <div class="title">{{ $t('subtitles.country') }}</div>
        <div class="overview mBlock">
            <div class="overview_item">
                <div class="overview_title">{{ $t('england') }}</div>
                <div class="overview_number"><ICountUp :endVal="dataUk.now[0].england "/></div>
                <div class="country-death">{{ dataUk.regional.englandDeceased }}</div>
            </div>
            <div class="overview_item">
                <div class="overview_title">{{ $t('scotland') }}</div>
                <div class="overview_number"><ICountUp :endVal=" dataUk.now[0].scotland "/></div>
                <div class="country-death">{{ dataUk.regional.scottlandDeceased }}</div>
            </div>
            <div class="overview_item">
                <div class="overview_title">{{ $t('wales') }}</div>
                <div class="overview_number"><ICountUp :endVal="dataUk.now[0].wales "/></div>
                <div class="country-death">{{ dataUk.regional.walesDeceased }}</div>
            </div>
            <div class="overview_item">
                <div class="overview_title">{{ $t('nIreland') }}</div>
                <div class="overview_number"><ICountUp :endVal="dataUk.now[0].nireland "/></div>
                <div class="country-death">{{ dataUk.regional.northenIrelandDeceased }}</div>
            </div>
        </div>

        <div class="title">{{ $t('subtitles.nearby') }}</div>
        <div class="mBlock">
            <NearbyCasesFinder :regionData="sortedRegionData"></NearbyCasesFinder>
        </div>

    </div>
</template>

<script>
    import NearbyCasesFinder from "./NearbyCasesFinder.vue";
    import ICountUp from 'vue-countup-v2';
    export default {
        name: "UkRegionSection",
        props: ["dataUk", "sortedRegionData"],
        components:{
            ICountUp,
            NearbyCasesFinder
        }
    }
</script>

<style scoped>

</style>