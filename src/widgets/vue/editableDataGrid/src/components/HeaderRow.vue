<template>
    <div>
        <div style='width:100%; background-color:white;'>
            <div class="superHeader" :style="`width:100%;`">
                <div :style="`width:${header.Width}; height:20px; display:flex; flex-direction:row; justify-content:space-between `" v-for="(header,index) in gridSettings.columns" :key="index">
                    <span style='display:flex;flex-direction:row;' v-if="currentFilters.columnsBeingFiltered.includes(index.toString())">
                        <div>
                            <FilterSVG style="padding-left:10px" :color="gridSettings.colorScheme.ActiveIndicatorColor" :height="11"></FilterSVG>
                        </div>
                        <div style='padding-top:2px;'>
                            <span class="filterText" :style="`text-align:left; margin-left:5px; color:${gridSettings.colorScheme.ActiveIndicatorColor};`">{{getFilterText(currentFilters.filters, index)}}</span>
                        </div>
                    </span>
                    <span v-else>&nbsp;</span>
                    <span v-if="currentSort.columnBeingSorted>=0&&currentSort.columnBeingSorted === index">
                        <SortSVG style="padding-right:20px" :color="gridSettings.colorScheme.ActiveIndicatorColor" :height="11"></SortSVG>
                    </span>
                    <span v-else>&nbsp;</span>
                </div>
            </div>
        </div>

        <div :style="`width: 100%; position: relative; background-color:${gridSettings.colorScheme.GridHeaderBackgroundColor}; z-index: 77; box-shadow: 0 6px 6px -5px black;`">
            <div class='headerRow' :style="`width:100%`">
                <div class="headerWrapper">
                    <div :id="`header-${index}`" :ref="`header-${index}`" 
                        :style="`width:${gridWillScroll?gridSettings.columns[index].WidthValue-1.5:gridSettings.columns[index].WidthValue}px; min-width:${gridWillScroll?gridSettings.columns[index].WidthValue-1.5:gridSettings.columns[index].WidthValue}px;  display:flex; flex-direction:row; 
                                justify-content:${gridSettings.columns[index].DataAlignment}; 
                                height:30px; 
                                background-color:${((currentFilters.columnsBeingFiltered.includes(index.toString()))) 
                                                    || ((currentSort.columnBeingSorted>=0&&currentSort.columnBeingSorted === index))?
                                                            gridSettings.colorScheme.ActiveIndicatorColor:
                                                                    gridSettings.colorScheme.GridHeaderBackgroundColor};`"
                        :class="`headerCell`" 
                        @mouseenter="()=>{handleFlyout(index,true)}"  
                        @mouseleave="()=>{handleFlyout(index,false)}"
                        
                        v-for="(header,index) in gridSettings.columns" :key="header.Index">
                        <span :style="`display:block; color:${gridSettings.colorScheme.GridHeaderTextColor}; width:${gridSettings.columns[index].WidthValue-3}px; min-width:${gridSettings.columns[index].WidthValue-3}px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis`"> 
                            {{header.ColumnHeader}}
                        </span>
                        <div :ref="`flyout-${index}`" class='flyout' v-if="!gridSettings.columns[index].IsUsingCustomComponent&&showAFilter&&showFilter[index]===true" :style="`right:${wouldCauseAScroll(index)?wouldCauseAScroll(index):null};`">
                            <div class='innerDiv' :style="`background-color:${gridSettings.colorScheme.FlyoutBackgroundColor}`">
                                <div class='flyoutHeader'>
                                    <div class='sort'> 
                                        <span @click="()=>{handleSortClick(index,'asc')}"><UpArrow :color="gridSettings.colorScheme.ActiveIndicatorColor" :isActiveColumn="currentSort.columnBeingSorted!==null&&header.Index.toString()===currentSort.columnBeingSorted.toString()" :isActiveSort="isActiveSort==='asc'?'asc':''" class="sortButton" :height='15'/></span>
                                        <span @click="()=>{handleSortClick(index,'desc')}"><DownArrow :color="gridSettings.colorScheme.ActiveIndicatorColor" :isActiveColumn="currentSort.columnBeingSorted!==null&&header.Index.toString()===currentSort.columnBeingSorted.toString()" :isActiveSort="isActiveSort==='desc'?'desc':''" class="sortButton rightButton" :height='15'/></span>
                                    </div>
                                    <div style="width:70%">
                                        <label class='filterHeader' :style="`color:${gridSettings.colorScheme.FlyoutTextColor};`">{{gridSettings.columns[index].ColumnHeader}}</label>
                                    </div>
                                    <div class='sort'>
                                        &nbsp;
                                    </div>       
                                </div>
                                <br>
                                <FilterInput :defaultValue="cmpFilter(index)" :ref="`filterInput-${index}`" @filterInputChanged="(evt)=>{debounceInput(evt,index)}" :columnIndex="index"></FilterInput>
                                <img v-show="(!isDoneFiltering)||(!isDoneSorting)" src='../images/loader.gif' style='height:auto; width:50px; margin-top:15px; padding-bottom:20px;'>
                                
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
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
            isActiveSort:'',
            message:null,
            isSearching:false,
            applyBGColor:false,
        };
    },
    props:{
        gridSettings:{
            type:Object
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
        }, 
        colorScheme:{
            type:Object
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
       handleSortClick(index, direction){
            console.log('sent in', index , direction)
            if(this.currentSort.isCurrentlySorting>=0){
                if (index === this.currentSort.columnBeingSorted) {
                        if(this.isActiveSort === direction){
                            this.$emit('columnSort','')
                            this.isActiveSort = ''
                        } else {
                            this.isActiveSort=direction
                            this.$emit('columnSort',`${index}^^${direction}`)
                        }
                } else {
                    this.isActiveSort=direction
                    this.$emit('columnSort',`${index}^^${direction}`)
                }
           } else {
                this.isActiveSort=direction
                this.$emit('columnSort',`${index}^^${direction}`)
           }
           
           if(((index === this.gridSettings.columns[index].Index)&&(this.isActiveSort!==''))){
                this.applyBGColor = true 
           } else {
               setTimeout(() => {
                    this.applyBGColor = false                      
               }, 500);
           }
       },
       wouldCauseAScroll(index){
            let retVal = '50%'
            let y = this.$refs[`header-${index}`]
            if(((y[0].offsetLeft+y[0].offsetWidth/2)+300)>this.gridSettings.size.GridWidthValue){
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

            if(this.gridSettings.columns.length-1 === index) {this.applyBGColor = true}

           } else {
               if (this.currentFilters.columnsBeingFiltered.includes(index.toString())) {
                    this.$emit('filterCleared',index)    
               }
               this.applyBGColor = (this.currentSort.isCurrentlySorting&&this.currentSort.columnBeingSorted===this.gridSettings.columns[this.gridSettings.columns.length-1].Index)
                                 ||((this.currentFilters.columnsBeingFiltered.includes((this.gridSettings.columns.length-1).toString()))&&(index !== this.gridSettings.columns.length-1))?true:false
           }
       }, 100),
    },
    mounted(){
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
        box-shadow: 0 8px 6px -6px black;
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
    .sort{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        width:15%;
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
        width:100%;
        box-shadow:0 8px 10px -8px black;
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
        font-size:13px; 
    }
</style>
