<template>
    <div class="mBlock" >
        <div class="btn-group-wrap">
            <div class="btn-group" role="group" aria-label="date range">
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
        <br>

        <div style="max-height: 500px; overflow-y: scroll">
            <table class="table table-striped table-hover">
                <thead style="position: sticky">
                <tr>
                    <th scope="col">NHS地区</th>
                    <th scope="col">确诊人数</th>
                    <th scope="col">较上次更新</th>
                </tr>
                </thead>
                <tbody>
                <tr class="singleRegionData" v-for="singleRegion in regionData" :key="singleRegion.id">
                    <th>{{ singleRegion.location }}</th>
                    <td>{{ singleRegion.number }}</td>
                    <td>{{ singleRegion.change }}</td>
                </tr>
                <tr></tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    export default {
        name: "RegionTable",
        props: ["dataNow", "dataYesterday"],
        data: function (){
            return {
                regionData: [],
                sort: 0
            }
        },
        mounted(){
          this.regionData = this.getRegionData()
        },
        methods:{
            getRegionData: function() {
                let regionJSON = JSON.parse(this.dataNow[0].area.replace(/\\/g,""));
                let regionOldJSON = JSON.parse(this.dataYesterday.area.replace(/\\/g,""));

                let filterNumber = place => {
                    if (place.number != null)
                    {
                        if (place.number.toString().includes(','))
                            place.number = place.number.replace(/,/g, '');
                        place.location = place.location.trim();
                        place.number = parseInt(place.number.toString().trim());
                    }
                };
                regionJSON.forEach(filterNumber);
                regionOldJSON.forEach(filterNumber);
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

</style>