<template>
    <div class="mBlock">
        <div class="switch-header">
            <DataSwitch :data-type="dataType" @typeChange="changeDataType($event)"></DataSwitch>
            <CountrySwitch v-if="barRaceData.ukRegions" :tab="tab"  @changeTab="changeTab($event)"></CountrySwitch>
        </div>

        <BarRace v-if="barRaceData.global" v-show="tab===0" :raceData="barRaceData.global" :title="$t('barRace.globalTitle')" :subtitle="$t('barRace.unit')" source="Source: Johns Hopkins University" :change-label-position="true" id="2"></BarRace>
        <BarRace v-if="barRaceData.ukRegions" v-show="tab===1" :raceData="barRaceData.ukRegions" :title="$t('barRace.localTitle')" :subtitle="$t('barRace.unit')" :source="isUk?'Source: GOV.UK':'Source: Johns Hopkins University'" :change-label-position="!isUk"  id="1"></BarRace>


    </div>

</template>

<script>
    import BarRace from "./BarRace.vue";
    import DataSwitch from './DataSwitch';
    import CountrySwitch from './CountrySwitch';
    export default {
        name: "BarRaceSection",
        components:{
            BarRace,
            DataSwitch,
            CountrySwitch
        },
        props: {
            barRaceData: Object,
            isUk: Boolean
        },
        data: function () {
            return {
                tab:0
            }
        },
        methods:{
            changeTab(tab){
                this.tab = tab;
            }
        }
    }
</script>

<style scoped>

</style>