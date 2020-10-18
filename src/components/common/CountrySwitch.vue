<template>
    <div>
        <div class="btn-group btn-group-sm" role="group" aria-label="date range">
            <button type="button" class="btn btn-secondary" :class="{active: tab==0}" @click="changeTab(0)">
                {{$t('barRace.global')}}
            </button>
            <button type="button" class="btn btn-secondary" :class="{active: tab==1}" @click="changeTab(1)">
                {{$t('barRace.local')}}
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CountrySwitch",
        props: ["tab"],
        methods: {
            changeTab(e){
                this.$emit("changeTab", e)
            }
        }
    }
</script>

<style scoped>

</style>