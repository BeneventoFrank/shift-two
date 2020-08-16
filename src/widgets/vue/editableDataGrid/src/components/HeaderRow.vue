<template>
    <div>
        <div style='width:100%; background-color:white;'>
            <div class="superHeader" :style="`width:${gridWillScroll?'99%':'100%'}`">
                <div :style="`width:${header.width}; height:20px; display:flex; flex-direction:row; justify-content:space-between `" v-for="(header) in headers" :key="header.columnIndex">
                    <span style='display:flex;flex-direction:row;' v-if="currentFilters.columnsBeingFiltered&&currentFilters.columnsBeingFiltered.length>0&&currentFilters.columnsBeingFiltered.includes(header.columnIndex.toString())">
                        <div>
                            <FilterSVG style="padding-left:10px" :height="11"></FilterSVG>
                        </div>
                        <div style='padding-top:2px;'>
                            <span class="filterText" style="text-align:left; margin-left:5px">{{getFilterText(currentFilters.filters, header.columnIndex)}}</span>
                        </div>
                    </span>
                    <span v-else>&nbsp;</span>
                    <span v-if="currentSort&&currentSort.columnBeingSorted&&currentSort.columnBeingSorted === header.dataProperty">
                        <SortSVG style="padding-right:20px" :height="11"></SortSVG>
                    </span>
                    <span v-else>&nbsp;</span>
                </div>
            </div>
        </div>
        <div style='width:100%; background-color:rgb(245, 245, 245);'>
            <div class='headerRow' :style="`width:${gridWillScroll?'99%':'100%'}`">
                <div class="headerWrapper">
                    <div :ref="`header-${header.columnIndex}`" 
                        :style="`width:${header.width}; display:flex; flex-direction:row; justify-content:${header.alignment}; height:${header.height}; backgroundColor:${header.backgroundColor}; color:${header.textColor}; border-right:${getBorder(header.borderWidth, header.borderColor, header.columnIndex)};`"
                        :class="`headerCell 
                                ${(currentFilters.columnsBeingFiltered&&currentFilters.columnsBeingFiltered.length>0&&currentFilters.columnsBeingFiltered.includes(header.columnIndex.toString()))?'activeFilter':null} 
                                ${(currentSort&&currentSort.columnBeingSorted&&currentSort.columnBeingSorted === header.dataProperty.toString())?'activeFilter':null} 
                                `" 
                        @mouseenter="()=>{handleFlyout(header.columnIndex,true)}"  
                        @mouseleave="()=>{handleFlyout(header.columnIndex,false)}"  
                        v-for="(header) in headers" :key="header.columnIndex">
                        <span> 
                            {{header.text}}
                        </span>
                        <div :ref="`flyout-${header.columnIndex}`" class='flyout' v-if="showAFilter&&showFilter[header.columnIndex]===true" :style="`right:${wouldCauseAScroll(header.columnIndex)?wouldCauseAScroll(header.columnIndex):null}`">
                            <div class='innerDiv' :style="`background-color:${bgColor}`">
                                <div class='flyoutHeader'>
                                    <div class='headerItem sort'> 
                                        <span @click="()=>{handleSortClick(header.dataProperty,header.columnIndex,'asc')}"><UpArrow :isActiveColumn="header.dataProperty===currentSort.columnBeingSorted" :isActiveSort="isActiveSort==='asc'?'asc':''" class="sortButton" :height='15'/></span>
                                        <span @click="()=>{handleSortClick(header.dataProperty,header.columnIndex,'desc')}"><DownArrow :isActiveColumn="header.dataProperty===currentSort.columnBeingSorted" :isActiveSort="isActiveSort==='desc'?'desc':''" class="sortButton rightButton" :height='15'/></span>
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
                                <img v-show="(!isDoneFiltering)||(!isDoneSorting)" src='../images/loader.gif' style='height:auto; width:50px;'>
                                <br>
                            </div>
                        </div> 
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
import FilterSVG from '../images/FilterSVG'
import SortSVG from '../images/SortSVG'

export default {
    name:"HeaderRow",
    components: {
        FilterInput,
        UpArrow,
        DownArrow,
        FilterSVG,
        SortSVG,
    },
    data() {
        return {
            showAFilter:false,
            isSorting:false,
            showFilter:{},
            bgColor:'',
            isActiveSort:'',
            message:null,
            isSearching:false,
        };
    },
    watch:{
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
        currentFilters:{
            type:Object
        },
        gridWidth:{
            type:Number
        },
        currentSort:{
            type:Object
        },
        isDoneFiltering:{
            type:Boolean
        },
        isDoneSorting:{
            type:Boolean
        }
    },        
    methods: {
       getFilterText(filters, indexBeingFiltered){
           let retVal = ''
           for (let i = 0; i < filters.length; i++) {
               let split = filters[i].split('^^')
               if (split[0]===indexBeingFiltered.toString()) {
                   retVal = split[1]
                   break;
               } 
           }
           return retVal

       },
       handleSortClick(column, index, direction){
            if(this.isActiveSort === direction){
                this.$emit('columnSort','')
                this.isActiveSort = ''
            } else {
                this.isActiveSort=direction
                this.$emit('columnSort',`${column}^^${direction}`)
            }
       },
       wouldCauseAScroll(index){
            let retVal = '50px'
            let y = this.$refs[`header-${index}`]
            if((y[0].offsetLeft+y[0].offsetWidth/2+350)>this.gridWidth){
                retVal = '300px'
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
                        break;
                    }
                    
                }
            }
            return tmp[1]
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
           if(evt.target.value.length>1){
            this.isSearching = true
            const strategy = `${index}^^${evt.target.value}`
            this.$emit('filterApplied',strategy)
           } else {
               this.$emit('filterCleared',index)
           }
       }, 75),
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
        flex-direction:column;
        align-items: center;
        border-bottom: 1px solid slategrey;
    }
    .headerCell{
        display:flex; 
        flex-direction:row; 
        align-items:center; 
        justify-content:center; 
        font-size: 15px; 
        font-family:Arial, Helvetica, sans-serif;
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
    .headerWrapper{
        display: flex;
        flex-direction: row;
        width:100%
    }
    .superHeader{
        display: flex;
        flex-direction: row;
        background-color: white;
    }
    .filterText{
        overflow: hidden;
        width: 50px;
        text-overflow: ellipsis;
        display: inline-block;
        font-size:11px; 
        color:slateGrey; 
        opacity:.5;
    }
</style>
