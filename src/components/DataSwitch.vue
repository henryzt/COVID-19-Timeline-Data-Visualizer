<template>
    <div class="btn-group-wrap">
        <div class="btn-group btn-group-sm" role="group" aria-label="date range">
            <button type="button" class="btn btn-secondary" :class="{active: dataType==='confirmed'}" @click=" $emit('typeChange','confirmed') ">
                {{ $t('totalConfirmed') }}
            </button>
            <button type="button" class="btn btn-secondary" :class="{active: dataType==='active'}" @click=" $emit('typeChange','active') ">
                {{ $t('active') }}
            </button>
            <button type="button" class="btn btn-secondary" :class="{active: dataType==='death'}" @click=" $emit('typeChange','death') ">
                {{ $t('totalDeaths') }}
            </button>
            <button type="button" class="btn btn-secondary" :class="{active: dataType==='dRate'}" @click=" $emit('typeChange','dRate') ">
                %
            </button>
            <button type="button" class="btn btn-secondary" :class="{active: dataType==='cured'}" @click=" $emit('typeChange','cured') ">
                {{ $t('totalCured') }}
            </button>
            <button type="button" class="btn btn-secondary" :class="{active: dataType==='cRate'}" @click=" $emit('typeChange','cRate') ">
                %
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DataSwitch",
        props: ["dataType"]
    }
</script>

<style scoped>

</style>