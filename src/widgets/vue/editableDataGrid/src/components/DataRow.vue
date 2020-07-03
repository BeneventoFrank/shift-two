<template>
    <div v-if="virtualColumns.length>0" class='dataRow' :class="rowIndex%2===0?'evenRow':'oddRow'">
        <span  v-for="(data,index) in Object.keys(rowData)" :key="index" :style="`width:${virtualColumns[index].width}; `">{{rowData[data]}}</span>
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
        rowIndex:{

        },
        virtualColumns:{
            type: Array
        }
    },        
    mounted(){
  }
};
</script>
<style scoped>

.dataRow{
    width:100%; 
    display:flex; 
    flex-direction:row;
    height:28px;
    padding-top:5px;
}
.oddRow{
    background-color: #F0F0F0;
}
    
</style>
