<template>
    <div class="mBlock" v-if="currentData">
        <div style="display: flex;justify-content: space-between;flex-wrap: wrap;">
            <div class="btn-group-wrap">
                <div class="btn-group btn-group-sm" role="group" aria-label="date range">
                    <button type="button" class="btn btn-secondary" :class="{active: sort===0}" @click="sortByDefault()">
                        {{$t('table.default')}}
                    </button>
                    <button type="button" class="btn btn-secondary" :class="{active: sort===1}" @click="sortByAlphabet()">
                        {{$t('table.byRegion')}}
                    </button>
                    <button type="button" class="btn btn-secondary" :class="{active: sort===2}" @click="sortByNumber()">
                        {{$t('table.byCases')}}
                    </button>
                    <button type="button" class="btn btn-secondary" :class="{active: sort===3}" @click="sortByIncreaseNumber()">
                        {{$t('table.byChanges')}}
                    </button>
                </div>
            </div>

            <div class="btn-group-wrap" v-if="regionData.uk">
                <div class="btn-group btn-group-sm" role="group" aria-label="date range">
                    <button type="button" class="btn btn-secondary" :class="{active: tab===0}" @click="changeTab(0)">
                        {{$t('barRace.global')}}
                    </button>
                    <button type="button" class="btn btn-secondary" :class="{active: tab===1}" @click="changeTab(1)">
                        {{$t('barRace.local')}}
                    </button>
                </div>
            </div>
        </div>

        <div>
            <table class="table table-striped table-hover" style="position: relative;border-collapse: collapse; ">
                <thead>
                <tr>
                    <th scope="col">{{$t('table.region')}}</th>
                    <th scope="col" nowrap>{{$t('table.cases')}}</th>
                    <th scope="col" nowrap>{{$t('table.changes')}}</th>
                </tr>
                </thead>
                <tbody>
                <tr class="singleRegionData" v-for="singleRegion in tableData.slice(0, limit)" :key="singleRegion.id">
                    <td>{{ singleRegion.location }}</td>
                    <td>{{ singleRegion.number }}</td>
                    <td>{{ singleRegion.change }}</td>
                </tr>
                <tr></tr>
                </tbody>
            </table>
            <div class="showAll" @click="limit=(limit===10)?tableData.length:10">{{(limit===10)?$t('table.showAll'):$t('table.showLess')}}</div>
        </div>
        <div :class="(limit===10)?'':'stick'">
            <SlideController v-if="date" :start-date="currentData[0].date" :end-date="currentData[currentData.length-1].date"
                             :hidePlayButton="true" :current-date="date" @change="changeDate" @playPause="playing = $event"
                             :enableEvenIfPaused="true" :playing="false"></SlideController>
        </div>
    </div>
</template>

<script>
    // eslint-disable-next-line no-unused-vars
    import {filterRegionDataHasData} from "../js/locationUtils"
    import SlideController from './SlideController'
    export default {
        name: "RegionTable",
        props: ["regionData","mainDate"],
        components: {
            SlideController
        },
        data: function (){
            return {
                tableData: [],
                sort: 0,
                limit: 10,
                date: null,
                currentData: null,
                tab: 1
            }
        },
        mounted(){
            if(this.regionData.uk && this.regionData.uk[0].arr.length>1){
                this.changeTab(1)
            }else {
                this.changeTab(0)
            }
        },
        watch: {
            mainDate: function () {
                if(this.mainDate) {
                    this.changeDate(this.mainDate)
                }
            }
        },
        methods:{
            getCurrentTableData: function(current){
                this.date = current[current.length-1].date;
                this.currentData = current;
                this.updateTableData(current.length-1)
            },

            changeDate: function(date){
                let idx = this.currentData.findIndex(ele=>ele.date == date);
                this.date = date;
                this.updateTableData(idx)
            },

            changeTab(tab){
                if(tab===0){
                    this.getCurrentTableData(this.regionData.global)
                }else {
                    this.getCurrentTableData(this.regionData.uk)
                }
                this.tab = tab;
            },

            updateTableData: function(currentIndex){
                // const moment = require('moment');
                let current = this.currentData[currentIndex]?.arr;
                let last = this.currentData[currentIndex-1]?.arr;
                let id = 0;
                for (let region of current)
                {
                    let lastData = last?.find(element => element.location == region.location);
                    region.id = id++;
                    let change = lastData? region.number - lastData.number : 0;
                    region.change = (change>0?"+":"") + change
                }
                this.tableData = current;
                this.sortTable()
            },

            sortTable: function(){
              switch (this.sort) {
                  case 0:
                      this.sortByDefault();
                      break;
                  case 1:
                      this.sortByAlphabet();
                      break;
                  case 2:
                      this.sortByNumber();
                      break;
                  case 3:
                      this.sortByIncreaseNumber();
                      break;
              }
            },

            sortByDefault:function () {
                this.sort = 0;
                this.tableData = [...this.tableData].sort((a, b) => b.id - a.id);
            },
            sortByAlphabet:function () {
                this.sort = 1;
                this.tableData = [...this.tableData].sort((a, b) => a.location.localeCompare(b.location));
            },
            sortByNumber:function () {
                this.sort = 2;
                this.tableData = [...this.tableData].sort((a, b) => b.number - a.number);
            },
            sortByIncreaseNumber:function () {
                this.sort = 3;
                this.tableData = [...this.tableData].sort((a, b) => b.change - a.change);
            }
        }
    }
</script>

<style scoped>
    .table{
        font-size: 14px;
        border-collapse: collapse;
    }
    th{
        position: sticky;
        top:55px;
        background: white;
    }
    .showAll{
        text-align: center;
        cursor: pointer;
        color: #0099db;
    }
    .stick{
        position: sticky;bottom:0;
        border-top: solid 1px whitesmoke;
        background:white;padding: 0 10px;
        padding-bottom: 50px;
    }
</style>