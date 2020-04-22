<template>
    <div class="mBlock">
        <div class="btn-group btn-group-sm" role="group" aria-label="date range" style="position: absolute;right: 20px;z-index: 50;" v-if="locationsData.country">
            <button type="button" class="btn btn-secondary" :class="{active: tab===0}" @click="tab = 0">
                {{$t('barRace.global')}}
            </button>
            <button type="button" class="btn btn-secondary" :class="{active: tab===1}" @click="tab = 1">
                {{$t('barRace.local')}}
            </button>
        </div>
        <Map :locationsData="tab === 1 ? locationsData.country : locationsData.world" :countryName="tab === 1 ? countryName : 'world'"></Map>
        <div style="text-align: left;opacity: 0.3;">*Data is incomplete, source: GOV.UK, isjeffcom and JHU.</div>
    </div>
</template>

<script>
    import Map from "./Map.vue";
    export default {
        name: "MapSection",
        components:{
            Map
        },
        props: {
            locationsData: Object,
            countryName: String
        },
        data: function () {
            return {
                tab: 1,
            }
        },
        mounted() {
            if(this.locationsData.country){
                this.tab = 1;
            }else {
                this.tab = 0;
            }
        }
    }
</script>

<style>

</style>