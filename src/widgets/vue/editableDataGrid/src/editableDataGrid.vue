<template>

    

</template>
<script>


export default {
    components: {
    },
    data() {
        return {
            gridConfig:{}
        };
    },
    computed: {
    },
    methods: {
    },
    props:{
        gridConfig:{
            type: Object,
            required: true
        }
    },        
    
    mounted(){
        this.initializeHeaders()
  }
};
</script>
<style>

  
</style>
