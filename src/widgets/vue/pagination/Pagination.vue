<template>
        <div style=''>
            <span class='pagingText' style="margin-right:25px">{{`${pagination.MinRecordsViewable} to ${pagination.MaxRecordsViewable} of ${pagination.TotalNumberOfRecords}`}}</span>
            
            <span v-if="cmpCanPagePrevious" class='pagingText pointer' @click="()=>{this.handlePreviousClick(true)}">&#124;</span>
            <span v-else class='pagingText'>&#124;</span>
            <span v-if="cmpCanPagePrevious" style='margin-left:1px;' class='pagingTextArrow pointer' @click="()=>{this.handlePreviousClick(false)}">&#60;</span>
            <span v-else style='margin-left:1px; margin-right:3px' class='pagingTextArrow'>&#60;</span>
            
            <span v-if="cmpCanPagePrevious" style='margin-left:1px;' class='pagingTextArrow pointer' @click="()=>{this.handlePreviousClick(true)}">&#60;</span>
            <span v-else style='margin-left:1px; margin-right:10px' class='pagingTextArrow'>&#60;</span>

            <span class='pagingText'> {{`Page ${pagination.PageNumberCurrentlyViewing} of ${pagination.MaxPageNumberPossible}`}}</span>

            <span v-if="cmpCanPageNext" style='margin-left:1px;' class='pagingTextArrow pointer' @click="()=>{this.handleNextClick(true)}">&#62;</span>
            <span v-else style='margin-left:10px;' class='pagingTextArrow'>&#62;</span>
            
            <span v-if="cmpCanPageNext" style='margin-left:1px;' class='pagingTextArrow pointer' @click="()=>{this.handleNextClick(false)}">&#62;</span>
            <span v-else style='margin-left:1px;' class='pagingTextArrow'>&#62;</span>
            <span v-if="cmpCanPageNext" class='pagingText pointer' @click="()=>{this.handleNextClick(true)}">&#124;</span>
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
            pagination:{
                MinRecordsViewable:0,
                MaxRecordsViewable:0,
                TotalNumberOfRecords:0,
                PageNumberCurrentlyViewing:0,        
                MaxPageNumberPossible:0,
                NumberOfApplicibleRowsPerPage:0,
                InitialNumberOfRowsPerPage:0,
                IsPaging:false,
                CurrentSkip:0,
                CurrentTake:0
            },
        };
    },
    computed: {
        cmpNumPerPage:function(){
            switch (this.ddlNumPerPage) {
            case 20:
                return 100
            case 40:
                return 200
            case 60:
                return 500
            case 80:
                return 1000
            case 100:
                return 2000
            default:
                return 100
            }
        },
        cmpCanPagePrevious:function(){
        return this.pagination.MinRecordsViewable<2?false:true
        },
        cmpCanPageNext:function(){
        return this.pagination.MaxPageNumberPossible<2?false:true
        }        
    },
    methods: {
        async handleNextClick(){  
        },
        async handlePreviousClick(){
        },
        pageDataBackward(isASinglePageMove){
        if(isASinglePageMove){
                const paging = {
                MinRecordsViewable:((this.pagination.PageNumberCurrentlyViewing-1)*this.pagination.NumberOfApplicibleRowsPerPage)-this.pagination.NumberOfApplicibleRowsPerPage<=0?1:((this.pagination.PageNumberCurrentlyViewing-1)*this.pagination.NumberOfApplicibleRowsPerPage)-this.pagination.NumberOfApplicibleRowsPerPage,
                MaxRecordsViewable:this.pagination.MaxRecordsViewable-this.pagination.NumberOfApplicibleRowsPerPage>0?(this.pagination.MaxRecordsViewable-(this.pagination.MaxRecordsViewable-this.pagination.NumberOfApplicibleRowsPerPage)):this.pagination.MaxRecordsViewable,
                TotalNumberOfRecords:this.pagination.TotalNumberOfRecords,
                PageNumberCurrentlyViewing:this.pagination.PageNumberCurrentlyViewing-1,        
                MaxPageNumberPossible:this.pagination.MaxPageNumberPossible,
                NumberOfApplicibleRowsPerPage:this.pagination.NumberOfApplicibleRowsPerPage,
                IsPaging:this.pagination.PageNumberCurrentlyViewing-1===1?false:true,
                CurrentSkip:this.pagination.CurrentSkip-this.pagination.NumberOfApplicibleRowsPerPage,
                CurrentTake:this.pagination.NumberOfApplicibleRowsPerPage
                }
                this.pagination = paging
        } else {
                const paging = {
                MinRecordsViewable:1,
                MaxRecordsViewable:this.pagination.NumberOfApplicibleRowsPerPage,
                TotalNumberOfRecords:this.pagination.TotalNumberOfRecords,
                PageNumberCurrentlyViewing:1,        
                MaxPageNumberPossible:Math.ceil(this.pagination.TotalNumberOfRecords/this.pagination.NumberOfApplicibleRowsPerPage),
                NumberOfApplicibleRowsPerPage:this.pagination.NumberOfApplicibleRowsPerPage,
                IsPaging:false,
                CurrentSkip:0,
                CurrentTake:this.pagination.NumberOfApplicibleRowsPerPage         
                }
                this.pagination = paging          
        }
        },
        pageDataForward(isASinglePageMove){
            if(isASinglePageMove){
                let tmp = this.pagination.MinRecordsViewable===1?this.pagination.NumberOfApplicibleRowsPerPage:this.pagination.MinRecordsViewable+this.pagination.NumberOfApplicibleRowsPerPage
                let paging = {
                    MinRecordsViewable:tmp,
                    MaxRecordsViewable:tmp+this.pagination.NumberOfApplicibleRowsPerPage>this.pagination.TotalNumberOfRecords?this.pagination.TotalNumberOfRecords:tmp+this.pagination.NumberOfApplicibleRowsPerPage,
                    TotalNumberOfRecords:this.pagination.TotalNumberOfRecords,
                    PageNumberCurrentlyViewing:this.pagination.PageNumberCurrentlyViewing+1,        
                    MaxPageNumberPossible:this.pagination.MaxPageNumberPossible,
                    NumberOfApplicibleRowsPerPage:this.pagination.NumberOfApplicibleRowsPerPage,
                    IsPaging:true,
                    CurrentSkip:this.pagination.CurrentSkip+this.pagination.NumberOfApplicibleRowsPerPage,
                    CurrentTake:this.pagination.NumberOfApplicibleRowsPerPage
                }
                this.pagination = paging
            } else {
                const paging = {
                    MinRecordsViewable:this.pagination.TotalNumberOfRecords - (this.pagination.TotalNumberOfRecords - this.pagination.NumberOfApplicibleRowsPerPage) ,
                    MaxRecordsViewable:this.pagination.TotalNumberOfRecords,
                    TotalNumberOfRecords:this.pagination.TotalNumberOfRecords,
                    PageNumberCurrentlyViewing:this.pagination.MaxPageNumberPossible,        
                    MaxPageNumberPossible:this.pagination.MaxPageNumberPossible,
                    NumberOfApplicibleRowsPerPage:this.pagination.NumberOfApplicibleRowsPerPage,
                    IsPaging:true,
                    CurrentSkip:(this.pagination.MaxPageNumberPossible*this.pagination.NumberOfApplicibleRowsPerPage)-this.pagination.NumberOfApplicibleRowsPerPage,
                    CurrentTake:this.pagination.NumberOfApplicibleRowsPerPage         
                }
                this.pagination = paging
            }
        },
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
.cell{
    display:flex; 
    flex-direction:row;
    padding:5px;
    font-size:small;
    cursor:zoom-in;
    overflow: hidden;
}
.pagingText{
  font-size:12px;
  color:var(--ag-secondary-foreground-color,rgba(0,0,0,.54));
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif;
  line-height: normal;
}
.pagingTextArrow{
  font-size: 15px;
  color:var(--ag-secondary-foreground-color,rgba(0,0,0,.54));
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif;
  line-height: normal;
}
.pointer{
cursor: pointer;
}
</style>
