<template>
    <div class='headerRow'>
        <span 
            class="headerCell"
            v-for="(header) in headers" 
            :key="header.columnIndex"
            :style="`
                    justify-content:${header.alignment};
                    width:${header.width}; 
                    height:${header.height};  
                    backgroundColor:${header.backgroundColor}; 
                    color:${header.textColor}; 
                    border-right:${getBorder(header.borderWidth, header.borderColor, header.columnIndex)};`">
            {{header.text}}
        </span>
    </div>
</template>
<script>
export default {
    name:"HeadrRow",
    components: {
    },
    data() {
        return {
        };
    },
    computed: {
    },
    props:{
        headers:{
            type:Array
        }
    },        
    methods: {
       getBorder(usersBorderWidth, usersBorderColor, columnIndex){
           if(columnIndex===this.headers.length-1){return null} //no left border on the first column or the last one 
           return usersBorderWidth?`${usersBorderWidth} solid ${usersBorderColor}`:`${this.defaultValues.borderWidth} solid ${this.defaultValues.borderColor}`
       },
    },
    mounted(){
  }
};
</script>
<style scoped>
    .headerRow{
        width:100%;
        display:flex;
        flex-direction:row;
        align-items: center;
        border-bottom: 1px solid #C8C8C8;
    }
    .headerCell{
        display:flex; 
        flex-direction:row; 
        align-items:center; 
        justify-content:center; 
        font-size: 15px; 
        font-family:Arial, Helvetica, sans-serif;
        padding-left:5px;
        padding-right:5px;
    }
</style>>
