<template>
    <div>
        <div style='width:100%; background-color:white;'>
            <div class="superHeader" :style="`width:100%;`">
                <div :style="`width:${header.Width}; height:20px; display:flex; flex-direction:row; justify-content:space-between `" v-for="(header,index) in gridSettings.columns" :key="index">
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
                                background-color:${gridSettings.colorScheme.GridHeaderBackgroundColor};`"
                        :class="`headerCell`" 
                        v-for="(header,index) in gridSettings.columns" :key="header.Index">
                        <span :style="`display:block; color:${gridSettings.colorScheme.GridHeaderTextColor}; width:${gridSettings.columns[index].WidthValue-3}px; min-width:${gridSettings.columns[index].WidthValue-3}px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis`"> 
                            {{header.ColumnHeader}}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:"HeaderRow",
    components: {
    },
    data() {
        return {
            message:null,
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
