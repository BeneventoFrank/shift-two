<template>
    <div ref="grid" style='width:100%;' class='container'>
        <div :style="`width:100%; background-color:${virtualColumns[virtualColumns.length-1]?virtualColumns[virtualColumns.length-1].backgroundColor:null}`">
            <HeaderRow v-if="userHasHeaders" :gridWillScroll="gridWillScroll()" :currentFilters="filterStrategy" @filterApplied="handleApplyFilter" :gridWidth="gridWidth" :headers="virtualColumns"></HeaderRow>
        </div>
        <div ref='dataRow' @scroll="debounceScroll" :style="`width:100%; overflow-y:scroll; position:relative; max-height:600px`">
            <table class='dataGrid' :style="`cellpadding:0; cellspacing:0; top:${tableTop}px; position:absolute; `">
                <tr :class="rowIndex%2===0?'evenRow':'oddRow'" :style="`border-spacing:0px; width:100%; border-collapse: collapse; line-height:10px; display:block;`" v-for="(dataRow,rowIndex) in dataSlice" :key="rowIndex">
                    <td :style="`width:${column.width}`" v-for="column in virtualColumns" :key="column.columnIndex">{{dataRow[column.dataProperty]}}</td>
                </tr>
            </table>
            <div :style="`position: relative; top:0px; left:0px; width: 1px; height:${virtualHeight}px;`">
            </div>
        </div>
    </div>
</template>
<script>


import HeaderRow from './components/HeaderRow'
import debounce from 'lodash.debounce'
import { colors } from '../../../../assets/shiftTwo'
import axios from 'axios'

export default {
    name:"EditableDataGrid",
    components: {
        HeaderRow
    },
    data() {
        return {
            headers:{
                hasHeaders:false
            },
            gridWidth:0,
            highestScrollPosition:0,
            gridData:[],
            fullDS:[],
            tableTop:0,
            skip:20,
            dataSlice:[],
            initialSlice:[],
            userHasHeaders:false,
            virtualColumns:[],
            virtualHeight:0,
            filterStrategy:{
                isCurrentlyFiltering:false,
                filters:{}
            },
            defaultValues:{
                columnValues:{
                    width:'',
                    height:'',
                    backgroundColor:'',
                    borderWidth:'',
                    borderColor:'',
                    textColor:'',
                    alignment:'',
                    dataAlignment:''
                }
            }
        };
    },
    computed: {
    },
    methods: {
        getWidthOfGrid(){
            return this.$refs.grid.offsetWidth
        },
        deriveHeaders(){
            console.log("TICKTOCK - DERIVING HEADERS", new Date())
            let hasHeader=false
            for (let i = 0; i < this.gridConfig.Columns.length; i++) {
                let tmp ={}
                if(Object.keys(this.gridConfig.Columns[i].header).length>0){
                    hasHeader=true;
                    tmp.columnIndex = i;
                    tmp.text = this.gridConfig.Columns[i].header.text?this.gridConfig.Columns[i].header.text:''
                    tmp.height = this.gridConfig.Columns[i].header.height?this.gridConfig.Columns[i].header.height:this.defaultValues.columnValues.height
                    tmp.width = this.gridConfig.Columns[i].width?this.gridConfig.Columns[i].width:this.defaultValues.columnValues.width
                    tmp.alignment = this.gridConfig.Columns[i].header.alignment?this.translateAlignment(this.gridConfig.Columns[i].header.alignment):this.defaultValues.columnValues.alignment
                    tmp.backgroundColor=this.gridConfig.Columns[i].header.backgroundColor?this.gridConfig.Columns[i].header.backgroundColor:this.defaultValues.columnValues.backgroundColor
                    tmp.textColor=this.gridConfig.Columns[i].header.textColor?this.gridConfig.Columns[i].header.textColor:this.defaultValues.columnValues.textColor
                    tmp.borderWidth=this.gridConfig.Columns[i].header.borderWidth?this.gridConfig.Columns[i].header.borderWidth:this.defaultValues.columnValues.borderWidth
                    tmp.borderColor=this.gridConfig.Columns[i].header.borderColor?this.gridConfig.Columns[i].header.borderColor:this.defaultValues.columnValues.borderColor     
                    tmp.dataProperty=this.gridConfig.Columns[i].dataProperty?this.gridConfig.Columns[i].dataProperty:''
                    tmp.dataAlignment=this.gridConfig.Columns[i].dataAlignment?this.translateAlignment(this.gridConfig.Columns[i].dataAlignment):this.defaultValues.columnValues.dataAlignment
                } else {
                    tmp.columnIndex = i;
                    tmp.text=''
                    tmp.height=''
                    tmp.width = this.gridConfig.Columns[i].width?this.gridConfig.Columns[i].width:this.defaultValues.columnValues.width
                    tmp.alignment = this.defaultValues.columnValues.alignment
                    tmp.backgroundColor=''
                    tmp.textColor=''
                    tmp.borderWidth=''
                    tmp.borderColor=''
                    tmp.dataProperty=''
                    tmp.dataAlignment=''
                }
                this.userHasHeaders=hasHeader
                this.virtualColumns.push(tmp)
            }
            
            console.log("TICKTOCK - DONE", new Date())
        },
        gridWillScroll(){
            let height = 600
            let retVal = false
            if(this.gridConfig.Height){
                //should come in as ###px but users are users 
                if(this.gridConfig.Height.includes('px')){
                    height = this.gridConfig.Height.split('p')[0]
                }
            }
            if (this.fullDS.length*30>height)
            {
                retVal=true
            }
            return retVal
        },
        handleResizeGrid(){
            debounce(()=>{this.gridWidth = this.$refs.grid.offsetWidth},300)()
        },
        setDefaultValues(){
           const numColumns = Object.keys(this.fullDS[0]).length
           const widthOfGrid = this.$refs.dataRow.offsetWidth
           const eachColumn = Math.round(widthOfGrid/numColumns)
            console.log(numColumns , ' ', eachColumn, ' ', widthOfGrid)

           this.defaultValues.columnValues.backgroundColor = colors.editableDataGrid.defaultHeaderColor
           this.defaultValues.columnValues.borderColor = colors.editableDataGrid.defaultBorderColor
           this.defaultValues.columnValues.textColor = colors.editableDataGrid.defaultTextColor
           this.defaultValues.columnValues.height = '35px';
           this.defaultValues.columnValues.width = `${eachColumn-23}px`
           this.defaultValues.columnValues.borderWidth = '1px'
           this.defaultValues.columnValues.alignment = 'center'
           this.defaultValues.columnValues.dataAlignment = 'center'
        },
        translateAlignment(val){
           switch (val) {
            case 'left':
                return 'flex-start'                   
            case 'right':
                return 'flex-end'                   
            default:
                return 'center'
           }
        },
        async getTestData(){
            console.log("TICKTOCK - GETTING DATA", new Date())
            await axios.get('http://localhost:5003/client/741/client-lists/1/list-data/1')
            .then(results=>{
                this.virtualHeight = results.data.length+600-19
                this.dataSlice = results.data.slice(1,50)
                // this.initialSlice = this.gridData //this is the initial slice that went to the screen. if you clear filter.. return it so its faster, then lazy load again
                this.fullDS = results.data
                // this.workingDS = results.data
                console.log("TICKTOCK - DONE", new Date())
            })
        },
        parseData(top){
            let tmp = []
            console.log("what is the top", top)
            for (let i = top; i < top+21; i++) {
                if(this.fullDS[i]&&Object.keys(this.fullDS[i]).length>0)
                {
                    tmp.push(this.fullDS[i])
                }
            }
            this.dataSlice = []
            this.dataSlice = tmp

        },
        debounceScroll: debounce(function (event){
                this.tableTop = event.srcElement.scrollTop
                this.parseData(this.tableTop)            
        },50),
        applyOtherFilters(){
            let tmp = this.fullDS;
            for (let i = 0; i < this.filterStrategy.filters.length; i++) {
                if(this.filterStrategy.filters[i]){
                    tmp = this.applyFilterToADataset(tmp,this.filterStrategy.filters[i])
                }
            }
            return tmp
        },
        applyFilterToADataset(dataset,strategy){
            const strat = strategy.split('^^')
            const col = strat[0]
            const keyword = strat[1]
            let filteredData = []
            for (let i = 0; i < dataset.length; i++) {
                if(dataset[i][this.virtualColumns[col].dataProperty].includes(keyword)){
                    filteredData.push(dataset[i])
                }   
            }
            return filteredData
        },
        handleApplyFilter(strategy){
            const isChangingAFilter = (column)=> {return this.filterStrategy.isCurrentlyFiltering&&this.filterStrategy.filters[column]&&this.filterStrategy.filters[column].length>0}
            const otherFiltersAreSet = (column)=>{
                let retVal = false
                for (let i = 0; i < this.filterStrategy.length; i++) {
                    if(i!==column&&Object.keys(this.filterStrategy.filters[i]).length>0){
                        retVal = true;
                        break;
                    }
                }
                return retVal
             }

            try {
                console.log("what is the strategy", strategy)
                const strat = strategy.split('^^')
                const col = strat[0]
                let tmp = []

                if(strat[1].length>0){
                    //then we have a filter to apply
                    if(this.filterStrategy.isCurrentlyFiltering)
                    {
                        if(isChangingAFilter(col)){
                            tmp = this.fullDS //then start over 
                        } else {
                            tmp = this.gridData //if we are already filtering, use the grid as the datasource
                        }
                    } else {
                        tmp = this.fullDS //else we have no current filters so use the full dataset to filter
                    }
                    this.gridData = this.applyFilterToADataset(tmp,strategy)
                    this.filterStrategy.isCurrentlyFiltering=true
                    this.filterStrategy.filters[col]=strategy
                } else { 
                    //we are clearing a filter so we'll need to apply the other filters to the dataset again if there are any
                    this.filterStrategy.filters[col]=null//wipe out the one we are about to replace, or it messes with the filtering.
                    if(otherFiltersAreSet(col)){
                        tmp = this.applyOtherFilters()
                    } else { //else, means we have no current filter, and no other filters. return the orignal slice of data and reset the scroll position
                        tmp = this.initialSlice
                    }
                    this.gridData = tmp
                }
            } catch (error) {
                console.log("awe snap son.. something happened.", strategy, error)
            }
        },


    },
    props:{
        gridConfig:{
            type: Object,
            required: true
        }
    },        
    async mounted(){
        await this.getTestData()
        this.setDefaultValues()
        this.deriveHeaders()
        this.gridWidth = this.$refs.grid.offsetWidth //set initial size of grid used for calculating where to put the filter flyouts
        window.addEventListener('resize',this.handleResizeGrid)
  },
  beforeDestroy(){
    window.removeEventListener('resize',this.handleResizeGrid)
  }
};
</script>
<style scoped>
.cell{
    width:20%;
}
.oddRow{
    border-top: 1px solid #DCDCDC;    
    background-color: #F8F8F8;
}
.dataRow{
    width:100%; 
    display:flex; 
    flex-direction:row;
    height:28px;
    border-bottom: 1px solid #DCDCDC;    
}

.dataGrid{

}
.dataGrid tr:hover{
    background-color: #E8E8E8;
}
td, th {
  padding: 10px;
  position: relative;
  outline: 0;
}


td:hover::after{ 
  content: '';  
  height: 1000px;
  left: 0;
  position: absolute;  
  top: 30px;
  width: 100%;
  z-index: 0;
}

td:hover::after {
  background-color: #E8E8E8 !important;
}




</style>
