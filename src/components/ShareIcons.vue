<template>
    <div class="share-icon">
        <AddThis publicId="ra-5ea72e1d012d376e" />
    </div>

</template>

<script>
    import AddThis from 'vue-simple-addthis-share'
    export default {
        name: "ShareIcons",
        components:{
            AddThis
        }
    }
</script>

<style scoped>
    .share-icon{
        text-align: center;
    }
</style>