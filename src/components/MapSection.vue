<template>
    <div class="mBlock" v-if="renderComponent">
        <div class="btn-group btn-group-sm" role="group" aria-label="date range" style="position: absolute;right: 20px;z-index: 50;" v-if="isUK">
            <button type="button" class="btn btn-secondary" :class="{active: tab===0}" @click="changeTab(0)">
                {{$t('barRace.global')}}
            </button>
            <button type="button" class="btn btn-secondary" :class="{active: tab===1}" @click="changeTab(1)">
                {{$t('barRace.local')}}
            </button>
        </div>
        <Map :locationsData="locationsData" :countryName="tab === 1 ? countryName : 'world'"></Map>
        <div style="text-align: left;opacity: 0.3;">*Data is incomplete, source: GOV.UK, isjeffcom and JHU.</div>

        <SlideController v-if="date" :start-date="currentData[0].date" :end-date="currentData[currentData.length-1].date"
                         :hidePlayButton="true" :current-date="date"
                         :enableEvenIfPaused="true" :playing="false"></SlideController>
    </div>
</template>

<script>
    import Map from "./Map.vue";
    import {
        combineUKHighCharts,
        combineWorldHighCharts
    } from "../js/locationUtils"
    import SlideController from './SlideController'
    export default {
        name: "MapSection",
        components:{
            SlideController,
            Map
        },
        props: {
            tableData: Object,
            countryName: String
        },
        data: function () {
            return {
                currentData: null,
                tab: 1,
                locationsData: null,
                isUK: true,
                date: null,
                renderComponent: true
            }
        },
        mounted() {
            this.isUK = this.countryName==="UK";
            this.changeTab(this.isUK ? 1 : 0);
        },
        methods: {
            changeTab(tab){
                this.tab = tab;
                if(this.isUK && this.tab === 1){
                    this.currentData = this.tableData.uk;
                }else {
                    this.currentData = this.tableData.global;
                }
                this.date = this.currentData[this.currentData.length-1].date;
                this.loadMap()
            },
            loadMap(){
                 let idx = this.currentData.findIndex(ele=>ele.date === this.date);
                 if(this.tab === 1) {
                     this.locationsData = combineUKHighCharts(this.currentData[idx].arr);
                 }else{
                     this.locationsData = combineWorldHighCharts(this.currentData[idx].arr);
                 }
                 this.forceRerender()
              },
              forceRerender() {
                    this.renderComponent = false;
                    this.$nextTick(() => {
                        this.renderComponent = true;
                    });
               }

        }
    }
</script>

<style>

</style>