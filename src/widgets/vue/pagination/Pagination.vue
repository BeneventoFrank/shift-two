<template>
        <div :style="`color:${colorScheme.PagingTextColor};`">
            <span class='pagingText' :style="`margin-right:25px`">{{`${pagination.MinRecordsViewable} to ${pagination.MaxRecordsViewable} of ${pagination.TotalNumberOfRecords}`}}</span>
            
            <span v-if="cmpCanPagePrevious" class='pagingText pointer' @click="()=>{this.handlePreviousClick(false)}">&#124;</span>
            <span v-else class='pagingText'>&#124;</span>
            <span v-if="cmpCanPagePrevious" :style="`margin-left:1px;`" class='pagingTextArrow pointer' @click="()=>{this.handlePreviousClick(false)}">&#60;</span>
            <span v-else :style="`margin-left:1px; margin-right:3px;`" class='pagingTextArrow'>&#60;</span>
            
            <span v-if="cmpCanPagePrevious" style='margin-left:1px;' class='pagingTextArrow pointer' @click="()=>{this.handlePreviousClick(true)}">&#60;</span>
            <span v-else style='margin-left:1px; margin-right:10px' class='pagingTextArrow'>&#60;</span>

            <span class='pagingText'> {{`Page ${pagination.PageNumberCurrentlyViewing} of ${pagination.MaxPageNumberPossible}`}}</span>

            <span v-if="cmpCanPageNext" style='margin-left:10px;' class='pagingTextArrow pointer' @click="()=>{this.handleNextClick(true)}">&#62;</span>
            <span v-else style='margin-left:10px;' class='pagingTextArrow'>&#62;</span>
            
            <span v-if="cmpCanPageNext" style='margin-left:1px;' class='pagingTextArrow pointer' @click="()=>{this.handleNextClick(false)}">&#62;</span>
            <span v-else style='margin-left:1px;' class='pagingTextArrow'>&#62;</span>

            <span v-if="cmpCanPageNext" class='pagingText pointer' @click="()=>{this.handleNextClick(false)}">&#124;</span>
            <span v-else class='pagingText'>&#124;</span>
        </div>
</template>
<script>


export default {
    name:"Pagination",
    components: {
    },
    data() {
        return {
        };
    },
    computed: {
    },
    methods: {
            async handleNextClick(isASinglePageMove){ 
                this.$emit('pageDataForward',{isASinglePageMove:isASinglePageMove}) 
            },
            async handlePreviousClick(isASinglePageMove){
                this.$emit('pageDataBackwards',{isASinglePageMove:isASinglePageMove}) 
            },
    },
    props:{
        pagination:{
            type:Object
        },
        cmpCanPagePrevious:{
            type:Boolean
        },
        cmpCanPageNext:{
            type:Boolean
        },
        rowData:{
            type:Object
        },
        rowIndex:{
            type:Number
        },
        virtualColumns:{
            type:Array
        },
        colorScheme:{
            type:Object
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
.cell{
    display:flex; 
    flex-direction:row;
    padding:5px;
    font-size:small;
    cursor:zoom-in;
    overflow: hidden;
}
.pagingText{
  -webkit-user-select: none; /* Safari */        
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */    
  font-size:12px;
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif;
  line-height: normal;
}
.pagingTextArrow{
  -webkit-user-select: none; /* Safari */        
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */    
  font-size: 15px;
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif;
  line-height: normal;
}
.pointer{
cursor: pointer;
}
</style>
