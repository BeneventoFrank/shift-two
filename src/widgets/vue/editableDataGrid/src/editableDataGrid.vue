<template>
    <div ref="grid" style='width:100%;' class='container'>
        <div :style="`width:100%; background-color:${virtualColumns[virtualColumns.length-1]?virtualColumns[virtualColumns.length-1].backgroundColor:null}`">
            <HeaderRow v-if="userHasHeaders" @filterClosed="handleFilterClosed" :showReturning="showReturning" @showDataAnyway="handleShowDataAnyway" :defaultValues="defaultValues" :dataReceived="dataReceived" :filterCount="filterCount" :gridWillScroll="gridWillScroll()" :currentFilterColumns="filterStrategy.columnsBeingFiltered" :currentFilters="filterStrategy" @filterApplied="handleApplyFilter" :gridWidth="gridWidth" :headers="virtualColumns"></HeaderRow>
        </div>
        <div ref='dataRow' class='dataRow' @scroll="handleScroll" :style="`width:100%; overflow:auto; position:relative; max-height:600px`">
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

import forwardWorker from './webWorkers/forwardFilterWorker'
import reverseWorker from './webWorkers/reverseFilterWorker'

import forwardWorkerSetup from './webWorkers/forwardFilterServiceWorkerSetup'
import reverseWorkerSetup from './webWorkers/reverseFilterServiceWorkerSetup'

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
            fullDS:[],
            filterCount:0,
            dataReceived:false,
            tableTop:0,
            scrollCount:0,
            multiple:10,
            addToTop:74,
            tmpResults:[],
            highestCountLoaded:150,
            numberOfTerminatedFilters:0,
            skip:20,
            dataSlice:[],
            showDataAnyway:false,
            initialSlice:[],
            filteredData:[],
            userHasHeaders:false,
            virtualColumns:[],
            virtualHeight:0,
            showReturning:false,
            lastPosition:0,
            filterStrategy:{
                isCurrentlyFiltering:false,
                filters:[],
                columnsBeingFiltered:[]
            },
            ww_forwardWorker:null,
            ww_reverseWorker:null,
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
        handleFilterClosed(){
            this.filterCount = 0
        },
        setDefaultValues(){
           const numColumns = Object.keys(this.fullDS[0]).length
           const widthOfGrid = this.$refs.dataRow.offsetWidth
           const eachColumn = Math.round(widthOfGrid/numColumns)
           this.defaultValues.columnValues.backgroundColor = colors.editableDataGrid.defaultHeaderColor
           this.defaultValues.columnValues.borderColor = colors.editableDataGrid.defaultBorderColor
           this.defaultValues.columnValues.textColor = colors.editableDataGrid.defaultTextColor
           this.defaultValues.columnValues.height = '35px';
           this.defaultValues.columnValues.width = `${eachColumn}px`
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
         getTestData(){
            let b = []
            for (let i = 1; i <= 10000; i++) {
                b.push({trim:Math.ceil(Math.random()*i*98765).toString(), make:Math.ceil(Math.random()*i*98765).toString(), model:Math.ceil(Math.random()*i*98765).toString(), year:Math.ceil(Math.random()*i*98765).toString(),trim2:Math.ceil(Math.random()*i*98765).toString(), make2:Math.ceil(Math.random()*i*98765).toString(), model2:Math.ceil(Math.random()*i*98765).toString(), year2:Math.ceil(Math.random()*i*98765).toString(),trim3:Math.ceil(Math.random()*i*98765).toString(), make3:Math.ceil(Math.random()*i*98765).toString(), model3:Math.ceil(Math.random()*i*98765).toString(), year3:Math.ceil(Math.random()*i*98765).toString() })
            }   
            this.virtualHeight = b.length*29-950>0?b.length*29-950:600
            this.dataSlice = b.slice(0,this.highestCountLoaded)
            this.initialSlice = this.dataSlice
            this.highestCountLoaded = this.highestCountLoaded + 1
            this.fullDS = b
        },
        parseData(startingPoint){
            let tmp = []
            let ds = this.filteredData.length>0?this.filteredData:this.fullDS
            for (let i = startingPoint+1; i < startingPoint+150; i++) {
                if(ds[i]&&Object.keys(ds[i]).length>0)
                {
                    tmp.push(ds[i])
                }
            }
            this.dataSlice = tmp
        },
        handleScroll(){
            let scrollHeight
            window.requestAnimationFrame(()=>{
                if(this.$refs.dataRow.scrollTop>this.highestScrollPosition){
                    if (this.$refs.dataRow.scrollTop>1000) {
                    this.tableTop = this.$refs.dataRow.scrollTop -1000    
                    }
                    scrollHeight = Math.ceil(this.$refs.dataRow.scrollTop/29)
                    this.parseData(scrollHeight)

                } else {
                    scrollHeight = Math.ceil(this.$refs.dataRow.scrollTop/29)-450
                    if(scrollHeight<950){
                        scrollHeight = 0
                    }
                    this.tableTop = this.$refs.dataRow.scrollTop
                    this.parseData(scrollHeight)
                }
                this.highestScrollPosition = scrollHeight
            })
        },
        handleMessage(message){
            let tmp = []
            switch (message.data.MessageType) {
                case 'countUpdate':
                    this.filterCount = message.data.Count
                    break;
                case 'filterResults':
                    this.filterStrategy.columnsBeingFiltered = [...this.filterStrategy.columnsBeingFiltered, message.data.Column]
                    if (message.data.Data.length>0) {
                        tmp = [...this.tmpResults, ...message.data.Data]
                        this.tmpResults = tmp
                    }
                    this.filterStrategy.isCurrentlyFiltering=true
                    break;
                case 'allFiltersApplied':
                    tmp = [...this.tmpResults, message.data.Data]
                    if (message.data.Data.length>0) {
                        tmp = [...this.tmpResults, ...message.data.Data]
                        this.tmpResults = tmp
                    }
                    this.filterStrategy.isCurrentlyFiltering=true
                    break;                                
                case 'originalData': 
                    tmp = [...this.tmpResults, message.data.Data]
                    if (message.data.Data.length>0) {
                        tmp = [...this.tmpResults, ...message.data.Data]
                        this.tmpResults = tmp
                    }
                    this.clearFilters()
                    break;
                case 'filterTerminated':
                    this.numberOfTerminatedFilters = this.numberOfTerminatedFilters +1                      
                    if(this.numberOfTerminatedFilters===2)    
                    {
                        this.highestCountLoaded = 150
                        this.filteredData = this.tmpResults
                        this.virtualHeight = (this.filteredData.length*29-950)<600?600:this.filteredData.length*29-950
                        this.dataSlice = this.filteredData.slice(0,this.highestCountLoaded)
                        this.filterCount = 0
                        this.numberOfTerminatedFilters = 0
                        this.tmpResults = []
                    }
                    break;
                default:
                    break;
            }
        },
        handleShowDataAnyway(column){
            this.showDataAnyway = true
            this.highestCountLoaded = 150
            this.virtualHeight = this.filteredData.length*29-950
            this.dataSlice = this.filteredData.slice(1,this.highestCountLoaded)
            this.filterStrategy.columnsBeingFiltered = [...this.filterStrategy.columnsBeingFiltered, column.toString()]
        },
        handleApplyFilter(strategy){
            let isFilterchange = false
            let split = strategy.split('^^')
            let hasOtherFiltersToApply = false

            for (let i = 0; i < this.filterStrategy.filters.length; i++) {
                let tmpSplit = this.filterStrategy.filters[i].split('^^')
                if(tmpSplit[0] === split[0]){

                    if (tmpSplit[1].length > split[1].length) {
                        isFilterchange = true
                    } else {
                        isFilterchange = false
                    }
                } else {
                    //else we are in here b/c there is a filter and its not the one we are on right now.
                    //need to make sure we have one thats not ''
                    if(tmpSplit[1].length > 0){
                        hasOtherFiltersToApply = true
                    }
                } 
            }
            let isClearingTheOnlyFilter = false
            if(split[1].length < 2 && hasOtherFiltersToApply===false&& this.filterStrategy.isCurrentlyFiltering){
                isClearingTheOnlyFilter = true
            }
            this.SetFilterStrategy(strategy)
            this.showReturning = false
            if (hasOtherFiltersToApply&&split[1].length<2) {
                this.ww_forwardWorker.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                this.ww_reverseWorker.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
            } else if(isClearingTheOnlyFilter) {
                this.showReturning = true
                setTimeout(() => {
                    this.showReturning = false    
                }, 2000);
                this.ww_forwardWorker.postMessage({'MessageType':'returnInitialData'})
                this.ww_reverseWorker.postMessage({'MessageType':'returnInitialData'})
            } else {
                let isFiltering = true
                if((!hasOtherFiltersToApply||isFilterchange)){
                    isFiltering = false
                }
                if(split[1].length > 1){
                    this.ww_forwardWorker.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':isFiltering})  
                    this.ww_reverseWorker.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':isFiltering})                
                }
            }
        },
        clearFilters(){
            this.filterStrategy = {
                                    isCurrentlyFiltering:false,
                                    filters:[],
                                    columnsBeingFiltered:[]
                                  }
        },
        SetFilterStrategy(strategy){
            let split = strategy.split('^^')
            let col = split[0]
            let strat = split[1]
            let columnsBeingFiltered = []
            if (strat.length>0) {
                this.filterStrategy.filters = [...this.filterStrategy.filters, strategy]
            } else {
                let filteredArray = this.filterStrategy.filters.filter(element =>{
                    let tmpSplit = element.split('^^')
                    if(tmpSplit[0]!==col){
                        columnsBeingFiltered.push(tmpSplit[0])
                        return element
                    }
                })
                this.filterStrategy.filters = filteredArray
                this.filterStrategy.columnsBeingFiltered = columnsBeingFiltered
            }
        }
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
        
        this.ww_forwardWorker = new forwardWorkerSetup(forwardWorker)
        this.ww_forwardWorker.addEventListener('message',event =>{this.handleMessage(event)})
        this.ww_forwardWorker.postMessage({'MessageType':'data','Data':this.fullDS, 'Columns':this.virtualColumns})
        this.ww_reverseWorker = new reverseWorkerSetup(reverseWorker)
        this.ww_reverseWorker.addEventListener('message',event =>{this.handleMessage(event)})
        this.ww_reverseWorker.postMessage({'MessageType':'data','Data':this.fullDS, 'Columns':this.virtualColumns})

  },
  beforeDestroy(){
    window.removeEventListener('resize',this.handleResizeGrid)
  }
};
</script>
<style >
html {
  scroll-behavior: smooth;
}
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
    scroll-behavior: smooth;
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


td:hover {
    background-color: #DCDCDC;

}

td:hover::after {
  background-color: #E8E8E8 !important;
}




</style>
