<template>
    <div class="mBlock">
        <Map :locationsData="locationsData" :countryName="countryName"></Map>
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
            locationsData: Array,
            countryName: String
        }
    }
</script>

<style>

</style>