<template>
    <div class="mBlock" v-if="currentData">

        <div class="switch-header">
            <DataSwitch :data-type="dataType" @typeChange="changeDataType($event)" :disabled="tab === 1 && isUk"></DataSwitch>
            <CountrySwitch v-if="regionData.country" :tab="tab"  @changeTab="changeTab($event)"></CountrySwitch>
        </div>

        <div v-if="tableData">
            <table class="table table-striped table-hover" style="position: relative;border-collapse: collapse; " :class="{topZero: desktopLayout}">
                <thead>
                <tr>
                    <th scope="col" :class="{active: sort===1}" @click="sortByAlphabet()">{{$t('table.region')}}<SortIcon/></th>
                    <th scope="col" :class="{active: sort===2}" @click="sortByNumber()" nowrap>{{$t('table.byCases')}}<SortIcon/></th>
                    <th scope="col" :class="{active: sort===3}" @click="sortByIncreaseNumber()" nowrap>{{$t('table.changes')}}<SortIcon/></th>
                </tr>
                </thead>
                <tbody>
                <tr class="singleRegionData" v-for="singleRegion in tableData.slice(0, limit)" :key="singleRegion.id">
                    <td>
                        <div class="goToCountry" v-if="tab===0" @click="switchCountry(singleRegion.location)">{{ singleRegion.location }}<MoreIcon/></div>
                        <div v-else>{{ singleRegion.location }}</div>
                    </td>
                    <td>{{ isRate ? singleRegion[dataType].toFixed(2) : singleRegion[dataType]}}</td>
                    <td>{{ singleRegion.change }}</td>
                </tr>
                <tr></tr>
                </tbody>
            </table>
        </div>
        <div v-else style="padding: 30px;text-align: center;">{{$t('noData')}}</div>
        <div :class="(limit===10)?'':'stick'">
            <div v-if="tableData" class="showAll" @click="limit=(limit===10)?tableData.length:10">{{(limit===10)?$t('table.showAll'):$t('table.showLess')}}</div>
            <SlideController v-if="date" :start-date="currentData[0].date" :end-date="currentData[currentData.length-1].date"
                             :hidePlayButton="true" :current-date="date" @change="changeDate" @playPause="playing = $event"
                             :enableEvenIfPaused="true" :playing="false"></SlideController>
        </div>
    </div>
</template>

<script>
    import SlideController from './SlideController'
    import SortIcon from 'mdi-vue/SortAscending'
    import MoreIcon from 'mdi-vue/ChevronRight'
    import DataSwitch from './DataSwitch';
    import CountrySwitch from './CountrySwitch';
    import { getSmallerDate } from '../js/locationUtils'
    export default {
        name: "RegionTable",
        props: ["regionData","mainDate","isUk","currentCountry","desktopLayout"],
        components: {
            SlideController,
            SortIcon,
            DataSwitch,
            CountrySwitch,
            MoreIcon
        },
        data: function (){
            return {
                tableData: [],
                sort: 2,
                limit: 10,
                date: null,
                currentData: null,
                tab: 1,
                dataType: "confirmed"
            }
        },
        mounted(){
            if(this.regionData.country && this.regionData.country[this.regionData.country.length-1].arr.length>1){
                this.changeTab(1)
            }else {
                this.changeTab(0)
            }
        },
        watch: {
            mainDate: function () {
                if(this.mainDate) {
                    let dateToChange = getSmallerDate(this.mainDate, this.currentData[this.currentData.length-1].date);
                    this.changeDate(dateToChange)
                }
            }
        },
        computed:{
          isRate: function () {
              return this.dataType.includes('Rate')
          }
        },
        methods:{
            switchCountry(e){
                window.scrollTo(0,0);
                window.ga('send', 'event', "country", "country-changed-from-table", e);
                this.$emit("switchCountry", e);
            },

            changeDataType(type){
                this.dataType = type;
                this.changeTab(this.tab)
            },

            getCurrentTableData: function(current){
                if(!current.find(ele=>ele.date===this.date))
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
                    if(this.dataType === "number") this.dataType = "confirmed";
                    this.getCurrentTableData(this.regionData.global)
                }else {
                    if(this.isUk) this.dataType = "number";
                    this.getCurrentTableData(this.regionData.country)
                }
                this.tab = tab;
            },

            updateTableData: function(currentIndex){
                // const moment = require('moment');
                let current = this.currentData[currentIndex]?.arr;
                let last = this.currentData[currentIndex-1]?.arr;
                let id = 0;
                let sum = 0;
                for (let region of current)
                {
                    let lastData = last?.find(element => element.location == region.location);
                    region.id = id++;
                    sum+=region[this.dataType];
                    let change = lastData? region[this.dataType] - lastData[this.dataType] : 0;
                    region.change = (change>0?"+":"") + (this.isRate ? change.toFixed(2) : change)
                }
                if(sum===0 && (this.dataType==="cured" || this.dataType==="cRate")) {
                    this.tableData = null;
                    return;
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
                this.tableData = [...this.tableData].sort((a, b) => b[this.dataType] - a[this.dataType]);
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
        z-index: 50;
    }
    .topZero th{
        top:-1px;
    }

    .showAll{
        text-align: center;
        cursor: pointer;
        color: #0099db;
        padding-top: 10px;
    }
    .stick{
        position: sticky;bottom:0;
        border-top: solid 1px whitesmoke;
        background:white;padding: 0 10px;
        padding-bottom: 50px;
        z-index: 50;
    }
    .mdi-sort-ascending{
        opacity: 0.4;
        padding-left: 5px;
        cursor: pointer;
    }
    .active .mdi-sort-ascending{
        color: #5098d6;
        opacity: 1;
    }

    .goToCountry{
        font-weight: bolder;
        cursor: pointer;
    }

    .goToCountry svg{
        margin-top: -2px;
        opacity: 0.5;
    }
</style>