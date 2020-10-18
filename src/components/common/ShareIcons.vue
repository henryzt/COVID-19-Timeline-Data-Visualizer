<template>
    <div class="share-icon">
        <AddThis publicId="ra-5ea72e1d012d376e" :data-title="shareTitle" data-media="https://covid19track.site/thumbnail.png"/>
    </div>

</template>

<script>
    import AddThis from 'vue-simple-addthis-share'
    export default {
        name: "ShareIcons",
        props: ["title"],
        data: function () {
            return {
                shareTitle: null
            }
        },
        components:{
            AddThis
        },
        watch: {
            title: function () {
                this.addTitle()
            }
        },
        mounted() {
            if(this.title){
                this.addTitle()
            }else{
                this.shareTitle = "COVID-19 Realtime Data Visualization and Timeline - Coronavirus Nearby Cases Finder \n#Covid19 #Coronavirus #NearByCases"
            }
        },
        methods: {
            addTitle(){
                this.shareTitle = this.title.replace(/<span>/g, " ").replace(/<\/span>/g, "") + " \n#Covid19 #Coronavirus #NearByCases \nFind out cases in your area: "
            }
        }
    }
</script>

<style scoped>
    .share-icon{
        text-align: center;
    }
</style>