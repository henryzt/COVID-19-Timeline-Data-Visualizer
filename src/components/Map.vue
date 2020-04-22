<template>
    <div v-if="renderComponent">
        <highcharts :constructor-type="'mapChart'" :options="mapOptions" class="map"></highcharts>
    </div>
</template>
<script>
    export default {
        props: {
            locationsData: {},
            countryName: String
        },
        data: function(){
            return {
                renderComponent: true
            }
        },
        computed: {
                mapOptions: function () {
                    let isUK = this.countryName === "UK";
                    this.forceRerender();
                    return {
                        chart: {
                            map: this.countryName,
                            height: 500
                        },
                        title: {
                            text: this.countryName[0].toUpperCase() + this.countryName.slice(1) + " Confirmed Cases"
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
                            allAreas: isUK,
                            data: this.locationsData
                        }]
                    }
                }
        },
        mounted() {
            // console.log(this.locationsData);
            // if(this.countryName === "world")
            //     this.mapOptions.title
        },
        methods: {
            forceRerender() {
                this.renderComponent = false;
                this.$nextTick(() => {
                    this.renderComponent = true;
                });
            }
        }
    }
</script>
<style scoped>
    .map {
        min-height: 300px;
    }
</style>
