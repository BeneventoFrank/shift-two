<template>
    <div style="display:flex; height:100%; width:100%; justify-content:center; align-items:center;">
        <!-- <button @click="handleEditClick" style="cursor:pointer; color:white; border:none; background-color:#455982; width:75px; height:17px; border-radius:3px;">Edit</button> -->
        <RightCircle style='cursor:pointer;'/>
    </div>
    
</template>

<script>
    import RightCircle from 'vue-material-design-icons/ChevronRightCircle.vue';
    export default {
        name:'Nav',
        components:{
            RightCircle
        },
        props:{
            params:{}
        },
        methods:{

        },
    }
    
</script>

