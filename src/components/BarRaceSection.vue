<template>
    <div class="mBlock">
        <div class="btn-group btn-group-sm" role="group" aria-label="date range" style="position: absolute;right: 20px;">
            <button type="button" class="btn btn-secondary" :class="{active: tab===0}" @click="changeTab(0)">
                {{$t('barRace.global')}}
            </button>
            <button type="button" class="btn btn-secondary" :class="{active: tab===1}" @click="changeTab(1)">
                {{$t('barRace.local')}}
            </button>
        </div>
        <BarRace v-if="barRaceData.global" v-show="tab===0" :raceData="barRaceData.global" :title="$t('barRace.globalTitle')" :subtitle="$t('barRace.unit')" source="Source: Johns Hopkins University" :change-label-position="true" id="2"></BarRace>
        <BarRace v-if="barRaceData.ukRegions" v-show="tab===1" :raceData="barRaceData.ukRegions" :title="$t('barRace.localTitle')" :subtitle="$t('barRace.unit')" source="Source: GOV.UK" id="1"></BarRace>


    </div>

</template>

<script>
    import BarRace from "./BarRace.vue";
    export default {
        name: "BarRaceSection",
        components:{
            BarRace
        },
        props: {
            barRaceData: Object,
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