<template>
    <div ref='grid' style='width:100%;' >
        <div style='display:flex; flex-direction:row; width:100%; justify-content:center; align-items:center; padding-bottom:25px;'>
            <div style="width:33.3%; padding-left:20px; display:flex; flex-direction:row; align-items:flex-end;">
                <div style="width:300px; display:flex; flex-direction:row; justify-content:flex-start;">
                    <Slider @change="handleChangeNumberPerPage" @initialValue="handleInitialValue" v-if="gridConfig.EnablePaging" :width="300"></Slider>
                </div>
                <div style="margin-left:50px;">
                    <div @mouseenter="handleShowCancelEye" class='pointer eye'  v-show="!isHovering&&(filterStrategy.isCurrentlyFiltering||sortStrategy.isCurrentlySorting)"><Eye :height='25'/></div>
                    <div @mouseleave="handleShowCancelEye" @click="handleClearAllFilters" class='pointer tooltip eye' v-show="isHovering" ><CancelEye :height='25' /><span class="tooltiptext">Clear Filtering/Sorting</span></div>
                </div>
            </div>
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
                                :gridWillScroll="boolGridWillScroll" 
                             :currentFilterColumns="filterStrategy.columnsBeingFiltered" 
                             :currentSort="sortStrategy" 
                             :isDoneFiltering="isDoneFiltering"
                             :isDoneSorting="isDoneSorting" 
                                :currentFilters="filterStrategy" 
                                :gridWidth="gridWidth" 
                             :headers="virtualColumns">
            </HeaderRow>
        </div>
        <div ref='dataRow' class='dataRow' :style="`width:100%; overflow:auto; position:relative; height:600px`">
            <table class='dataGrid' :style="`cellpadding:0; cellspacing:0; top:${tableTop}px; position:absolute; padding-bottom:62px `">
                <tr :class="rowIndex%2===0?'evenRow':'oddRow'" :style="`border-spacing:0px; width:100%; border-collapse: collapse; line-height:10px; display:block;`" v-for="(dataRow,rowIndex) in dataSlice" :key="rowIndex">
                    <td :style="`width:${column.width}; text-align:${column.dataAlignment}` " v-for="column in virtualColumns"  :key="column.columnIndex">{{dataRow[column.dataProperty]}}</td>
                </tr>
            </table>
           
        </div>
    </div>
</template>
<script>


import HeaderRow from './components/HeaderRow'
import debounce from 'lodash.debounce'
import { colors } from '../../../../assets/shiftTwo'

import forwardWorker from './webWorkers/forwardFilterWorker'
import reverseWorker from './webWorkers/reverseFilterWorker'
import evenSortWorker from './webWorkers/evenSortWorker'
import oddSortWorker from './webWorkers/oddSortWorker'
import sortWorker from './webWorkers/sortWorker'

import forwardWorkerSetup from './webWorkers/forwardFilterServiceWorkerSetup'
import reverseWorkerSetup from './webWorkers/reverseFilterServiceWorkerSetup'
import evenSortWorkerSetup from './webWorkers/sortWorkerSetup'
import oddSortWorkerSetup from './webWorkers/sortWorkerSetup'
import sortWorkerSetup from './webWorkers/sortWorkerSetup'

import Pagination from '../../pagination/Pagination'
import Slider from '../../slider/Slider'
import Eye from '../src/images/Eye'
import CancelEye from '../src/images/CancelEye'

export default {
    name:"EditableDataGrid",
    components: {
        HeaderRow,
        Slider,
        Pagination,
        Eye,
        CancelEye
    },
    data() {
        return {
            headers:{
                hasHeaders:false
            },
            gridWidth:0,
            highestScrollPosition:0,
            fullDS:[],
            sliderDataset:[],
            weAreUsingTheSlider:false,
            sliderCount:false,
            sortedData:{},
            isDonePreSorting:false,
            filterCount:0,
            dataReceived:false,
            tableTop:0,
            scrollCount:0,
            multiple:10,
            addToTop:74,
            tmpResults:[],
            boolGridWillScroll:false,
            tmpResultsSort:{},
            highestCountLoaded:0,
            numberOfTerminatedFilters:0,
            numberOfTerminatedSorts:0,
            skip:20,
            dataSlice:[],
            isHovering:false,
            showDataAnyway:false,
            filteredData:[],
            userHasHeaders:false,
            virtualColumns:[],
            virtualHeight:0,
            showReturning:false,
            lastPosition:0,
            isDoneFiltering:true,
            isDoneSorting:true,
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
            ww_evenSortWorker:null,
            ww_oddSortWorker:null,
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
        handleInitialValue(event){
            console.log('setting initial value to ',event)
            this.sliderCount = event
        },
        handleClearAllFilters(){
            this.sortStrategy = {
                isCurrentlySorting:false,
                strategy:'',
                columnBeingSorted:''
            }
            this.filterStrategy = {
                isCurrentlyFiltering:false,
                filters:[],
                columnsBeingFiltered:[]
            }
            this.highestCountLoaded = this.getInitialRowsPerPage();
            this.filteredData = []
            this.filteredData = this.fullDS 
            this.virtualHeight = (this.filteredData.length*29-950)<600?600:this.filteredData.length*29-950
            this.dataSlice = this.filteredData.slice(0,this.highestCountLoaded)   
            this.reConfigurePagination(this.sliderCount)                    
        },
        handleShowCancelEye(){
            this.isHovering = !this.isHovering
        },
        fetchRecordsFromDS(start,stop){
            return this.fullDS.slice(start,stop+1)
        },    
        reConfigurePagination(count){
            let tmp = []
            if (this.filterStrategy.isCurrentlyFiltering||this.sortStrategy.isCurrentlySorting){
                tmp = this.filteredData
            } else{
                tmp = this.fullDS
            }


            let paging = {
                MinRecordsViewable:1,
                MaxRecordsViewable:tmp.length<count?tmp.length:count,
                TotalNumberOfRecords:tmp.length,
                PageNumberCurrentlyViewing:1,        
                MaxPageNumberPossible:Math.ceil(tmp.length/count),
                NumberOfApplicibleRowsPerPage:count,
                IsPaging:false,
                CurrentSkip:0,
                CurrentTake:0
            }
            this.pagination = paging          
        },
        handleChangeNumberPerPage(event){
            this.weAreUsingTheSlider=true
            let count = parseInt(event.target.value)
            this.sliderCount = count
            this.reConfigurePagination(count);
            let tmp = []
            if (this.filterStrategy.isCurrentlyFiltering||this.sortStrategy.isCurrentlySorting){
                tmp = this.filteredData
            } else{
                tmp = this.fullDS
            }
            console.log("what is count", count)
            let processed=[]
            for (let i = 0; i < count; i++) {
                if(tmp[i]){
                    processed.push(tmp[i])
                }
            }

            let willScroll = this.gridWillScroll(processed.length)
            console.log('willscroll', willScroll)
            this.virtualHeight = !willScroll?600:(processed.length*29-950)<600?600:processed.length*29-950
            this.dataSlice = processed;
            this.sliderDataset = processed;
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
            if (this.weAreUsingTheSlider) {
                return this.sliderCount
            } else {
                if((this.fullDS.length>=0)&&(this.fullDS.length<=100)){
                    return 100
                } else if((this.fullDS.length>100)&&(this.fullDS.length<=1000)){
                    return 500
                } else if(this.fullDS.length>1000){
                    return 1000
                }
            }
        },        
        getWidthOfGrid(){
            return this.$refs.grid.offsetWidth
        },
        deriveHeaders(){
            const checkThreshold = ()=>{
                if(this.fullDS.length>10000)
                {
                    return false
                }
                if(this.virtualColumns.length > 10)
                {
                    return false
                }
                return true
            }
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
                    tmp.dataType=this.gridConfig.Columns[i].dataType?this.gridConfig.Columns[i].dataType:'string'
                    tmp.isPreSortEnabled=this.gridConfig.Columns[i].preSortColumn===true?true:checkThreshold()
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
                    tmp.dataType = String
                    tmp.isPreSortEnabled=false
                }
                this.userHasHeaders=hasHeader
                this.virtualColumns.push(tmp)
            }
        },
        gridWillScroll(numberOfRows){
            let height = 600
            let retVal = false
            if(this.gridConfig.Height){
                //should come in as ###px but users are users 
                if(this.gridConfig.Height.includes('px')){
                    height = this.gridConfig.Height.split('p')[0]
                }
            }
            let tmp = 0
            if (this.filterStrategy.isCurrentlyFiltering||this.sortStrategy.isCurrentlySorting){
                tmp = this.filteredData.length
            } else{
                if(numberOfRows){
                    tmp = numberOfRows
                } else {
                    tmp = this.fullDS.length
                }
            }

            if (tmp*31>height)
            {
                retVal=true
            }
            console.log('gridwill scroll?????????', retVal, numberOfRows)
            this.boolGridWillScroll = retVal
            return retVal
        },
        handleColumnSort(strategy){
            this.isDoneSorting = false
            const checkColumn = (column)=>{
                for (let i = 0; i < this.virtualColumns.length; i++) {
                    if(this.virtualColumns[i].dataProperty===column){
                        return this.virtualColumns[i].isPreSortEnabled
                    }
                }
            }
            if(strategy !== ''){
                    if(this.filterStrategy.isCurrentlyFiltering){
                    this.ww_sortWorker.postMessage({'MessageType':'sortFilteredData','SortStrategy':strategy, 'Data':this.filteredData})
                    } else {
                        let split = strategy.split('^^')
                        let isApplicable = checkColumn(split[0])
                        if(this.isDonePreSorting&&isApplicable)
                        {
                            try {
                                this.sortStrategy = {}
                                this.sortStrategy.strategy = strategy
                                this.sortStrategy.isCurrentlySorting = true
                                this.sortStrategy.columnBeingSorted = split[0]
                                this.highestCountLoaded = this.getInitialRowsPerPage();
                                this.filteredData = []
                                this.filteredData = this.sortedData[split[0]][split[1]] 
                                this.virtualHeight = (this.filteredData.length*29-950)<600?600:this.filteredData.length*29-950
                                this.dataSlice = this.filteredData.slice(0,this.highestCountLoaded)
                                this.isDoneSorting = true;
                            } catch (error) {
                                this.isDoneSorting = true;
                                //do nothing
                            }
                        } else {
                            console.log('not done sorting yet... .')
                            this.ww_sortWorker.postMessage({'MessageType':'applySort','SortStrategy':strategy})
                        }
                    }
            } else {
                this.sortStrategy={
                    isCurrentlySorting:false,
                    strategy:'',
                    columnBeingSorted:''
                }
                this.isDoneSorting = true;
                if(this.filterStrategy.isCurrentlyFiltering){
                    this.ww_forwardWorker.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                    this.ww_reverseWorker.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                } else {
                    this.highestCountLoaded = this.getInitialRowsPerPage();
                    this.filteredData = []
                    this.filteredData = this.fullDS 
                    this.virtualHeight = (this.filteredData.length*29-950)<600?600:this.filteredData.length*29-950
                    this.dataSlice = this.filteredData.slice(0,this.highestCountLoaded)
                }
            }

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
            let alphaString = []
            let alpha = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
            const getAlpha = ()=>{
                alphaString = ''
                for (let i = 0; i < 4; i++) {
                    let index = Math.floor(Math.random() * 27)
                    if (index<1||index>26) {
                        index = Math.floor(Math.random() * 27)
                    }
                    alphaString += (alpha[index])
                }
                return alphaString.length>10?alphaString.substring(1,4):alphaString
            }


            for (let i = 1; i <= 50000; i++) {
                b.push(
                        {
                        trim:Math.ceil(Math.random()*i*65), 
                        make:Math.ceil(Math.random()*i*98765), 
                        model:Math.ceil(Math.random()*i*965), 
                        year:Math.ceil(Math.random()*i*98765),
                        color:Math.ceil(Math.random()*i*9765),
                        manufacturer:getAlpha(),
                        plant:Math.ceil(Math.random()*i*5),
                        vin:Math.ceil(Math.random()*i*75),
                        plateNumber:Math.ceil(Math.random()*i*95),
                        price:Math.ceil(Math.random()*i*9)
                        })
            }   
            this.virtualHeight = b.length*29-950>0?b.length*29-950:600
            this.fullDS = b
            this.highestCountLoaded = this.getInitialRowsPerPage()
            this.dataSlice = b.slice(0,this.highestCountLoaded)
            this.highestCountLoaded = this.highestCountLoaded + 1
        },
        parseData(startingPoint){
            let tmp = []
            let ds = []
            let tmpVal = 150
            if(this.filterStrategy.strategy||this.sortStrategy.isCurrentlySorting){
                ds = this.filteredData
            } else {
                ds = this.fullDS
            }
            for (let i = startingPoint; i < startingPoint+tmpVal; i++) {
                if(ds[i]&&Object.keys(ds[i]).length>0)
                {
                    tmp.push(ds[i])
                }
            }
            this.dataSlice = tmp
        },
        handleMessage(message){
            let tmp = []
            console.log('editableGrid received a message', message)
            switch (message.data.MessageType) {
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
                case 'sortComplete':
                        this.filteredData = [...message.data.Data]
                        this.sortStrategy = {}
                        this.sortStrategy.strategy = message.data.Strategy
                        this.sortStrategy.isCurrentlySorting = true
                        this.sortStrategy.columnBeingSorted = message.data.Column

                        this.highestCountLoaded = this.getInitialRowsPerPage();
                        this.virtualHeight = (this.filteredData.length*29-950)<600?600:this.filteredData.length*29-950
                        this.dataSlice = this.filteredData.slice(0,this.highestCountLoaded)
                        this.filterCount = 0
                        this.tmpResults = []
                        this.isDoneSorting = true
                        this.reConfigurePagination(this.sliderCount)
                    break;
                case 'dataSorted':
                    this.tmpResultsSort= {...this.tmpResultsSort, ...message.data.Data}
                    break;
                case 'sortTerminated':
                    this.numberOfTerminatedSorts = this.numberOfTerminatedSorts +1                      
                    if(this.numberOfTerminatedSorts===2)    
                    {
                        console.log("this.tmpResultsSort",this.tmpResultsSort)
                        this.sortedData = this.tmpResultsSort
                        this.isDonePreSorting = true
                        this.ww_oddSortWorker.terminate()
                        this.ww_evenSortWorker.terminate()
                    }
                    
                    break;
                case 'filterTerminated':
                    this.numberOfTerminatedFilters = this.numberOfTerminatedFilters +1                      
                    if(this.numberOfTerminatedFilters===2)    
                    {
                        console.log("checking this current sort",this.sortStrategy.isCurrentlySorting)
                        if(this.sortStrategy.isCurrentlySorting===true){
                            console.log('making a call to sort this filterd data', this.tmpResults)
                            this.ww_sortWorker.postMessage({'MessageType':'sortFilteredData', 'SortStrategy':this.sortStrategy.strategy, 'Data': this.tmpResults})
                            this.numberOfTerminatedFilters = 0
                            this.isDoneFiltering=true
                        } else {
                            this.filteredData = this.tmpResults
                            this.highestCountLoaded = this.getInitialRowsPerPage();
                            this.virtualHeight = (this.filteredData.length*29-950)<600?600:this.filteredData.length*29-950
                            this.dataSlice = this.filteredData.slice(0,this.highestCountLoaded)
                            this.filterCount = 0
                            this.numberOfTerminatedFilters = 0
                            this.tmpResults = []
                            this.isDoneFiltering=true
                            if (this.filteredData.length>this.sliderCount) {
                                this.reConfigurePagination(this.sliderCount)
                            } else {
                                this.reConfigurePagination(this.filteredData.length)
                            }
                            
                        }
                        
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
                    if (this.sortStrategy.isCurrentlySorting) {
                            const split = this.sortStrategy.strategy.split('^^')
                            this.filteredData = this.sortedData[split[0]][split[1]]
                            this.highestCountLoaded = this.getInitialRowsPerPage();
                            this.virtualHeight = (this.filteredData.length*29-950)<600?600:this.filteredData.length*29-950
                            this.dataSlice = this.filteredData.slice(0,this.highestCountLoaded)
                    } else {
                            this.highestCountLoaded = this.getInitialRowsPerPage();
                            this.filteredData = []
                            this.filteredData = this.fullDS 
                            this.virtualHeight = (this.filteredData.length*29-950)<600?600:this.filteredData.length*29-950
                            this.dataSlice = this.filteredData.slice(0,this.highestCountLoaded)                        
                    }
3                } else {
                    //then clear a filter was called on a column but other filters are applied. 
                    this.clearAFilter(columnIndex)
                    this.ww_forwardWorker.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                    this.ww_reverseWorker.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                }

                if(this.sortStrategy.isCurrentlySorting===true){
                    this.ww_sortWorker.postMessage({'MessageType':'applySort', 'SortStrategy':this.sortStrategy.strategy})
                } 
                this.reConfigurePagination(this.sliderCount)               
            }
        },
        clearAFilter(col){
            let tmp = []
            let tmpCol = []
            for (let i = 0; i < this.filterStrategy.filters.length; i++) {
                let split = this.filterStrategy.filters[i].split('^^')
                if(split[0]!==col.toString()){
                    tmpCol.push(split[0])
                    tmp.push(this.filterStrategy.filters[i])
                }
            }
            this.filterStrategy = {
                                    isCurrentlyFiltering:true,
                                    filters:tmp,
                                    columnsBeingFiltered:tmpCol
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
                        break;
                    }
                    
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
        this.gridWillScroll()
        this.gridWidth = this.$refs.grid.offsetWidth //set initial size of grid used for calculating where to put the filter flyouts
        window.addEventListener('resize',this.handleResizeGrid)
        
        this.ww_forwardWorker = new forwardWorkerSetup(forwardWorker)
        this.ww_forwardWorker.addEventListener('message',event =>{this.handleMessage(event)})
        this.ww_forwardWorker.postMessage({'MessageType':'data','Data':this.fullDS, 'Columns':this.virtualColumns})

        this.ww_reverseWorker = new reverseWorkerSetup(reverseWorker)
        this.ww_reverseWorker.addEventListener('message',event =>{this.handleMessage(event)})
        this.ww_reverseWorker.postMessage({'MessageType':'data','Data':this.fullDS, 'Columns':this.virtualColumns})

        this.ww_evenSortWorker = new evenSortWorkerSetup(evenSortWorker)
        this.ww_evenSortWorker.addEventListener('message',event => {this.handleMessage(event)})
        this.ww_evenSortWorker.postMessage({'MessageType':'data','Data':this.fullDS, 'Columns':this.virtualColumns})

        this.ww_oddSortWorker = new oddSortWorkerSetup(oddSortWorker)
        this.ww_oddSortWorker.addEventListener('message',event => {this.handleMessage(event)})
        this.ww_oddSortWorker.postMessage({'MessageType':'data','Data':this.fullDS, 'Columns':this.virtualColumns})

        this.ww_sortWorker = new sortWorkerSetup(sortWorker)
        this.ww_sortWorker.addEventListener('message',event => {this.handleMessage(event)})
        this.ww_sortWorker.postMessage({'MessageType':'data','Data':this.fullDS, 'Columns':this.virtualColumns})


  },
  beforeDestroy(){
    window.removeEventListener('resize',this.handleResizeGrid)
  }
};
</script>
<style >
        .pointer {
            cursor: pointer;
        }
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
        .tooltip {
        position: relative;
        display: inline-block;
        }

        .tooltip .tooltiptext {
        visibility: hidden;
        width: 250px;
        background-color: #e3e4e8;
        text-align: center;
        border-radius: 6px;
        padding: 5px 0;

        /* Position the tooltip */
        position: absolute;
        z-index: 1;
        top: 30px;
        left:30px;
        
        }
        .tooltip:hover .tooltiptext {
        visibility: visible;
        }
        .eye{
            display:flex;
            flex-direction: row;
            align-items: flex-end;
            height:20px
        }

</style>
