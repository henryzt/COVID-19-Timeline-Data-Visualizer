<template>
    <div style="display: flex; align-items: center;padding-top: 20px">
        <button type="button" class="btn btn-secondary btn-lg circle" @click="onPlayPause">
            <div style="margin-top: -2px;"><PauseIcon v-if="playPause"/><PlayIcon v-else/></div>
        </button>
        <div style="flex-grow: 1; margin-left: 30px">
            <VueSlider :value="currentDate" @change="onDateChange" :data="data" :disabled="!playPause"></VueSlider>
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
        props: ["startDate","endDate","playing","currentDate"],
        data: function(){
            return {
                playPause:true,
                data:[],
            }
        },
        components: {
            VueSlider,
            PlayIcon,
            PauseIcon
        },
        watch: {
            endDate: function () { // watch it
                const moment = require('moment');
                const dateFormat = 'DD/MM/YYYY';

                this.data=[];
                let doContinue = true;
                let dateNow = this.startDate;
                let count = 0;
                while(doContinue && count<10000){
                    this.data.push(dateNow);
                    let currentMoment = moment(dateNow+'/2020', dateFormat);
                    dateNow = currentMoment.add(1, 'days').format("DD/MM");
                    doContinue = currentMoment.isSameOrBefore(moment(this.endDate+'/2020', dateFormat));
                    count++;
                }
            },
            playing:function (val) {
                this.playPause = val;
            }
        },
        methods: {
            onDateChange: function (e) {
                console.log(e);
                this.$emit('change', e)
            },
            onPlayPause: function () {
                this.playPause = !this.playPause;
                this.$emit('playPause', this.playPause)
            }
        }
    }
</script>

<style scoped>
    .circle{
        border-radius: 30px;
        padding: 10px;
        width: 50px;
        height: 50px;
    }
</style>