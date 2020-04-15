<template>
    <div class="mBlock" v-if="currentData">
        <div class="btn-group-wrap">
            <div class="btn-group btn-group-sm" role="group" aria-label="date range">
                <button type="button" class="btn btn-secondary" :class="{active: sort===0}" @click="sortByDefault()">
                    默认排序
                </button>
                <button type="button" class="btn btn-secondary" :class="{active: sort===1}" @click="sortByAlphabet()">
                    按地区
                </button>
                <button type="button" class="btn btn-secondary" :class="{active: sort===2}" @click="sortByNumber()">
                    按人数
                </button>
                <button type="button" class="btn btn-secondary" :class="{active: sort===3}" @click="sortByIncreaseNumber()">
                    按变化
                </button>
            </div>
        </div>

        <div>
            <table class="table table-striped table-hover" style="position: relative;border-collapse: collapse; ">
                <thead>
                <tr>
                    <th scope="col">NHS地区</th>
                    <th scope="col" nowrap>确诊人数</th>
                    <th scope="col" nowrap>较上次</th>
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
            <div class="showAll" @click="limit=(limit===10)?tableData.length:10">{{(limit===10)?"Show All":"Show Less"}}</div>
        </div>
        <SlideController v-if="date" :start-date="currentData[0].date" :end-date="currentData[currentData.length-1].date" :hidePlayButton="true" :current-date="date" @change="changeDate" @playPause="playing = $event" :enableEvenIfPaused="true" :playing="false"></SlideController>
    </div>
</template>

<script>
    // eslint-disable-next-line no-unused-vars
    import {filterRegionDataHasData} from "../assets/locationUtils"
    import SlideController from './SlideController'
    export default {
        name: "RegionTable",
        props: ["regionData"],
        components: {
            SlideController
        },
        data: function (){
            return {
                tableData: [],
                sort: 0,
                limit: 10,
                date: null,
                currentData: null
            }
        },
        mounted(){
            this.getCurrentTableData(this.regionData.uk)
        },
        methods:{
            getCurrentTableData: function(current){
                this.date = this.date?this.date:current[current.length-1].date;
                this.currentData = current;
                this.updateTableData(current.length-1)
            },

            changeDate: function(date){
                let idx = this.currentData.findIndex(ele=>ele.date == date);
                this.date = date;
                this.updateTableData(idx)
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
</style>