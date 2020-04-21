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
                        map:'UK'
                    },
                    title:{
                        text:"COVID Map"
                    },
                    mapNavigation: {
                        enabled: true,
                        buttonOptions: {
                            alignTo: 'spacingBox'
                        }
                    },
                    colorAxis: {
                        enables: true,
                        min: 0
                    },
                    series: [{
                        name: '',
                        states: {
                            hover: {
                                color: '#BADA55'
                            }
                        },
                        dataLabels: {
                            enabled: false,
                            format: '{point.name}'
                        },
                        allAreas: true,
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
            // if(this.countryName === "world")
            //     this.mapOptions.title
        }
    }
</script>
<style scoped>
    .map {
        min-height: 500px;
    }
</style>
