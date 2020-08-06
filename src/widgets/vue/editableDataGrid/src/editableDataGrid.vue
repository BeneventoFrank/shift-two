<template>
    <div ref='grid' style='width:100%;' class='container'>
        <div style='display:flex; flex-direction:row; width:100%; justify-content:center; align-items:center; padding-bottom:25px;'>
            <div style="width:33.3%; padding-left:20px;"><Slider @change="handleChangeNumberPerPage" v-if="gridConfig.EnablePaging" :width="300"></Slider></div>
            <div style="width:33.3%;"><span class='title' v-if="gridConfig.GridHeader&&gridConfig.GridHeader.length>0" >{{gridConfig.GridHeader}}</span></div>
            <div style="width:33.3%; padding-right:20px;" class='pagination'>
                <Pagination 
                    v-if="gridConfig.EnablePaging"
                    :cmpCanPagePrevious="cmpCanPagePrevious"
                    :cmpCanPageNext="cmpCanPageNext"
                    :pagination="pagination"
                    @pageDataForward="handleNextClick"
                    @pageDataBackwards="handlePreviousClick"
                ></Pagination>
            </div>
        </div>
        <div :style="`width:100%; background-color:${virtualColumns[virtualColumns.length-1]?virtualColumns[virtualColumns.length-1].backgroundColor:null}`">
            <HeaderRow v-if="userHasHeaders" 
                             @columnSort="handleColumnSort" 
                             @filterClosed="handleFilterClosed" 
                             @filterApplied="handleApplyFilter" 
                             @filterCleared="handleClearFilter"
                                    :showReturning="showReturning" 
                             :defaultValues="defaultValues" 
                                :dataReceived="dataReceived" 
                                :filterCount="filterCount" 
                                :gridWillScroll="gridWillScroll()" 
                             :currentFilterColumns="filterStrategy.columnsBeingFiltered" 
                             :currentSort="sortStrategy" 
                             :isDoneFiltering="isDoneFiltering" 
                                :currentFilters="filterStrategy" 
                                :gridWidth="gridWidth" 
                             :headers="virtualColumns">
            </HeaderRow>
        </div>
        <div ref='dataRow' class='dataRow' @scroll="handleScroll" :style="`width:100%; overflow:auto; position:relative; max-height:600px`">
            <table class='dataGrid' :style="`cellpadding:0; cellspacing:0; top:${tableTop}px; position:absolute; `">
                <tr :class="rowIndex%2===0?'evenRow':'oddRow'" :style="`border-spacing:0px; width:100%; border-collapse: collapse; line-height:10px; display:block;`" v-for="(dataRow,rowIndex) in dataSlice" :key="rowIndex">
                    <td :style="`width:${column.width}; text-align:${column.dataAlignment}` " v-for="column in virtualColumns"  :key="column.columnIndex">{{dataRow[column.dataProperty]}}</td>
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
import Pagination from '../../pagination/Pagination'
import Slider from '../../slider/Slider'

export default {
    name:"EditableDataGrid",
    components: {
        HeaderRow,
        Slider,
        Pagination
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
            highestCountLoaded:0,
            numberOfTerminatedFilters:0,
            skip:20,
            dataSlice:[],
            showDataAnyway:false,
            filteredData:[],
            userHasHeaders:false,
            virtualColumns:[],
            virtualHeight:0,
            showReturning:false,
            lastPosition:0,
            isDoneFiltering:true,
            sortStrategy:{
                isCurrentlySorting:false,
                strategy:'',
                columnBeingSorted:''
            },
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
            },
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
        cmpCanPagePrevious:function(){
            return this.pagination.MinRecordsViewable<2?false:true
        },
        cmpCanPageNext:function(){
            return (this.pagination.MaxPageNumberPossible>1?true:false)&&(this.pagination.PageNumberCurrentlyViewing<this.pagination.MaxPageNumberPossible)
        }        
    },
    methods: {
        fetchRecordsFromDS(start,stop){
            return this.fullDS.slice(start,stop+1)
        },    
        reConfigurePagination(count){
            let paging = {
                MinRecordsViewable:1,
                MaxRecordsViewable:this.fullDS.length<count?this.fullDS.length:count,
                TotalNumberOfRecords:this.fullDS.length,
                PageNumberCurrentlyViewing:1,        
                MaxPageNumberPossible:Math.ceil(this.fullDS.length/count),
                NumberOfApplicibleRowsPerPage:count,
                IsPaging:false,
                CurrentSkip:0,
                CurrentTake:0
            }
            this.pagination = paging          
        },
        handleChangeNumberPerPage(event){
            let count = parseInt(event.target.value)
            this.reConfigurePagination(count);
            //TODO- you need to apply filtering and sorting after you do the configure
            let tmp = this.fullDS
            let processed=[]
            for (let i = 0; i < count; i++) {
                if(tmp[i]){
                    processed.push(tmp[i])
                }
            }
            this.virtualHeight = processed.length*29-950>0?processed.length*29-950:600
            this.dataSlice = processed;
            this.filteredData = processed;
        },            
        async handleNextClick(isASingleMove){
            this.pageDataForward(isASingleMove.isASinglePageMove)
            const start = (this.pagination.PageNumberCurrentlyViewing*this.pagination.NumberOfApplicibleRowsPerPage)-this.pagination.NumberOfApplicibleRowsPerPage
            const end = start + this.pagination.NumberOfApplicibleRowsPerPage
            this.dataSlice = this.fetchRecordsFromDS(start,end)
        },
        async handlePreviousClick(isASingleMove){
            this.pageDataBackward(isASingleMove.isASinglePageMove)
            const start = (this.pagination.PageNumberCurrentlyViewing*this.pagination.NumberOfApplicibleRowsPerPage)-this.pagination.NumberOfApplicibleRowsPerPage
            const end = ((this.pagination.PageNumberCurrentlyViewing+1)*this.pagination.NumberOfApplicibleRowsPerPage)-(this.pagination.NumberOfApplicibleRowsPerPage)
            this.dataSlice = this.fetchRecordsFromDS(start,end)
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
        initializePaging(numberOfRowsPerPage){
            if(this.fullDS.length > 0){
                let paging = {
                MinRecordsViewable:1,
                MaxRecordsViewable:this.fullDS.length>numberOfRowsPerPage?numberOfRowsPerPage:this.fullDS.length,
                TotalNumberOfRecords:this.fullDS.length,
                PageNumberCurrentlyViewing:1,   
                
                MaxPageNumberPossible:Math.ceil(this.fullDS.length/numberOfRowsPerPage),
                NumberOfApplicibleRowsPerPage:numberOfRowsPerPage,
                IsPaging:false,
                CurrentSkip:0,
                CurrentTake:0
                }
                this.pagination = paging          

            } else {
                let paging = {
                MinRecordsViewable:0,
                MaxRecordsViewable:0,
                TotalNumberOfRecords:0,
                PageNumberCurrentlyViewing:0,        
                MaxPageNumberPossible:0,
                NumberOfApplicibleRowsPerPage:numberOfRowsPerPage,
                IsPaging:false,
                CurrentSkip:0,
                CurrentTake:0
                }
                this.pagination = paging          
            }
        },
        getInitialRowsPerPage(){
            if((this.fullDS.length>=0)&&(this.fullDS.length<=100)){
                return 100
            } else if((this.fullDS.length>100)&&(this.fullDS.length<=1000)){
                return 500
            } else if(this.fullDS.length>1000){
                return 1000
            }
        },        
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
                    tmp.alignment = this.gridConfig.Columns[i].header.alignment?this.translateAlignment(this.gridConfig.Columns[i].header.alignment):this.translateAlignment(this.defaultValues.columnValues.alignment)
                    tmp.backgroundColor=this.gridConfig.Columns[i].header.backgroundColor?this.gridConfig.Columns[i].header.backgroundColor:this.defaultValues.columnValues.backgroundColor
                    tmp.textColor=this.gridConfig.Columns[i].header.textColor?this.gridConfig.Columns[i].header.textColor:this.defaultValues.columnValues.textColor
                    tmp.borderWidth=this.gridConfig.Columns[i].header.borderWidth?this.gridConfig.Columns[i].header.borderWidth:this.defaultValues.columnValues.borderWidth
                    tmp.borderColor=this.gridConfig.Columns[i].header.borderColor?this.gridConfig.Columns[i].header.borderColor:this.defaultValues.columnValues.borderColor     
                    tmp.dataProperty=this.gridConfig.Columns[i].dataProperty?this.gridConfig.Columns[i].dataProperty:''
                    tmp.dataAlignment=this.gridConfig.Columns[i].dataAlignment?this.gridConfig.Columns[i].dataAlignment:this.defaultValues.columnValues.dataAlignment
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
        sortDataset(strategy, dataset) {
            const setValue = (value)=>{return value?value:''}

            let sort = strategy.split('^^')
            if (sort[1]&&sort[1].length>0) {
                let column = sort[0]             
                let sortDirection = sort[1]   
                let index = sort[2]             

                this.sortStrategy.columnBeingSorted = index
                let tmp = []
                if(sortDirection==="asc")
                {
                    tmp = dataset.sort(function (a, b) {return ('' + setValue(a[column]).toLowerCase()).localeCompare(setValue(b[column]).toLowerCase());})
                } else {
                    tmp = dataset.sort(function (a, b) {return ('' + setValue(b[column]).toLowerCase()).localeCompare(setValue(a[column]).toLowerCase());})
                }
                this.sortStrategy.isCurrentlySorting = true;
                this.sortStrategy.strategy = strategy
                return tmp
            } else {
                this.sortStrategy.columnBeingSorted = ''
                this.sortStrategy.isCurrentlySorting = false;
                this.sortStrategy.strategy = ''
                return this.fullDS
            }
        },
        handleColumnSort(sortStrategy){
            this.filteredData = this.sortDataset(sortStrategy, [...this.fullDS])
            this.highestCountLoaded = this.getInitialRowsPerPage();     
            this.virtualHeight = (this.filteredData.length*29-950)<600?600:this.filteredData.length*29-950
            this.dataSlice = this.filteredData.slice(0,this.highestCountLoaded)
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
                b.push(
                        {
                        trim:Math.ceil(Math.random()*i*98765).toString(), 
                        make:Math.ceil(Math.random()*i*98765).toString(), 
                        model:Math.ceil(Math.random()*i*98765).toString(), 
                        year:Math.ceil(Math.random()*i*98765).toString()})
            }   
            this.virtualHeight = b.length*29-950>0?b.length*29-950:600
            this.fullDS = b
            this.highestCountLoaded = this.getInitialRowsPerPage()
            this.dataSlice = b.slice(0,this.highestCountLoaded)
            this.highestCountLoaded = this.highestCountLoaded + 1
            
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
                    if (message.data.Data.length>0) {
                        tmp = [...this.tmpResults, ...message.data.Data]
                        this.tmpResults = tmp
                    }
                    this.filterStrategy.isCurrentlyFiltering=true
                    break;
                case 'allFiltersApplied':
                    if (message.data.Data.length>0) {
                        tmp = [...this.tmpResults, ...message.data.Data]
                        this.tmpResults = tmp
                    }
                    this.filterStrategy.isCurrentlyFiltering=true
                    break;                                
                case 'originalData': 
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
                        this.highestCountLoaded = this.getInitialRowsPerPage();
                        
                        if(this.sortStrategy.isCurrentlySorting===true){
                            this.filteredData = this.sortDataset(this.sortStrategy.strategy,this.tmpResults)
                        } else {
                            this.filteredData = this.tmpResults
                        }
                        this.virtualHeight = (this.filteredData.length*29-950)<600?600:this.filteredData.length*29-950
                        this.dataSlice = this.filteredData.slice(0,this.highestCountLoaded)
                        this.filterCount = 0
                        this.numberOfTerminatedFilters = 0
                        this.tmpResults = []
                        this.isDoneFiltering=true
                    }
                    break;
                default:
                    break;
            }
        },
        handleClearFilter(columnIndex){
            if(this.filterStrategy.isCurrentlyFiltering){
                if(this.filterStrategy.columnsBeingFiltered.length===1&&this.filterStrategy.columnsBeingFiltered[0] === columnIndex.toString()){
                    this.clearFilters()
                    this.ww_forwardWorker.postMessage({'MessageType':'returnInitialData'})
                    this.ww_reverseWorker.postMessage({'MessageType':'returnInitialData'})
                } else {
                    //then clear a filter was called on a column but other filters are applied. 

                }
            }
        },
        handleApplyFilter(strategy){
           
            const addFilter = (col,filter) =>{ 
                this.filterStrategy.isCurrentlyFiltering = true
                this.filterStrategy.filters.push(`${col}^^${filter}`)
                console.log('pushing................................................................... col', col)
                
                this.filterStrategy.columnsBeingFiltered.push(col)
            }
            const updateFilter = (col,filter) =>{
                this.filterStrategy.isCurrentlyFiltering = true
                for (let i = 0; i < this.filterStrategy.filters.length; i++) {
                    let split = this.filterStrategy.filters[i].split('^^')
                    if(split[0]===col){
                        this.filterStrategy.filters[i] = `${col}^^${filter}`
                    }
                    break;
                }
            }

            let split = strategy.split('^^')
            let col = split[0]
            let filter = split[1]
            
            if(this.filterStrategy.isCurrentlyFiltering){ //if we are filtering
                if(this.filterStrategy.columnsBeingFiltered.includes(col)){
                    
                    updateFilter(col,filter)
                    this.isDoneFiltering=false

                    if(this.filterStrategy.columnsBeingFiltered.length>1){ 
                        this.ww_forwardWorker.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                        this.ww_reverseWorker.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                    } 
                    if(this.filterStrategy.columnsBeingFiltered.length===1){ 
                        this.ww_forwardWorker.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':false})  
                        this.ww_reverseWorker.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':false}) 
                    } 
   
                } else {
                    addFilter(col,filter)
                    this.isDoneFiltering=false
                    this.ww_forwardWorker.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':true})  
                    this.ww_reverseWorker.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':true}) 
                }
            } else {
                //then we are adding the only filter
                    addFilter(col,filter)
                    this.isDoneFiltering=false
                    this.ww_forwardWorker.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':false})  
                    this.ww_reverseWorker.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':false})                
            }
        },
        clearFilters(){
            this.filterStrategy = {
                                    isCurrentlyFiltering:false,
                                    filters:[],
                                    columnsBeingFiltered:[]
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
        this.initializePaging(this.getInitialRowsPerPage())
        
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
        .title{
            font-size:24px;
            color:slategrey;
            font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
        }
        .pagination{
            width: 100%;
            display:flex;
            flex-direction: row;
            justify-content: flex-end;
        }


</style>
