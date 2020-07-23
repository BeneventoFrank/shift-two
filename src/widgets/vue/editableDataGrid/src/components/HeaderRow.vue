<template>
    <div class='headerRow' :style="`width:${gridWillScroll?'99%':'100%'}`">
        <div :ref="`header-${header.columnIndex}`" :class="`headerCell ${(currentFilters.columnsBeingFiltered&&currentFilters.columnsBeingFiltered.length>0&&currentFilters.columnsBeingFiltered.includes(header.columnIndex.toString()))?'activeFilter':null}`" @mouseenter="()=>{handleFlyout(header.columnIndex,true)}"  @mouseleave="()=>{handleFlyout(header.columnIndex,false)}"  v-for="(header) in headers" :key="header.columnIndex" 
             :style="`width:${header.width}; height:${header.height}; backgroundColor:${header.backgroundColor}; color:${header.textColor}; border-right:${getBorder(header.borderWidth, header.borderColor, header.columnIndex)};`">
            <span> 
                {{header.text}}
            </span>
            <div :ref="`flyout-${header.columnIndex}`" class='flyout' v-if="showAFilter&&showFilter[header.columnIndex]===true" :style="`right:${wouldCauseAScroll(header.columnIndex)?wouldCauseAScroll(header.columnIndex):null}`">
                <div class='innerDiv' :style="`background-color:${bgColor}`">
                    <div class='flyoutHeader'>
                        <div class='headerItem sort'> 
                            <span @click="()=>{handleSortClick(header.columnIndex,'asc')}"><UpArrow class="sortButton" :height='15'/></span>
                            <span @click="()=>{handleSortClick(header.columnIndex,'desc')}"><DownArrow class="sortButton rightButton" :height='15'/></span>
                        </div>
                        <div class='headerItem'>
                            <label class='filterHeader'>{{header.text}}</label>
                        </div>
                        <div class='headerItem'>
                            &nbsp;
                        </div>
                    </div>
                    <br>
                    <FilterInput :defaultValue="cmpFilter(header.columnIndex)" :ref="`filterInput-${header.columnIndex}`" @filterInputChanged="(evt)=>{debounceInput(evt,header.columnIndex)}" :columnIndex="header.columnIndex"></FilterInput>
                    <br>
                    <div v-if="filterCount>0">
                        <span>Results: {{filterCount}}, Specify More Characters. </span>
                        <br>
                        <br>
                    </div>
                    <div v-show="showReturning">
                        <span>Fetching Original Data... </span>
                        <br>    
                        <br>
                    </div>                    
                </div>
            </div> 
        </div>
    </div>
</template>
<script>
import {colors} from '../../../../../assets/shiftTwo'
import debounce from 'lodash.debounce'
import FilterInput from '../components/filterInput'
import UpArrow from '../images/UpArrow'
import DownArrow from '../images/DownArrow'

export default {


    name:"HeaderRow",
    components: {
        FilterInput,
        UpArrow,
        DownArrow
    },
    data() {
        return {
            showAFilter:false,
            showFilter:{},
            bgColor:''
        };
    },
    computed: {
    },
    props:{
        headers:{
            type:Array
        },
        gridWillScroll:{
            type:Boolean
        },
        dataReceived:{
            type:Boolean
        },
        currentFilterColumns:{
            type:Array
        },
        currentFilters:{
            type:Object
        },
        filterCount:{
            type:Number
        },
        showReturning:{
            type:Boolean
        },
        gridWidth:{
            type:Number
        }
    },        
    methods: {
       handleSortClick(column, direction){
           console.log('here')
           this.$emit('columnSort',`${column}^^${direction}`)
       },
       wouldCauseAScroll(index){
            let retVal = '50px'
            let y = this.$refs[`header-${index}`]
            if((y[0].offsetLeft+350)>this.gridWidth){
                retVal = '350px'
            }
            return retVal
       },
       cmpFilter(columnIndex){
            let tmp = ['','']
            let split = []
            if(this.currentFilters.filters){
                for (let i = 0; i < this.currentFilters.filters.length; i++) {
                    split = this.currentFilters.filters[i].split('^^')
                    if(split[0] === columnIndex.toString() && split[1].length>0){
                        tmp = split
                    }
                }
            }
            return tmp[1]
       },
       handleShowTheDataAnyway(columnIndex){
           this.$emit('showDataAnyway',columnIndex)
       },
       handleFlyout(index,value){
        this.showAFilter=value
        this.showFilter[index] = value
        if(value===false)
        {
            this.$emit('filterClosed')
        }
       },
       debounceInput: debounce(function(evt, index){
            const strategy = `${index}^^${evt.target.value}`
            this.$emit('filterApplied',strategy)
       }, 300),
       getBorder(usersBorderWidth, usersBorderColor, columnIndex){
           if(columnIndex===this.headers.length-1){return null} //no left border on the first column or the last one 
           return usersBorderWidth?`${usersBorderWidth} solid ${usersBorderColor}`:`${this.defaultValues.borderWidth} solid ${this.defaultValues.borderColor}`
       },
    },
    mounted(){
        let tmp = {}
         for (let i = 0; i < this.headers.length; i++) {
             tmp[i]=false
         }
         this.showFilter = tmp
         this.bgColor = colors.editableDataGrid.defaultHeaderColor
  }
};
</script>
<style scoped>
    .headerRow{
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
    .flyout {
        position: relative;
        z-index: 5555;
    }
    .innerDiv {
        border:1px solid #C8C8C8;
        position:absolute;
        border-radius: 5px;
        display:flex;
        flex-direction: column;
        align-items: center;
        height:150px;
        width:300px;
        padding:10px;
    }
    .filterHeader {
        font-size:larger;
        margin-top:25px;
    }
    .activeFilter {
        background-color:#C3D9F9 !important;
    }
    .filterInput {
        height:30px;
        width: 93%;
        border-radius: 4px;
        outline: none;
        border: 1px solid rgb(176, 176, 176);
        line-height: 25px;
        padding:5px;
        font-size:16px;
    }
    .flyoutHeader {
        width:100%;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly
    }
    .headerItem{
        width:30%;
    }
    .sort{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }
    .sortButton{
        margin-top: 4px;
        cursor: pointer;
    }
    .rightButton{
        margin-left: 10px
    }
</style>
