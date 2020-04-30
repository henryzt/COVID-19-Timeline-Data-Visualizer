<template>
    <div>
        <div style="display: flex;align-items: center;margin-bottom: 20px; ">

            <button type="button" class="btn btn-secondary btn-lg circle" @click="locateUserGPS">
                <div style="margin-top: -2px;"><LocateIcon/></div>
            </button>

            <input class="form-control" id="postcode" placeholder="UK Postcode" style="margin: 0 20px;" v-model="inputValue">

            <button type="submit" class="btn btn-primary" style="width: 100px;" @click="findUKPostcode">{{$t('nearBy.search')}}</button>

        </div>
        <div v-if="displayInfo===$t('nearBy.locating')" style="margin: 5px;text-align: center;">
            <div class="spinner-border text-primary" style="width: 2rem; height: 2rem;" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <div class="displayInfo" style="text-align: center;" v-html="displayInfo"></div>
    </div>

</template>

<script>
    import LocateIcon from 'mdi-vue/NearMe'
    export default {
        name: "NearbyCasesFinder",
        props: ["regionData", "currentCountry"],
        components:{
            LocateIcon
        },
        data: function(){
            return {
                inputValue: "",
                displayInfo: "<div style='opacity: 0.7; font-size: 14px;'>" + (this.currentCountry==="UK"?this.$t('nearBy.ukDefault'):this.$t('nearBy.usDefault')) +"</div>",
                mainLocation: null
            }
        },
        methods:{
            findUKPostcode(){
                window.ga('send', 'event', "nearby", "postcode", this.inputValue);
                fetch("https://api.postcodes.io/postcodes/"+this.inputValue).then( async (res) => {
                    let data = await res.json();
                    console.log(data);

                    if(data.status == 200){
                        this.findByUKRegionName(data.result.nhs_ha, data.result.admin_district)

                    }else {
                        window.ga('send', 'event', "nearby", "uk-postcode-notfound", this.inputValue);
                        this.displayInfo = this.$t('nearBy.postcodeErr')
                    }
                })
            },
            findByUKRegionName(regionName, district){
                let res = this.regionData.filter(obj => obj.location == regionName || obj.location == district);
                if(res && res[0]) {
                    let location = res[0];
                    let index = this.regionData.findIndex(obj=> obj.id === location.id);
                    this.displayInfo = this.$t('nearBy.ukResult', [location.location, location.number, location.change, index])
                    window.ga('send', 'event', "nearby", "uk-region-found", location.location+", "+regionName + ", "+ district);
                }else {
                    this.displayInfo = this.$t('nearBy.notFound', [regionName]);
                    window.ga('send', 'event', "nearby", "uk-region-notfound", regionName + ", "+ district);
                }
            },
            locateUserGPS(){
                window.ga('send', 'event', "nearby", "start-locating", "");
                if (navigator.geolocation) {
                    this.displayInfo = this.$t('nearBy.locating');
                    navigator.geolocation.getCurrentPosition(async (position)=>{
                        window.ga('send', 'event', "nearby", "location-found", "");
                       // this.getUKPostcodeUsingLocation(position);
                        console.log("OK")
                       await this.getUSLocationData();
                       this.calculateDistanceFromLocation(position);
                    },()=>{
                        window.ga('send', 'event', "nearby", "location-rejected", "");
                        this.displayInfo = this.$t('nearBy.rejected');
                    });
                } else {
                    window.ga('send', 'event', "nearby", "location-unsupported", "");
                    this.displayInfo = this.$t('nearBy.unsupported');
                }

            },
            getUKPostcodeUsingLocation(position){
                fetch(`https://api.postcodes.io/postcodes?lon=${position.coords.longitude}&lat=${position.coords.latitude}`).then( async res=>{
                    window.ga('send', 'event', "nearby", "uk-postcode-found", "");
                    let data = await res.json();
                    if(data.result && data.result[0]){
                        this.inputValue = data.result[0].postcode;
                        this.findUKPostcode()
                    }else {
                        window.ga('send', 'event', "nearby", "location-invalid", position.coords.longitude + ", "+ position.coords.latitude);
                        this.displayInfo = this.$t('nearBy.notUk');
                    }
                })
            },
            async getUSLocationData(){
                return new Promise((resolve => {
                    if(this.mainLocation)
                        resolve(this.mainLocation);
                    fetch(`https://henryz.cc/projects/covid/api_current.php`).then( async res=>{
                        let data = await res.json();
                        const csv=require('csvtojson');
                        let json = await csv().fromString(data.global);
                        console.log(json);
                        this.mainLocation = json;
                        resolve(json);
                    })
                }))
            },
            calculateDistanceFromLocation(position){
                const calculateDist = (lat1, lon1, lat2, lon2) => {
                    let p = 0.017453292519943295;    // Math.PI / 180
                    let c = Math.cos;
                    let a = 0.5 - c((lat2 - lat1) * p)/2 +
                        c(lat1 * p) * c(lat2 * p) *
                        (1 - c((lon2 - lon1) * p))/2;

                    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
                };

                let min = {distance: Infinity};

                for(let region of this.mainLocation){
                    region.distance = calculateDist(region["Lat"],region["Long_"],position.coords.latitude, position.coords.longitude)
                    if(region.distance < min.distance){
                        min = region;
                    }
                }
                console.log(this.mainLocation,min);
                this.displayInfo = this.$t('nearBy.usResult', [min.Combined_Key, min.Active, min.Confirmed, min.Deaths, (min.Deaths/min.Confirmed*100).toFixed(2), min.Recovered, (min.Recovered/min.Confirmed*100).toFixed(2), 1])
            }
        }
    }
</script>

<style>
    .displayInfo > span{
        color: darkred;
        padding: 0 5px;
        font-weight: bolder;
    }
</style>