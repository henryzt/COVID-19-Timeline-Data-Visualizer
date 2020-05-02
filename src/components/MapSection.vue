<template>
    <div class="mBlock">
        <div class="switch-header">
            <DataSwitch :data-type="dataType" @typeChange="changeDataType($event)" :disabled="tab === 1 && isUk"></DataSwitch>
            <CountrySwitch v-if="isUk || isUs" :tab="tab" @changeTab="changeTab($event)"></CountrySwitch>
        </div>

        <Map v-if="renderComponent && isDataAvailable" :locationsData="locationsData" :countryName="tab === 1 ? countryName : 'world'" :is-rate="dataType.includes('Rate')"></Map>

        <div v-else style="padding: 30px;text-align: center;">{{$t('noData')}}</div>

        <div style="text-align: left;opacity: 0.3;">*Data is incomplete, source: GOV.UK, isjeffcom and JHU.</div>

        <SlideController v-if="date" :start-date="currentData[0].date" :end-date="currentData[currentData.length-1].date"
                         :hidePlayButton="true" :current-date="date" @change="changeDate" :lazy="false"
                         :enableEvenIfPaused="true" :playing="false"></SlideController>
    </div>
</template>

<script>
    import Map from "./Map.vue";
    import DataSwitch from './DataSwitch';
    import CountrySwitch from './CountrySwitch';
    import {
        combineUKHighCharts,
        combineUSHighCharts,
        combineWorldHighCharts,
        getSmallerDate
    } from "../js/locationUtils"
    import SlideController from './SlideController'
    export default {
        name: "MapSection",
        components:{
            SlideController,
            Map,
            DataSwitch,
            CountrySwitch
        },
        props: {
            tableData: Object,
            countryName: String,
            mainDate: String
        },
        data: function () {
            return {
                currentData: null,
                tab: 1,
                locationsData: null,
                isUk: true,
                isUs: false,
                isDataAvailable: true,
                date: null,
                renderComponent: true,
                dataType: "confirmed"
            }
        },
        mounted() {
            this.isUk = this.countryName==="UK";
            this.isUs = this.countryName==="US";
            this.changeTab(this.isUk || this.isUs ? 1 : 0);
        },
        watch: {
            mainDate: function () {
                if(this.mainDate) {
                    let dateToChange = getSmallerDate(this.mainDate, this.currentData[this.currentData.length-1].date);
                    this.changeDate(dateToChange)
                }
            }
        },
        methods: {
            changeDate: function(date){
                this.date = date;
                this.loadMap()
            },
            changeTab(tab){
                this.tab = tab;
                if((this.isUk || this.isUs) && this.tab === 1){
                    this.currentData = this.tableData.country;
                }else {
                    this.currentData = this.tableData.global;
                }
                this.date = this.currentData[this.currentData.length-1].date;
                this.loadMap(true)
            },
            changeDataType(type){
                this.dataType = type;
                this.loadMap()
            },
            async loadMap(rerender){
                 let idx = this.currentData.findIndex(ele=>ele.date === this.date);
                this.isDataAvailable = true;
                 if(this.tab === 1) {
                     if(this.isUk) {
                         this.locationsData = combineUKHighCharts(this.currentData[idx].arr);
                     }else {
                         this.isDataAvailable = !(this.isUs && (this.dataType === "cured" || this.dataType === "cRate"));
                         this.locationsData = combineUSHighCharts(this.currentData[idx].arr, this.dataType);
                     }
                 }else{
                     this.locationsData = combineWorldHighCharts(this.currentData[idx].arr, this.dataType);
                 }
                 if(rerender)
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