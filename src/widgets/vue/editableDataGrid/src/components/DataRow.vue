<template>

    <div>
        
        <span v-for="(data,index) in Object.entries(rowData)" :key="index" :style="`width:${virtualColumns[index].width}; `">{{data}}</span>
    </div>

</template>
<script>


export default {
    name:"DataRow",
    components: {
    },
    data() {
        return {
        };
    },
    computed: {
    },
    methods: {
    },
    props:{
        rowData:{
            type: Object
        },
        virtualColumns:{
            type:Array
        }
    },        
    
    mounted(){
        console.log("virstual columns ", this.virtualColumns)
        console.log("waht the fuck", this.rowData)
  }
};
</script>
<style>

</style>
