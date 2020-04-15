<template>
    <div style="display: flex; align-items: center;padding-top: 20px">
        <button type="button" class="btn btn-secondary btn-lg circle" @click="onPlayPause" v-if="!hidePlayButton">
            <div style="margin-top: -2px;"><PauseIcon v-if="playPause"/><PlayIcon v-else/></div>
        </button>
        <div style="font-size: 30px;font-weight: bold;opacity: 0.6;" v-else>
            {{currentDate}}
        </div>
        <div style="flex-grow: 1; margin-left: 30px">
            <VueSlider :value="currentDate" @change="onDateChange" :data="dateData" :disabled="!enableEvenIfPaused && !playPause"></VueSlider>
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
        props: ["startDate","endDate","playing","currentDate","enableEvenIfPaused","hidePlayButton"],
        data: function(){
            return {
                playPause:true,
                dateData:[],
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
        },
        methods: {
            calculateDate: function(){
                const moment = require('moment');
                const dateFormat = 'DD/MM/YYYY';

                // console.log(this.startDate, this.endDate, this.dateData, this.enableEvenIfPaused)

                this.dateData=[];
                let doContinue = true;
                let dateNow = this.startDate;
                let count = 0;
                while(doContinue && count<10000){
                    this.dateData.push(dateNow);
                    let currentMoment = moment(dateNow+'/2020', dateFormat);
                    dateNow = currentMoment.add(1, 'days').format("DD/MM");
                    doContinue = currentMoment.isSameOrBefore(moment(this.endDate+'/2020', dateFormat));
                    count++;
                }
            },
            onDateChange: function (e) {
                console.log(e);
                this.$emit('change', e);
            },
            onPlayPause: function () {
                this.playPause = !this.playPause;
                this.$emit('playPause', this.playPause)
            }
        }
    }
</script>

<style scoped>

</style>