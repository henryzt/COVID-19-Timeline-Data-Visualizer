<template>
    <div>
        <div style="display: flex;align-items: center;">

            <button type="button" class="btn btn-secondary btn-lg circle" @click="locateUserPostcode">
                <div style="margin-top: -2px;"><LocateIcon/></div>
            </button>

            <div class="form-inline" style="flex-grow: 1">
                <div class="form-group col-sm-9" tyle="width: 100%;">
                    <label for="postcode" class="sr-only">Postcode</label>
                    <input class="form-control col-sm-12" id="postcode" placeholder="英国邮编 UK Postcode" v-model="inputValue">
                </div>
                <button type="submit" class="btn btn-primary col-sm-3" @click="find">查询</button>
            </div>

        </div>
        <div class="displayInfo" style="margin-top: 20px; text-align: center;" v-html="displayInfo"></div>
    </div>

</template>

<script>
    import LocateIcon from 'mdi-vue/NearMe'
    export default {
        name: "NearbyCasesFinder",
        props: ["regionData"],
        components:{
            LocateIcon
        },
        data: function(){
            return {
                inputValue: "",
                displayInfo: "<div style='opacity: 0.7; font-size: 14px;'>输入您的英国邮编即可查询最近的区域确诊数量，点击左侧按钮可以自动定位。</div>"
            }
        },
        methods:{
            find(){
                fetch("https://api.postcodes.io/postcodes/"+this.inputValue).then( async (res) => {
                    let data = await res.json();
                    console.log(data);

                    if(data.status == 200){
                        this.findByRegionName(data.result.nhs_ha, data.result.admin_district)

                    }else {
                        this.displayInfo = "抱歉，您输入的邮编有误"
                    }
                })
            },
            findByRegionName(regionName, district){
                let res = this.regionData.filter(obj => obj.location == regionName || obj.location == district);
                if(res && res[0]) {
                    let location = res[0];
                    let index = this.regionData.findIndex(obj=> obj.id === location.id);
                    this.displayInfo = `目前，<span>${location.location}</span>区共有<span>${location.number}</span>例确诊，在NHS地区中排名第<span>${index}</span>。`
                }
            },
            locateUserPostcode(){
                if (navigator.geolocation) {
                    this.displayInfo = "定位中，请稍候...";
                    navigator.geolocation.getCurrentPosition((position)=>{
                        fetch(`https://api.postcodes.io/postcodes?lon=${position.coords.longitude}&lat=${position.coords.latitude}`).then( async res=>{
                            let data = await res.json();
                            if(data.result && data.result[0]){
                                this.inputValue = data.result[0].postcode;
                                this.find()
                            }
                        })
                    },()=>{
                        this.displayInfo = "很抱歉，我们无法定位，因为您已拒绝位置授权"
                    });
                } else {
                    this.displayInfo = "Geolocation is not supported by this browser.";
                }

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