<template>
    <highcharts :constructor-type="'mapChart'" :options="mapOptions" class="map"></highcharts>
</template>
<script>
    export default {
        props: {
            locationsData: {},
            countryName: null
        },
        data () {
            return {
                mapOptions: {
                    chart: {
                        map:'UK',
                        height: 500
                    },
                    title:{
                        text:"COVID Map"
                    },
                    mapNavigation: {
                        enabled: true,
                        enableDoubleClickZoomTo: true,
                        buttonOptions: {
                            alignTo: 'spacingBox'
                        }
                    },
                    colorAxis: {
                        enables: true,
                        min: 0
                    },
                    series: [{
                        name: 'data',
                        states: {
                            hover: {
                                color: '#BADA55'
                            }
                        },
                        dataLabels: {
                            enabled: false,
                            format: '{point.name}'
                        },
                        allAreas: false,
                        data: this.locationsData
                    }]
                }
            }
        },
        mounted() {
            this.mapOptions.chart = {
                map: this.countryName
            };
            this.mapOptions.title = {
                text: this.countryName[0].toUpperCase() + this.countryName.slice(1) + " Confirmed Cases"
            };
            // console.log(this.locationsData);
            // if(this.countryName === "world")
            //     this.mapOptions.title
        }
    }
</script>
<style scoped>
    .map {
        min-height: 300px;
    }
</style>
