<template>
    <div>
        <div style="display: flex;align-items: center;margin-bottom: 20px; ">

            <button type="button" class="btn btn-secondary btn-lg circle" @click="locateUserGPS">
                <div style="margin-top: -2px;"><LocateIcon/></div>
            </button>

            <div  style="margin: 0 20px;width: 100%;">
                <input v-if="currentCountry==='UK'" class="form-control" id="postcode" placeholder="UK Postcode" v-model="inputValue">
                <vSelect v-else-if="mainLocation" class="select" :clearable="false" :value="usDropdownValue" :options="mainLocation" label="Combined_Key"
                         @input="findUSCounty" placeholder="Search..."></vSelect>
                <div v-else style="text-align: center">Loading...</div>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100px;" @click="findUKPostcode">{{$t('nearBy.search')}}</button>

        </div>
        <div v-if="displayInfo===$t('nearBy.locating')" style="margin: 5px;text-align: center;">
            <div class="spinner-border text-primary" style="width: 2rem; height: 2rem;" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <div class="displayInfo" style="text-align: center;" v-html="displayInfo"></div>

        <div v-if="isResult" style="text-align: center;margin-top: 20px; color: silver;">
            <a href="javascript: void(0)" v-if="currentCountry==='US'" @click="switchStateCounty">{{$t('nearBy.switchCountyState')}}<br></a>
            <a href="#regionData">{{$t('nearBy.goToRegional')}}</a>
            <div v-if="$i18n.locale !== 'zh'">
                <hr>
                <ShareIcons style="margin-top: 20px;" :title="displayInfo"></ShareIcons>
            </div>
        </div>

    </div>

</template>

<script>
    import LocateIcon from 'mdi-vue/NearMe'
    import ShareIcons from "./ShareIcons.vue";
    import vSelect from 'vue-select'
    const getGetOrdinal = function(n) {
        //ref https://community.shopify.com/c/Shopify-Design/Ordinal-Number-in-javascript-1st-2nd-3rd-4th/td-p/72156
        const s=["th","st","nd","rd"],
            v=n%100;
        return n+(s[(v-20)%10]||s[v]||s[0]);
    };

    export default {
        name: "NearbyCasesFinder",
        props: ["regionData", "currentCountry"],
        components:{
            LocateIcon,
            ShareIcons,
            vSelect
        },
        data: function(){
            return {
                inputValue: "",
                displayInfo: "<div style='opacity: 0.7; font-size: 14px;'>" + (this.currentCountry==="UK"?this.$t('nearBy.ukDefault'):this.$t('nearBy.usDefault')) +"</div>",
                mainLocation: null,
                statesLocation: null,
                usInfo: {
                    county: null,
                    state: null
                },
                isResult: false,
                usDropdownValue: null
            }
        },
        methods:{
            findUKPostcode(){
                this.isResult = false;
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
                    this.displayInfo = this.$t('nearBy.ukResult', [location.location, location.number, location.change, getGetOrdinal(index)])
                    window.ga('send', 'event', "nearby", "uk-region-found", location.location+", "+regionName + ", "+ district);
                    this.isResult = true;
                }else {
                    this.displayInfo = this.$t('nearBy.notFound', [regionName]);
                    window.ga('send', 'event', "nearby", "uk-region-notfound", regionName + ", "+ district);
                }
            },
            locateUserGPS(){
                this.isResult = false;
                window.ga('send', 'event', "nearby", "start-locating", "");
                if (navigator.geolocation) {
                    this.displayInfo = this.$t('nearBy.locating');
                    navigator.geolocation.getCurrentPosition(async (position)=>{
                        window.ga('send', 'event', "nearby", "location-found", "");
                        if(this.currentCountry === "UK"){
                            this.getUKPostcodeUsingLocation(position);
                        }else {
                            await this.getUSLocationData();
                            this.calculateDistanceFromLocation(position);
                        }
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
                let requestUrl = `https://api.postcodes.io/postcodes?lon=${position.coords.longitude}&lat=${position.coords.latitude}`;
                fetch(requestUrl).then( async res=>{
                    window.ga('send', 'event', "nearby", "location-found", requestUrl);
                    let data = await res.json();
                    if(data.result && data.result[0]){
                        this.inputValue = data.result[0].postcode;
                        window.ga('send', 'event', "nearby", "uk-postcode-found", this.inputValue );
                        this.findUKPostcode()
                    }else {
                        window.ga('send', 'event', "nearby", "location-invalid", requestUrl);
                        this.displayInfo = this.$t('nearBy.notUk');
                    }
                })
            },
            async getUSLocationData(){
                return new Promise((resolve => {
                    if(this.mainLocation) {
                        resolve(this.mainLocation);
                        return;
                    }
                    fetch(`https://henryz.cc/projects/covid/api_current.php`).then( async res=>{
                        let data = await res.json();
                        const csv=require('csvtojson');
                        let json = await csv().fromString(data.global);
                        let usStates = await csv().fromString(data.us);
                        console.log(json, usStates);
                        this.mainLocation = json.filter(ele=>ele.Country_Region==="US");
                        this.statesLocation = usStates.sort((a, b) => b.Active - a.Active);
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

                const getClosest = (inputList)=>{
                    let list = inputList.sort((a, b) => b.Active - a.Active);
                    let min = {distance: Infinity};
                    for(let region of list){
                        region.distance = calculateDist(region["Lat"],region["Long_"],position.coords.latitude, position.coords.longitude);
                        if(region.distance < min.distance){
                            min = region;
                        }
                    }
                    min.idx = list.findIndex(ele=>ele===min) + 1;
                    console.log(list,min);

                    if(min.Testing_Rate){
                        let tRateList = list.sort((a, b) => b.Testing_Rate - a.Testing_Rate);
                        min.tRateRank = tRateList.findIndex(ele=>ele.UID===min.UID) + 1;
                    }
                    return min;
                };

                let usCounties = this.mainLocation;
                let cmin = getClosest(usCounties); // county min
                let smin = getClosest(this.statesLocation); // state min

                if(cmin.distance> 500){
                    this.displayInfo = this.$t('nearBy.notUs');
                    window.ga('send', 'event', "nearby", "not-us", cmin.Combined_Key+ " - " +cmin.distance);
                    return;
                }

                window.ga('send', 'event', "nearby", "us-county-found", cmin.Combined_Key);

                this.usDropdownValue = cmin.Combined_Key;

                this.usInfo.county = this.$t('nearBy.usResult',
                    [cmin.Combined_Key, cmin.Active, cmin.Confirmed, cmin.Deaths, (cmin.Deaths/cmin.Confirmed*100).toFixed(2),
                        cmin.Recovered!=0?cmin.Recovered:"-", cmin.Recovered!=0?(cmin.Recovered/cmin.Confirmed*100).toFixed(2):"-", getGetOrdinal(cmin.idx)])
                this.usInfo.state = this.$t('nearBy.usStateResult',
                    [smin.Province_State, smin.People_Tested, (Number(smin.Testing_Rate)/1000).toFixed(2), smin.Confirmed, smin.People_Hospitalized?smin.People_Hospitalized:"-",
                        Number(smin.Hospitalization_Rate).toFixed(2), smin.Deaths, Number(smin.Mortality_Rate).toFixed(2), smin.Recovered?smin.Recovered:"-", Number(smin.Active).toFixed(0), getGetOrdinal(smin.idx),
                        getGetOrdinal(smin.tRateRank) ])

                this.displayInfo = this.usInfo.county;
                this.isResult = true;
            },
            findUSCounty(e){
                window.ga('send', 'event', "nearby", "us-county-dropdown", e.Combined_Key);
                this.usDropdownValue = e;
                let postition = {
                    coords:{
                        latitude: e["Lat"],
                        longitude: e["Long_"]
                    }
                };
                this.calculateDistanceFromLocation(postition);
            },
            switchStateCounty(){
                window.ga('send', 'event', "nearby", "us-county-state-switched", '');
                if(this.displayInfo == this.usInfo.county){
                    this.displayInfo = this.usInfo.state;
                }else {
                    this.displayInfo = this.usInfo.county;
                }
            }
        },
        mounted() {
            if(this.currentCountry === "US")
                this.getUSLocationData()
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