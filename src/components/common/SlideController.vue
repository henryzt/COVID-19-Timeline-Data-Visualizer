<template>
    <div class="wrapper">
        <button type="button" class="btn btn-secondary btn-lg circle" @click="onPlayPause" v-if="!hidePlayButton">
            <div style="margin-top: -2px;"><PauseIcon v-if="playPause"/><PlayIcon v-else/></div>
        </button>
        <div class="date" v-else>
            {{currentDate}}
        </div>
        <div style="flex-grow: 1; margin-left: 20px">
            <VueSlider :value="currentDate" @change="onDateChange" @drag-end="onDragEnd" :data="dateData" :disabled="!enableEvenIfPaused && !playPause" :lazy="lazy" :clickable="!disableClick"></VueSlider>
        </div>
    </div>
</template>

<script>
    import VueSlider from 'vue-slider-component'
    import PlayIcon from 'mdi-vue/Play'
    import PauseIcon from 'mdi-vue/Pause'
    import 'vue-slider-component/theme/default.css'

    export default {
        name: "SlideController",
        props: ["startDate","endDate","playing","currentDate","enableEvenIfPaused","hidePlayButton","disableClick","lazy"],
        data: function(){
            return {
                playPause:true,
                dateData:[],
                idx:0
            }
        },
        components: {
            VueSlider,
            PlayIcon,
            PauseIcon
        },
        watch: {
            startDate: function () {
                this.calculateDate();
            },
            endDate: function () {
                this.calculateDate();
            },
            playing:function (val) {
                this.playPause = val;
            }
        },
        mounted(){
            this.calculateDate();
            this.idx = this.dateData.findIndex(a=>a===this.currentDate);
        },
        methods: {
            calculateDate: function(){
                const moment = require('moment');
                const dateFormat = window.dateFormat;

                // console.log(this.startDate, this.endDate, this.dateData, this.enableEvenIfPaused)

                this.dateData=[];
                let doContinue = true;
                let dateNow = this.startDate;
                let count = 0;
                while(doContinue && count < 10000){
                    this.dateData.push(dateNow);
                    let currentMoment = moment(dateNow, dateFormat);
                    dateNow = currentMoment.add(1, 'days').format(window.dateFormat);
                    doContinue = currentMoment.isSameOrBefore(moment(this.endDate, dateFormat));
                    count++;
                }
            },
            onDateChange: function (e) {
                // console.log(e);
                this.$emit('change', e);
                this.idx = this.dateData.findIndex(a=>a===e);
                this.$emit('changeIndex', this.idx);
            },
            onDragEnd: function(){
                this.$emit('dragEnded', this.idx);
                window.ga('send', 'event', "slider", "drag-end", this.idx);
            },
            onPlayPause: function () {
                this.playPause = !this.playPause;
                this.$emit('playPause', this.playPause)
            }
        }
    }
</script>

<style scoped>
.date{
    font-size: 30px;font-weight: bold;opacity: 0.6; min-width:135px;text-align: center;
}
.wrapper{
    display: flex; align-items: center;padding-top: 20px
}
</style>