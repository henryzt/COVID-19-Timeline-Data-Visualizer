<template>
    <div v-if="renderComponent">
        <highcharts :constructor-type="'mapChart'" :options="mapOptions" class="map"></highcharts>
    </div>
</template>
<script>
    export default {
        props: {
            locationsData: {},
            countryName: String,
            isRate: Boolean
        },
        data: function(){
            return {
                renderComponent: true
            }
        },
        computed: {
                mapOptions: function () {
                    let isUK = this.countryName === "UK" || this.countryName === "US";
                    let options = {
                        chart: {
                            map: this.countryName,
                            height: 500
                        },
                        title: {
                            text: ""
                            // text: this.countryName[0].toUpperCase() + this.countryName.slice(1) + " Confirmed Cases"
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
                            name: 'Cases',
                            states: {
                                hover: {
                                    color: '#BADA55'
                                }
                            },
                            dataLabels: {
                                enabled: false,
                                format: '{point.name}'
                            },
                            allAreas: isUK,
                            data: this.locationsData
                        }],
                        tooltip: {},
                    };
                    if(this.isRate)
                        options.tooltip.pointFormat = '{point.name}: <b>{point.value:.2f}</b><br/>'
                    return options;
                }
        },
        mounted() {
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
