<template>
    <div style="display: flex; align-items: center;padding-top: 20px">
        <button type="button" class="btn btn-secondary btn-lg circle">
            <div style="margin-top: -2px;"><PauseIcon/></div>
        </button>
        <div style="flex-grow: 1; margin-left: 30px">
            <VueSlider></VueSlider>
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
        components: {
            VueSlider,
            // eslint-disable-next-line vue/no-unused-components
            PlayIcon,
            PauseIcon
        },
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