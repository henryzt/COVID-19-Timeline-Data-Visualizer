<template>

    <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle btn-sm" :class="{disabled: disabled}"
                type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {{ disabled ? $t('dataSwitch.number') : $t('dataSwitch.'+dataType) }}
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenu">
            <div v-for="type of options" :key="type">
                <div v-if="type==='#'" class="dropdown-divider"></div>
                <button v-else class="dropdown-item" type="button" :class="{active: dataType===type}" @click=" $emit('typeChange',type) ">{{ $t('dataSwitch.'+type) }}</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DataSwitch",
        props: ["dataType", "disabled"],
        data: function () {
            return {
                options: ["confirmed", "active", "death", "cured", "#", "dRate", "cRate"]
            }
        },
        watch: {
            dataType: function () {
                window.ga('send', 'event', "data-switch", "type-changed", this.dataType);
            }
        }
    }
</script>

<style scoped>
    .dropdown-menu{
        box-shadow: 0px 10px 20px -2px rgba(0, 0, 0, 0.1);
    }
</style>