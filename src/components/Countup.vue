<template>
    <div>
        <div v-if="instant">{{number}}</div>
        <ICountUp v-else :endVal="number"/>
    </div>
</template>

<script>
import ICountUp from 'vue-countup-v2';

export default {
    name: "Countup",
    props: ["number","instant"],
    components:{
        ICountUp
    }
}
</script>