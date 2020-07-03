<template>
    <div v-if="virtualColumns.length>0"  :class="rowIndex%2===0?'evenRow':'oddRow'" class='data'>
        <span :ref="`dataRow${index}`" class="cell" v-for="(data,index) in Object.keys(rowData)" :key="index" :style="`width:${virtualColumns[index].width}; background-color:${virtualColumns[index].hoverBackgroundColor}; color:${virtualColumns[index].textColor}; justify-content:${virtualColumns[index].dataAlignment}; `">
            {{rowData[data]}} {{rowIndex}}
        </span>
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
            type:Number
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

.data{
    width:100%; 
    display:flex; 
    flex-direction:row;
    height:28px;
    border-bottom: 1px solid #DCDCDC;
}
.oddRow{
    background-color: #F8F8F8;
}
.cell{
    display:flex; 
    flex-direction:row;
    padding:5px;
    font-size:small;
    cursor:zoom-in;
}




</style>
