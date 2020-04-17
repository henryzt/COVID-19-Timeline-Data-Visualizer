<template>
    <div class="mBlock">
        <Map :locationsData="commonLocationsData"></Map>
        <div style="text-align: left;opacity: 0.3;">*Data is incomplete, source: GOV.UK and isjeffcom</div>
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
            commonLocationsData: Array
        }
    }
</script>

<style>

</style>