<template>
    <div class="mBlock" >
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
                <tr class="singleRegionData" v-for="singleRegion in regionData.slice(0, limit)" :key="singleRegion.id">
                    <td>{{ singleRegion.location }}</td>
                    <td>{{ singleRegion.number }}</td>
                    <td>{{ singleRegion.change }}</td>
                </tr>
                <tr></tr>
                </tbody>
            </table>
            <div class="showAll" @click="limit=(limit===10)?regionData.length:10">{{(limit===10)?"Show All":"Show Less"}}</div>
        </div>
    </div>
</template>

<script>
    import {parseLocationData} from "../assets/locationUtils"
    export default {
        name: "RegionTable",
        props: ["dataNow", "dataYesterday"],
        data: function (){
            return {
                regionData: [],
                sort: 0,
                limit: 10,
            }
        },
        mounted(){
          this.regionData = this.getRegionData();
          this.$emit('onRegionalDataSorted', [...this.regionData].sort((a, b) => b.change - a.change))
        },
        methods:{
            getRegionData: function() {

                let regionJSON = parseLocationData(this.dataNow[0].area);
                let regionOldJSON = parseLocationData(this.dataYesterday.area);

                let id = 0;
                for (let region of regionJSON)
                {
                   region.id = id++;
                   let change = regionOldJSON[id]? region.number - regionOldJSON[id].number : 0
                   region.change = (change>0?"+":"") + change
                }
                return regionJSON;
            },
            sortByDefault:function () {
                this.sort = 0;
                this.regionData = [...this.regionData].sort((a, b) => b.id - a.id);
            },
            sortByAlphabet:function () {
                this.sort = 1;
                this.regionData = [...this.regionData].sort((a, b) => a.location.localeCompare(b.location));
            },
            sortByNumber:function () {
                this.sort = 2;
                this.regionData = [...this.regionData].sort((a, b) => b.number - a.number);
            },
            sortByIncreaseNumber:function () {
                this.sort = 3;
                this.regionData = [...this.regionData].sort((a, b) => b.change - a.change);
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