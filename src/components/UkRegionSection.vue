<template>
    <div>
        <div class="title">{{ $t('subtitles.country') }}</div>
        <div class="overview mBlock">
            <div class="overview_item">
                <div class="overview_title">{{ $t('england') }}</div>
                <div class="overview_number"><ICountUp :endVal="dataUk.regional.englandConfirmed "/></div>
                <div class="country-death">{{ dataUk.regional.englandDeceased }}</div>
            </div>
            <div class="overview_item">
                <div class="overview_title">{{ $t('scotland') }}</div>
                <div class="overview_number"><ICountUp :endVal=" dataUk.regional.scotlandConfirmed "/></div>
                <div class="country-death">{{ dataUk.regional.scotlandDeceased }}</div>
            </div>
            <div class="overview_item">
                <div class="overview_title">{{ $t('wales') }}</div>
                <div class="overview_number"><ICountUp :endVal="dataUk.regional.walesConfirmed "/></div>
                <div class="country-death">{{ dataUk.regional.walesDeceased }}</div>
            </div>
            <div class="overview_item">
                <div class="overview_title">{{ $t('nIreland') }}</div>
                <div class="overview_number"><ICountUp :endVal="dataUk.regional.northenIrelandConfirmed "/></div>
                <div class="country-death">{{ dataUk.regional.northenIrelandDeceased }}</div>
            </div>
        </div>

    </div>
</template>

<script>
    import ICountUp from 'vue-countup-v2';
    export default {
        name: "UkRegionSection",
        props: ["dataUk"],
        components:{
            ICountUp
        }
    }
</script>

<style scoped>

</style>