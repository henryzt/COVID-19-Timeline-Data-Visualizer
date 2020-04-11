<template>
    <div class="mBlock" >
        <div class="btn-group-wrap">
            <div class="btn-group" role="group" aria-label="date range">
                <button type="button" class="btn btn-secondary" :class="{active: sort===1}" @click="sortByAlphabet()">
                    按地区
                </button>
                <button type="button" class="btn btn-secondary" :class="{active: sort===2}" @click="sortByNumber()">
                    按人数
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
                </tr>
                </thead>
                <tbody>
                <tr class="singleRegionData" v-for="singleRegion in regionData" :key="singleRegion.id">
                    <th>{{ singleRegion.place }}</th>
                    <td>{{ singleRegion.number }}</td>
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
                let dataMapArr = [];
                let region_data = new Map();
                let regionJSON = JSON.parse(this.dataNow[0].area.replace(/\\/g, ''));
                regionJSON.forEach(place => {
                    if (place.number != null)
                    {
                        if (place.number.toString().includes(','))
                            place.number = place.number.replace(/,/g, '');
                        region_data.set(place.location.trim(), parseInt(place.number.toString().trim()));
                    }
                });
                let id = 0;
                for (let key of region_data.keys())
                {
                    const singleData = {
                        id: id++,
                        place: key,
                        number: region_data.get(key)
                    };
                    dataMapArr.push(singleData);
                }
                return dataMapArr;
            },
            sortByAlphabet:function () {
                this.sort = 1;
                this.regionData = [...this.regionData].sort((a, b) => a.place.localeCompare(b.place));
            },
            sortByNumber:function () {
                this.sort = 2;
                this.regionData = [...this.regionData].sort((a, b) => b.number - a.number);
            }
        }
    }
</script>

<style scoped>

</style>