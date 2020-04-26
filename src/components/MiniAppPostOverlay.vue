<!--This section is only used for our community app posts, you can ignore if not needed-->
<template>
    <div class="ma-overlay" v-if="posts">
        <div class="title_bg" :class="{'hidden-title': !showMore}">
            <div>❤️学联社区疫情互助讨论</div>
            <div style="color: #007BFF" @click="showMore = !showMore"><MoreIcon v-if="showMore"/><LessIcon v-else/>{{showMore?'隐藏':'打开'}}</div>
        </div>
        <div style="background: white;" v-if="showMore">
            <div style="display: flex;overflow-y: scroll; margin:0;">
                <div class="post-block" v-for="post of posts" :key="post.id" @click="goToPost(post.id)">
                    <div style="float: right; color: #007BFF">查看详情</div>
                    <div style="opacity:0.5">{{post.user}}</div>
                    <div style="max-height: 17vh;">{{post.content}}</div>
                </div>
            </div>
            <div style="display: flex; justify-content: space-around;opacity: 0.7; padding: 10px;">
                <div @click="goToCommunity">查看更多</div>
                <div @click="goToPublish">发布动态</div>
            </div>
        </div>
    </div>
</template>

<script>
    import wx from 'weixin-js-sdk'
    import MoreIcon from 'mdi-vue/ChevronDown'
    import LessIcon from 'mdi-vue/ChevronUp'
    export default {
        name: "MiniAppPostOverlay",
        components:{
            MoreIcon,
            LessIcon
        },
        data: function(){
            return {
                posts: null,
                showMore: true
            }
        },
        mounted() {
            wx.miniProgram.getEnv(function(res) { console.log(res.miniprogram) })
            fetch("https://uclcssa.cn/post/getPostEndpoint.php?auth=ucl&space=13").then(async res=>{
                let data = await res.json();
                this.posts = data.posts;
            })
        },
        methods:{
            goToCommunity(){
                wx.miniProgram.switchTab({
                    url:'/pages/discover/discover'
                });
            },
            goToPublish(){
                wx.miniProgram.switchTab({
                    url:'/pages/publish/publish?space_id=13'
                });
            },
            goToPost(id){
                wx.miniProgram.switchTab({
                    url:'pages/moments/detail?id='+id
                });
            },
        }
    }
</script>

<style scoped>
    .title_bg{
        background: linear-gradient(rgba(255, 255, 255, 0) 0%, white 70%);
        display:flex;
        justify-content: space-between;
        padding: 0 10px;
        padding-top: 25px;
        text-shadow: 2px 2px 4px white;
    }

    .hidden-title{
        padding: 10px;
        padding-top: 30px;
    }

    .ma-overlay{

        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        z-index: 100;
    }

    .post-block{
        min-width: 230px;
        height: 20vh;
        background: white;
        padding: 10px;
        overflow: hidden;
        margin: 10px;
        box-shadow: 0px 5px 10px -2px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        font-size: 14px
    }
</style>