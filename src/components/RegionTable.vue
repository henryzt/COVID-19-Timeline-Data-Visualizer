<template>
    <div class="mBlock">
        <table class="table table-striped table-hover">
            <thead>
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
</template>

<script>
    export default {
        name: "RegionTable",
        props: ["dataNow"],
        data: function (){
            return {

            }
        },
        computed: {
            regionData: function() {
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
            }
        }
    }
</script>

<style scoped>

</style>