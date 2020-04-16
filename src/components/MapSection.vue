<template>
    <div class="mBlock">
        <Map :locationsData="commonLocationsData"></Map>
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