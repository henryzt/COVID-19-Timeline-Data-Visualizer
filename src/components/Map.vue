<template>
    <highcharts :constructor-type="'mapChart'" :options="mapOptions" class="map"></highcharts>
</template>
<script>
    export default {
        props: {
            locationsData: {}
        },
        data () {
            return {
                mapOptions: {
                    chart: {
                        map: 'UKmap'
                    },
                    title: {
                        text: 'UK Confirmed Cases'
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
        }
    }
</script>
<style scoped>
    .map {
        min-height: 500px;
    }
</style>
