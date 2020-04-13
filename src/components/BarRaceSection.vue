<template>
    <div class="mBlock">
        <div class="btn-group btn-group-sm" role="group" aria-label="date range" style="position: absolute;right: 20px;">
            <button type="button" class="btn btn-secondary" :class="{active: tab===0}" @click="changeTab(0)">
                全球
            </button>
            <button type="button" class="btn btn-secondary" :class="{active: tab===1}" @click="changeTab(1)">
                英国
            </button>
        </div>
        <BarRace v-show="tab===0" :raceData="barRaceData.global" title="全球确诊数据" subtitle="确诊人数（例）" source="Source: Johns Hopkins University" :change-label-position="true" id="2"></BarRace>
        <BarRace v-show="tab===1" :raceData="barRaceData.ukRegions" title="NHS地区确诊数据" subtitle="确诊人数（例）" source="Source: isjeff.com" id="1"></BarRace>


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