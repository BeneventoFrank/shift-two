<template>
<div :style="`position:relative; display:flex; min-width:${gridSettings.size.GridWidth}; height:${gridSettings.size.GridHeight}; flex-direction:column; align-items:center;`">
    <div :style="`position:absolute; width:${gridSettings.size.GridWidth}; height:${gridSettings.size.gridHeight};display: flex; flex-direction: column; align-items: center; `">
        <div ref='grid' :style="`height:${gridSettings.size.GridHeight}; width:${gridSettings.size.GridWidth};`" >
            <div ref='gridHeader' id='gridHeader'>
                <div ref="pagination" :style="`display:flex; flex-direction:row; width:${gridSettings.size.GridWidth}; justify-content:center; align-items:flex-end; flex-wrap:wrap; padding-bottom:12px;`">
                    <div :style="`width:50%; min-width:300px; display:flex; flex-direction:row; align-items:center;`">
                        <div v-show="gridSettings.slider.Enabled" :style="`width:300px; display:flex; flex-direction:row; justify-content:${gridSettings.size.GridWidthValue>=600?'flex-end':'center'};`">
                            <Slider @change="handleChangeNumberPerPage" 
                                    :width="gridSettings.slider.SliderWidth"
                                    :minValue="gridSettings.slider.MinValue"
                                    :maxValue="gridSettings.slider.MaxValue"
                                    :stepValue="gridSettings.slider.StepValue"
                                    :initialValue="gridSettings.slider.InitialValue"
                                    :colorScheme="gridSettings.colorScheme"
                            ></Slider>
                        </div>
                    </div>
                    <div v-show="gridSettings.pagination.Enabled" :style="`width:50%; min-width:300px; display:flex; flex-direction:row; align-items:flex-end; margin-top:${gridSettings.size.GridWidthValue>=600?0:20}px; justify-content:${gridSettings.size.GridWidthValue>=600?'flex-end':'center'};`" class='pagination'>
                        <Pagination 
                            :cmpCanPagePrevious="cmpCanPagePrevious"
                            :cmpCanPageNext="cmpCanPageNext"
                            :pagination="gridSettings.pagination"
                            @pageDataForward="handleNextClick"
                            @pageDataBackwards="handlePreviousClick"
                            :colorScheme="gridSettings.colorScheme"
                        ></Pagination>
                    </div>
                </div>
                <div style='display:flex; flex-direction:row;'>
                    <div style="width:30%; display:flex; justify-content:flex-start;">
                        <template v-if="gridSettings.slots.LeftSideOfTitle">
                            <component :is="components[gridSettings.slots.LeftSideOfTitle]" :params="{returnToRow:{page:gridSettings.pagination.MaxPageNumberPossible,rowIndex:settings.amount}, ...gridApi}" ></component>
                        </template>
                        <div style="margin-left:30px;" @mouseenter="handleShowCancelEye" class='pointer eye'  v-show="!isHovering&&(filterStrategy.isCurrentlyFiltering||sortStrategy.isCurrentlySorting)"><Eye :color="gridSettings.colorScheme.ActiveIndicatorColor" :height='25'/></div>
                        <div style="margin-left:30px;" @mouseleave="handleShowCancelEye" @click="handleClearAllFilters" class='pointer tooltip eye' v-show="isHovering" ><CancelEye :height='25' /></div>
                    </div>
                    <div ref="title" style="width:40%;"><span class='title' :style="`color:${gridSettings.colorScheme.GridTitleColor}`" v-if="gridSettings.title.Enabled" >{{gridSettings.title.Text}}</span></div>
                    <div style="width:30%;display:flex; justify-content:flex-end;">
                        <template v-if="gridSettings.slots.RightSideOfTitle">
                            <component :is="components[gridSettings.slots.RightSideOfTitle]" :params="{...gridApi}" ></component>
                        </template>
                    </div>
                </div>
                <div ref="headerRow" v-if="gridSettings.header.Enabled" :style="`width:100%;`">
                <HeaderRow 
                                @columnSort="handleColumnSort" 
                                @filterClosed="handleFilterClosed" 
                                @filterApplied="handleApplyFilter" 
                                @filterCleared="handleClearFilter"
                                :gridWillScroll="boolGridWillScroll" 
                                :currentSort="sortStrategy" 
                                :isDoneFiltering="isDoneFiltering"
                                :isDoneSorting="isDoneSorting" 
                                :currentFilters="filterStrategy" 
                                :clearAllFilters="clearAllFilters"
                                :gridSettings="gridSettings">
                </HeaderRow>
                </div>
            </div>
            
            <div class='fade-in' v-show="gridLoaded" id='viewport' @scroll='runScroller' :ref="`viewportElement`" :style="`height:${viewportHeight}px; overflow-y:auto  ; overflow-x:hidden; scroll-behavior:smooth;`">
                <div :style="`display:flex; flex-direction:column;`">

                    <div :style="`height:${topPaddingHeight}px; `"></div>
                    <div class='item'
                        @mouseleave="()=>{hoverIndex=null}" 
                        @mouseenter="()=>{hoverIndex=item.rowIndex}"     
                        :style="`height:32px; display:flex;  
                                    background-color:${
                                        gridSettings.rows.HighlightRowEnabled&&item.rowIndex===hoverIndex?
                                                    gridSettings.colorScheme.RowHighlightBackground:
                                                            item.rowRules&&item.rowRules.backgroundColor?item.rowRules.backgroundColor: //this should be using row rules object
                                                                    item.rowIndex%2===0?
                                                                            gridSettings.colorScheme.GridRowEvenBackgroundColor:    
                                                                                    gridSettings.colorScheme.GridRowOddBackgroundColor} ;
                        `"
                        :class="`row`" 
                        v-for="(item) in data" :key="item.rowIndex">
                        <div @click="()=>{gridSettings.columns[index].CellClicked={clicked:true,rowIndex:item.rowIndex}}"
                            @mouseleave="()=>{cellHoverIndex=null}" 
                            @mouseenter="()=>{cellHoverIndex=index}"
                            v-for="(col,index) in item.data" :key="index"
                            :style="`display:flex; align-items:center; height:100%;
                                        width:${gridSettings.columns[index].Width};
                                        justify-content:${gridSettings.columns[index].Alignment};
                                        background-color: ${gridSettings.rows.HighlightRowEnabled?item.rowIndex===hoverIndex&&index===cellHoverIndex?gridSettings.colorScheme.RowHighlightActiveCell:index===cellHoverIndex?gridSettings.colorScheme.RowHighlightBackground:'':''};
                                        cursor:${gridSettings.columns[index].OnCellClick?'zoom-in':'arrow'}
                                        
                                `">
                            <template v-if="gridSettings.columns[index].IsUsingCustomComponent">
                                <component :is="components[gridSettings.columns[index].CustomComponentName]" :params="{returnToRow:{page:gridSettings.pagination.PageNumberCurrentlyViewing,rowIndex:item.rowIndex}, ...item, ...gridApi}" ></component>
                            </template>
                            <template v-else>
                                
                                <span 
                                    :style="`text-overflow:ellipsis; overflow:hidden; white-space:nowrap; display:block;  
                                            color:${item.rowRules.textColor?item.rowRules.textColor:'black'};
                                            vertical-align:center;
                                            font-size:14px;
                                            width:${gridSettings.columns[index].WidthValue-3}px;    

                                            `" 
                                    > {{item.rowIndex+1+ ' ' +col}}</span>
                            </template>    
                            <div @mouseleave="()=>{gridSettings.columns[index].CellClicked.clicked=false}" :style="`position:absolute; top:${item.viewPortRowId*settings.itemHeight}px; z-index:8888;`" v-show="(gridSettings.columns[index].CellClicked.clicked===true) && (item.rowIndex === gridSettings.columns[index].CellClicked.rowIndex)">
                                <component :is="components[gridSettings.columns[index].OnCellClick]" :params="{UserInteractingWithComponent:gridSettings.columns[index].CellClicked.clicked, columnBeingEdited:index, ...item, ...gridApi}" ></component>
                            </div>
                        </div>
                    </div>
                    <div :style="`height:${bottomPaddingHeight}px;`"></div>
                </div>
            </div>
            <div v-show="!gridSettings.developmentMode.Enabled&&gridLoaded===false" style="display:flex; flex-direction:column; justify-content:center; align-items:center;">
                <span style="margin-top:100px;">{{loadingMsg}}</span>
                <br>
                <img  src='./images/loader.gif' style='height:auto; width:100px;'>
            </div>
        </div>
    </div>
    <div v-if="gridSettings.developmentMode.Enabled" style="display:flex; flex-direction:row; box-shadow: 0px 0px 27px -13px black; min-width:600px; position:absolute; z-index:10000; margin-top:270px; justify-content:center; ">
        <DeveloperMode 
                @gridUpdate="processGridUpdate"
                :gridSettings="gridSettings"
                :activeColorScheme="activeColorScheme"
                :activeColumnEdit="activeColumnEdit"
                :fullDS="fullDS"
                :componentList="componentList"
            />
    </div>
</div>
</template>
<script>
import DeveloperMode from './components/DeveloperMode'
import HeaderRow from './components/HeaderRow'
import ShiftSettings from '../settings/shift-two-grid-defaults'
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
import generateData from '../data/dataGenerator'

export default {
    name:"EditableDataGrid",
    components: {
        HeaderRow,
        Slider,
        Pagination,
        Eye,
        CancelEye,
        DeveloperMode
    },
    data() {
        return {
            loadingMsg:'Populating Grid Data..',
            gridLoaded:false,
            workingDataSet:[],
            data:[],
            viewportHeight:0,
            totalHeight:0,
            toleranceHeight:0,
            bufferHeight:0,
            bufferedItems:0,
            itemsAbove:0,
            topPaddingHeight:0,
            bottomPaddingHeight:0,
            settings:{
                minIndex: 0,
                maxIndex: 0,
                startIndex: 0,
                itemHeight: 26, //min seems to be 26 or it puts a scrollbar
                amount: 0, //number of items in the viewport
                tolerance: 2 //outlet size - rendered but not visible
            },
            initialState:{

            },
            tableTop:0,
            showWidthError:false,
            availableForCustomizing:0,
            hoverIndex:null,
            cellHoverIndex:null,
            activeColorScheme:{
                sliderFillColor:'',
                pagingTextColor:'',
                gridTitleColor:'',
                gridHeaderTextColor:'',
                gridRowTextColor:'',
                gridHeaderBackgroundColor:'',
                gridRowOddBackgroundColor:'',
                gridRowEvenBackgroundColor:'',
                activeIndicatorColor:'',
                gridHeaderBorderColor:'',
                flyoutBackgroundColor:'',
                flyoutTextColor:'',
                rowHighlightBackground:'',
                rowHighlightActiveCell:''
            },
            devModeWidthValue:0,
            devModeHeightValue:0,
            activeColumnEdit:{
                ColumnHeader:'',
                Index:0,
                Width:'',
                WidthValue:0,
                Alignment:'',
                DataType:'',
                IsUsingACustomWidth:false,
                IsPreSortEnabled:false,
                ChkAuto:true,
                IsUsingCustomComponent:false,
                CustomComponentName:'',
                OnCellClick:'',
                CellClicked:false

            },
            headerHeight:0, //calculated total of the header use to dictate the height of datarow.
            fullDS:[],
            weAreUsingTheSlider:false,
            sliderCount:false,
            sortedData:{},
            isDonePreSorting:false,
            filterCount:0,
            scrollCount:0,
            tmpResults:[],
            boolGridWillScroll:false,
            tmpResultsSort:{},
            highestCountLoaded:0,
            numberOfTerminatedFilters:0,
            numberOfTerminatedSorts:0,
            dataSlice:[],
            isHovering:false,
            isHoverOverCell:true,
            rowCurrentlyHoveringOver:null,
            cellCurrentlyHoveringOver:null,
            clearAllFilters:false,
            curentlyHovering:0,
            filteredData:[],
            userHasHeaders:false,
            isDoneFiltering:true,
            isDoneSorting:true,
            sortStrategy:{
                isCurrentlySorting:false,
                strategy:'',
                direction:'',
                columnBeingSorted:null
            },
            filterStrategy:{
                isCurrentlyFiltering:false,
                filters:[],
                columnsBeingFiltered:[]
            },
            ww_forwardWorker1:null,
            ww_reverseWorker1:null,
            ww_forwardWorker2:null,
            ww_reverseWorker2:null,
            ww_evenSortWorker:null,
            ww_oddSortWorker:null,
            gridSettings:{
                developmentMode:{
                },
                column:{
                },
                rows:{
                },
                size:{
                },
                colorScheme:{
                },
                title:{
                },
                header:{
                },
                slider:{
                },
                pagination:{
                },
                slots:{
                },
                events:{
                }
            },
            components:{},
            rowRulesObj:{},
            gridApi:{},
            currentColor:'',
            hasAlredyProcessed:false,
            dataPages:{},
            verifiedNavigateToRow:0
            
        };
    },
    computed: {
        cmpCanPagePrevious:function(){
            return this.gridSettings.pagination.MinRecordsViewable<2?false:true
        },
        cmpCanPageNext:function(){
            return (this.gridSettings.pagination.MaxPageNumberPossible>1?true:false)&&(this.gridSettings.pagination.PageNumberCurrentlyViewing<this.gridSettings.pagination.MaxPageNumberPossible)
        },
        cmpDataSet:function(){
            if(this.filterStrategy.isCurrentlyFiltering||this.sortStrategy.isCurrentlySorting) return this.workingDataSet
            return this.fullDS
        }
    },
    watch:{
        isDonePreSorting: function(val){
            this.gridLoaded = val
        }
    },
    methods: {
///////Processors////////    
        processConfig(){
            let tmp = {}
            if (Object.keys(this.gridConfig).length>0) {
                //then we have a config object to process.
                tmp = {...this.gridConfig}
            } else {
                //here b/c we have no config object so we need to load all Shift Defaults into the grid settings object.
                tmp = {...ShiftSettings}
            }
            return tmp
        },
        processData(isDevMode){
            let tmp = []
            if (this.gridData.length>0) {
                //load the data from the prop
                tmp = this.generateRows(this.gridData)
            } else {
                //load some random data.
                tmp = this.generateRows(generateData(this.gridSettings.columns.length))
            }   
            if(isDevMode){
                return tmp.splice(1,2)
            }
            console.log(tmp)
            return tmp
        },
        processGridUpdate(eventData){
            this.gridSettings = eventData.gridSettings;
            this.activeColorScheme = eventData.activeColorScheme;
            this.activeColumnEdit = eventData.activeColumnEdit;
            this.fullDS = eventData.fullDS
            this.data = eventData.fullDS
        },
        processComponents(){
            if (this.componentList.length<1) {return}
            for (let i = 0; i < this.componentList.length; i++) {
                this.components[this.componentList[i].name] = this.componentList[i]
            }
        },
        processRowRules(){
            if (Object.keys(this.rowRules)>0) {return}
            for (let i = 0; i < this.rowRules.length; i++) {
                this.rowRulesObj[this.rowRules[i].columnToCompare] = {}
                this.rowRulesObj[this.rowRules[i].columnToCompare].compareFunction = this.rowRules[i].compareFunction,
                this.rowRulesObj[this.rowRules[i].columnToCompare].stylesToApply= {backgroundColor:this.rowRules[i].stylesToApply.backgroundColor, textColor:this.rowRules[i].stylesToApply.textColor }
            }
        },
        processDataIntoPages(){
            let dataPages = {}
            let counter = 1;
            let rowCounter = 0;
            dataPages[counter]={
                startIndex:0
            }
            let maxPerPage = this.gridSettings.pagination.NumberOfApplicibleRowsPerPage
            
            for (let i = 0; i < this.cmpDataSet.length; i++) {
                if(rowCounter===maxPerPage){
                    rowCounter=-1;
                    dataPages[counter].endIndex=i;
                    counter++;
                    if(i < this.cmpDataSet.length-1){
                        dataPages[counter]={
                            startIndex:i+1
                        }
                    }
                } 
                rowCounter++;

            } 
            dataPages[counter].endIndex=this.cmpDataSet.length;
            return dataPages           
        },
///////End Processors////////    

///////Helper Functions////////
        verifyNavigateToRow(){
            const nav30 = this.navigateToRow-1 
            return nav30&&nav30>=0&&nav30<=this.fullDS.length?nav30:0
        },
        navigateDataToRow(rowIndex){
            //we need to call the paging with the row number
            this.pageDataForward(false,rowIndex)
            this.setGridState(this.gridSettings.pagination.MinRecordsViewable, this.gridSettings.pagination.MaxRecordsViewable)
            this.runScroller({target:{scrollTop:0}},null,rowIndex) 
        },
        applyRowRules(data){
            let rows = []

            for (let i = 0; i < data.length; i++) {
                rows[i] = {
                    data: data[i].data,
                    rowIndex: i,
                    rowRules: {}
                }
                for (let j = 0; j < data[i].data.length; j++) {
                    
                    if (this.rowRulesObj[j]&&this.rowRulesObj[j].compareFunction(data[i].data[j])) {
                        console.log('found one')
                        rows[i].rowRules.textColor=this.rowRulesObj[j].stylesToApply.textColor
                        rows[i].rowRules.backgroundColor=this.rowRulesObj[j].stylesToApply.backgroundColor
                        break;
                    }
                }
            }
            return rows
        },
        generateRows(data){
            //process the dataset applying rules and building out a row
            return this.applyRowRules(data)    
        },
        cmpItemData(itemData){
            if(!this.hasAlredyProcessed){
                this.preProcessData(itemData)
                this.hasAlredyProcessed = true        
            }
            return itemData
        },
        scrollToNewRow(){
            this.pageDataForward(false)
            const max = this.gridSettings.pagination.MaxRecordsViewable
            const min = this.gridSettings.pagination.MinRecordsViewable
            this.setGridState(min, max)            
            this.runScroller({target:{scrollTop:0}},true)   
        },
        addNewRow(data){
            this.fullDS = [...this.fullDS, {
                data:data,
                rowIndex:this.fullDS.length
            }]
            this.gridSettings.pagination.TotalNumberOfRecords = this.gridSettings.pagination.TotalNumberOfRecords+1
            this.configureWebWorkers(this.cmpDataSet)
            this.headerHeight = this.calculateHeightOfHeaderRow()
            this.boolGridWillScroll = this.gridWillScroll(this.headerHeight)
            const rows = this.getRowsPerPage()
            this.initializeSlider(rows) //init before paging b/c paging uses the slider values
            this.initializePaging(rows)            
            this.settings.maxIndex = this.gridSettings.pagination.Enabled?rows:this.cmpDataSet.length
            this.settings.amount = this.calculateNumRows()
            const max = this.gridSettings.pagination.MaxRecordsViewable
            const min = this.gridSettings.pagination.MinRecordsViewable
            this.setGridState(min, max)
            this.setInitialState(this.settings.minIndex,this.settings.maxIndex,this.settings.startIndex,this.settings.itemHeight,this.settings.amount,this.settings.tolerance)
            this.runScroller({target:{scrollTop:0}})   
        },
        refreshRow(rowId,data){
            this.fullDS[rowId].data=data
            this.runScroller({target:{scrollTop:0}})
        },
        refreshGrid(){
            //not sure... somehow update the grid as a whole
        },
        deleteRow(rowId){
            let tmp = []
            for (let i = 0; i < this.fullDS.length; i++) {
                if(i!==rowId)
                {
                    tmp.push(this.fullDS[i])
                }
            }
            this.fullDS = tmp
            this.runScroller({target:{scrollTop:0}})
        },
        getRowsPerPage(){
            if (this.gridSettings.pagination.Enabled) {
                if (this.weAreUsingTheSlider) {
                    return this.sliderCount
                } else {
                    if((this.cmpDataSet.length>=0)&&(this.cmpDataSet.length<=100)){
                        return 100
                    } else if((this.cmpDataSet.length>100)&&(this.cmpDataSet.length<=1000)){
                        return 500
                    } else if(this.cmpDataSet.length>1000){
                        return 1000
                    }
                }                
            } 
            return this.cmpDataSet.length
        },        
        gridWillScroll(headerHeight){
            if(this.gridSettings.developmentMode.Enabled){return} 
            let retVal = false
            if ((this.cmpDataSet.length*this.settings.itemHeight)+(headerHeight)>this.gridSettings.size.GridHeightValue)
            {
                retVal=true
            }
            return retVal
        
        },
        calculateColumnWidths(){
            let tmp = 0
            const numCols = this.gridSettings.columns.length
            let custCols = [] 
            for (let i = 0; i < numCols; i++) {
                if (this.gridSettings.columns[i].IsUsingACustomWidth) {
                    custCols.push(i)
                    tmp += this.boolGridWillScroll?this.gridSettings.columns[i].WidthValue+1.61:this.gridSettings.columns[i].WidthValue
                }
            }
           const numColumns = numCols-custCols.length
           let widthOfGrid = this.gridSettings.size.GridWidthValue - tmp
           let eachColumn = Math.floor(widthOfGrid/numColumns)
           if(!this.boolGridWillScroll){
               eachColumn+=.5
           }
           
            for (let i = 0; i < numCols; i++) {
                if (!custCols.includes(i)) {
                    this.gridSettings.columns[i].Width = `${eachColumn}px `
                    this.gridSettings.columns[i].WidthValue = eachColumn
                }
            }
        },
        initializePaging(numberOfRowsPerPage){
            if(this.gridSettings.pagination.Enabled===true){
                this.gridSettings.pagination = {
                Enabled:true,
                MinRecordsViewable:1,
                MaxRecordsViewable:this.cmpDataSet.length>this.gridSettings.slider.InitialValue?this.gridSettings.slider.InitialValue:this.cmpDataSet.length,
                TotalNumberOfRecords:this.cmpDataSet.length,
                PageNumberCurrentlyViewing:1,                   
                MaxPageNumberPossible:Math.ceil(this.cmpDataSet.length/this.gridSettings.slider.InitialValue),
                NumberOfApplicibleRowsPerPage:numberOfRowsPerPage,
                }
            } else {
                this.gridSettings.pagination = {
                Enabled:false,
                MinRecordsViewable:1,
                MaxRecordsViewable:this.cmpDataSet.length,
                TotalNumberOfRecords:this.cmpDataSet.length,
                PageNumberCurrentlyViewing:1,                   
                MaxPageNumberPossible:1,
                NumberOfApplicibleRowsPerPage:this.cmpDataSet.length
                }                
            } 
        },
        initializeSlider(numberOfRowsPerPage){
            if (this.gridSettings.slider.Enabled) {
                let minValue, maxValue, stepValue, initialValue,sliderWidth = 0
                if(numberOfRowsPerPage===100){
                    minValue=10, maxValue=100, stepValue=10, initialValue=100,sliderWidth = 300    
                } else if(numberOfRowsPerPage===500){
                    minValue=100, maxValue=1000, stepValue=100, initialValue=500,sliderWidth = 300    
                } else if(numberOfRowsPerPage===1000){
                    minValue=500, maxValue=4000, stepValue=500, initialValue=1000,sliderWidth = 300    
                }                    
                this.gridSettings.slider.MinValue = minValue;
                this.gridSettings.slider.MaxValue = maxValue;
                this.gridSettings.slider.StepValue = stepValue;
                this.gridSettings.slider.InitialValue = initialValue;
                this.gridSettings.slider.SliderWidth = sliderWidth;
            }
        },
        calculateHeightOfHeaderRow(){
            let tmp=0;
            const height = this.gridSettings.size.GridWidthValue<600?91:51; //TODO document these numbers
            tmp=this.gridSettings.header.Enabled?tmp+51:tmp+0
            tmp=this.gridSettings.pagination.Enabled?tmp+height:tmp+0
            tmp=this.gridSettings.title.Text.length>0?tmp+28:tmp+0
            return tmp
        },        
        calculateNumRows(){
            return this.boolGridWillScroll?Math.floor((this.gridSettings.size.GridHeightValue - this.headerHeight)/this.settings.itemHeight):this.cmpDataSet.length 
        },
        setInitialState(minIndex, maxIndex, startIndex, itemHeight, amount, tolerance){
            // 1) height of the visible part of the viewport (px)
            this.viewportHeight = amount * itemHeight
            // 2) total height of rendered and virtualized items (px)
            this.totalHeight = (maxIndex - minIndex ) * itemHeight
            // 3) single viewport outlet height, filled with rendered but invisible rows (px)
            this.toleranceHeight = tolerance * itemHeight
            // 4) all rendered rows height, visible part + invisible outlets (px)
            this.bufferHeight = this.viewportHeight + 2 * this.toleranceHeight
            // 5) number of items to be rendered, buffered dataset length (pcs)
            this.bufferedItems =Math.floor(this.boolGridWillScroll?amount + 2 * tolerance:amount)
            // 6) how many items will be virtualized above (pcs)
            this.itemsAbove = startIndex - tolerance - minIndex
            // initial state object
            this.data = []
        },
        runScroller({target:{scrollTop}},scrollToBottom,scrollToRow){
            let index
            let data 
            let topPad
            if (scrollToRow){
                index = this.gridSettings.pagination.MinRecordsViewable
                data = this.getData(index, this.bufferedItems) 
                topPad = Math.ceil((scrollToRow-index) * this.settings.itemHeight)
                const topPaddingHeight = this.boolGridWillScroll?topPad:0
                const bottomPad = Math.max(this.totalHeight - topPaddingHeight - (data.length * this.settings.itemHeight), 0)
                this.bottomPaddingHeight= this.boolGridWillScroll?bottomPad:0
                this.topPaddingHeight = topPaddingHeight

            } else {
                if(this.gridSettings.pagination.Enabled){
                    index = Math.max(this.settings.minIndex + Math.floor((scrollTop -1) / this.settings.itemHeight),0)
                } else {
                    index = Math.max(this.settings.minIndex + Math.floor((scrollTop - this.toleranceHeight) / this.settings.itemHeight),0)
                }

                topPad = Math.max((index - this.settings.minIndex) * this.settings.itemHeight, 0)
                data = this.getData(index, this.bufferedItems)
                const topPaddingHeight = this.boolGridWillScroll?topPad:0
                const bottomPad = Math.max(this.totalHeight - topPaddingHeight - (data.length * this.settings.itemHeight), 0)
                this.bottomPaddingHeight= this.boolGridWillScroll?bottomPad:0
                this.topPaddingHeight = topPaddingHeight
                if(scrollToBottom){
                    this.$refs.viewportElement.scrollTop = this.$refs.viewportElement.scrollHeight
                    // this.topPaddingHeight = this.bottomPaddingHeight
                    // this.bottomPaddingHeight = 0
                }
            }
            this.data = data
        },
        configureFilterWorkers(dataSet){
            let tmpFor1 = []
            let tmpFor2 = []
            let tmpRev1 = []
            let tmpRev2 = []
            let firstHalf = Math.ceil(Math.ceil(dataSet.length/2)/2)
            let counter = 0
            for (let i = 0; i < (Math.ceil(dataSet.length/2)); i++) {
                if(i<firstHalf){
                    tmpFor1.push(dataSet[i])
                }else{
                    tmpFor2.push(dataSet[i])
                }
            }
            for (let i = Math.ceil(dataSet.length/2); i < dataSet.length; i++) {
                counter++
                if(counter<=firstHalf){
                    tmpRev1.push(dataSet[i])
                }else{
                    tmpRev2.push(dataSet[i])
                }
            }
            this.ww_forwardWorker1 = new forwardWorkerSetup(forwardWorker)
            this.ww_forwardWorker1.addEventListener('message',event =>{this.handleMessage(event)})
            this.ww_forwardWorker1.postMessage({'MessageType':'data','Data':tmpFor1, 'Columns':this.gridSettings.columns})
            
            this.ww_forwardWorker2 = new forwardWorkerSetup(forwardWorker)
            this.ww_forwardWorker2.addEventListener('message',event =>{this.handleMessage(event)})
            this.ww_forwardWorker2.postMessage({'MessageType':'data','Data':tmpFor2, 'Columns':this.gridSettings.columns})

            this.ww_reverseWorker1 = new reverseWorkerSetup(reverseWorker)
            this.ww_reverseWorker1.addEventListener('message',event =>{this.handleMessage(event)})
            this.ww_reverseWorker1.postMessage({'MessageType':'data','Data':tmpRev1, 'Columns':this.gridSettings.columns})

            this.ww_reverseWorker2 = new reverseWorkerSetup(reverseWorker)
            this.ww_reverseWorker2.addEventListener('message',event =>{this.handleMessage(event)})
            this.ww_reverseWorker2.postMessage({'MessageType':'data','Data':tmpRev2, 'Columns':this.gridSettings.columns})    
        },
        configureWebWorkers(dataSet){
            this.configureFilterWorkers(dataSet)
            this.ww_evenSortWorker = new evenSortWorkerSetup(evenSortWorker)
            this.ww_evenSortWorker.addEventListener('message',event => {this.handleMessage(event)})
            this.ww_evenSortWorker.postMessage({'MessageType':'data','Data':dataSet, 'Columns':this.gridSettings.columns})

            this.ww_oddSortWorker = new oddSortWorkerSetup(oddSortWorker)
            this.ww_oddSortWorker.addEventListener('message',event => {this.handleMessage(event)})
            this.ww_oddSortWorker.postMessage({'MessageType':'data','Data':dataSet, 'Columns':this.gridSettings.columns})

            this.ww_sortWorker = new sortWorkerSetup(sortWorker)
            this.ww_sortWorker.addEventListener('message',event => {this.handleMessage(event)})
            this.ww_sortWorker.postMessage({'MessageType':'data','Data':dataSet, 'Columns':this.gridSettings.columns})
        },
        getData(offset, limit){
            const data = []
            const start = offset
            let end = Math.min(offset + limit, this.settings.maxIndex)
            let viewPortRowId = 1;
            if (start <= end) {
                for (let i = start; i < end; i++) {
                    if (this.cmpDataSet[i]){
                        data.push({ rowIndex: this.cmpDataSet[i].rowIndex, data: this.cmpDataSet[i].data, rowRules: this.cmpDataSet[i].rowRules, viewPortRowId:viewPortRowId})
                        viewPortRowId++
                    }
                }
            }
            return data
        },
        setGridState(min, max){
            this.settings.minIndex = min
            this.settings.maxIndex = max
            this.totalHeight = (this.settings.maxIndex - this.settings.minIndex ) * this.settings.itemHeight
        },
        handleNextClick(isASingleMove){
            this.pageDataForward(isASingleMove.isASinglePageMove)
            let max = 0
            const min = this.gridSettings.pagination.MinRecordsViewable
            if (isASingleMove.isASinglePageMove&&this.gridSettings.pagination.MaxPageNumberPossible!==this.gridSettings.pagination.PageNumberCurrentlyViewing) {
                max = this.gridSettings.pagination.MaxRecordsViewable
            } else {
                max = this.gridSettings.pagination.TotalNumberOfRecords  
            }
            this.setGridState(min, max)
            this.resetScroll()
            this.runScroller({target:{scrollTop:0}}) 
        },
        pageDataForward(isASinglePageMove, verifiedNavigateToRow){
            let paging = {
                Enabled:this.gridSettings.pagination.Enabled,
                TotalNumberOfRecords:this.gridSettings.pagination.TotalNumberOfRecords,
                CurrentTake:this.gridSettings.pagination.NumberOfApplicibleRowsPerPage,
                NumberOfApplicibleRowsPerPage:this.gridSettings.pagination.NumberOfApplicibleRowsPerPage,
            }
            
            if(isASinglePageMove){
                const tmpMinViewable = this.gridSettings.pagination.MinRecordsViewable===1?this.gridSettings.pagination.NumberOfApplicibleRowsPerPage:this.gridSettings.pagination.MinRecordsViewable+this.gridSettings.pagination.NumberOfApplicibleRowsPerPage
                paging.MinRecordsViewable=tmpMinViewable
                paging.MaxRecordsViewable=tmpMinViewable+this.gridSettings.pagination.NumberOfApplicibleRowsPerPage>this.gridSettings.pagination.TotalNumberOfRecords?this.gridSettings.pagination.TotalNumberOfRecords:tmpMinViewable+this.gridSettings.pagination.NumberOfApplicibleRowsPerPage
                paging.PageNumberCurrentlyViewing=this.gridSettings.pagination.PageNumberCurrentlyViewing+1        
                paging.MaxPageNumberPossible=this.gridSettings.pagination.MaxPageNumberPossible

            } else {
                if(verifiedNavigateToRow){
                    for (let i = 1; i < Object.keys(this.dataPages).length; i++) {
                        if(verifiedNavigateToRow >=this.dataPages[i].startIndex && verifiedNavigateToRow <=this.dataPages[i].endIndex){
                            paging.MinRecordsViewable=this.dataPages[i].startIndex
                            paging.MaxRecordsViewable=this.dataPages[i].endIndex
                            paging.PageNumberCurrentlyViewing=i        
                            paging.MaxPageNumberPossible=Object.keys(this.dataPages).length
                            break;
                        }
                    }
                } else {
                    const numberOfRowsPagingCanHandle = this.gridSettings.pagination.MaxPageNumberPossible * this.gridSettings.pagination.NumberOfApplicibleRowsPerPage
                    const startValue = numberOfRowsPagingCanHandle-this.gridSettings.pagination.NumberOfApplicibleRowsPerPage
                    paging.MinRecordsViewable=startValue
                    paging.MaxRecordsViewable=this.gridSettings.pagination.TotalNumberOfRecords
                    paging.PageNumberCurrentlyViewing=this.gridSettings.pagination.MaxPageNumberPossible        
                    paging.MaxPageNumberPossible=this.gridSettings.pagination.MaxPageNumberPossible
                }

            }
            this.gridSettings.pagination = paging
        },
        handlePreviousClick(isASingleMove){
            this.pageDataBackward(isASingleMove.isASinglePageMove)
            const min = (this.gridSettings.pagination.PageNumberCurrentlyViewing*this.gridSettings.pagination.NumberOfApplicibleRowsPerPage)-this.gridSettings.pagination.NumberOfApplicibleRowsPerPage
            const max = ((this.gridSettings.pagination.PageNumberCurrentlyViewing+1)*this.gridSettings.pagination.NumberOfApplicibleRowsPerPage)-(this.gridSettings.pagination.NumberOfApplicibleRowsPerPage)
            this.setGridState(min,max)
            this.resetScroll()
            this.runScroller({target:{scrollTop:0}})   
        },
        pageDataBackward(isASinglePageMove){
            let paging ={
                Enabled:this.gridSettings.pagination.Enabled,
                NumberOfApplicibleRowsPerPage:this.gridSettings.pagination.NumberOfApplicibleRowsPerPage,
                TotalNumberOfRecords:this.gridSettings.pagination.TotalNumberOfRecords,
            }
            if(isASinglePageMove){
                    const minRecordsMath = ((this.gridSettings.pagination.PageNumberCurrentlyViewing-1)*this.gridSettings.pagination.NumberOfApplicibleRowsPerPage)-this.gridSettings.pagination.NumberOfApplicibleRowsPerPage<=0?1:((this.gridSettings.pagination.PageNumberCurrentlyViewing-1)*this.gridSettings.pagination.NumberOfApplicibleRowsPerPage)-this.gridSettings.pagination.NumberOfApplicibleRowsPerPage
                    paging.MinRecordsViewable = minRecordsMath
                    paging.MaxRecordsViewable = minRecordsMath+this.gridSettings.pagination.NumberOfApplicibleRowsPerPage
                    paging.PageNumberCurrentlyViewing=this.gridSettings.pagination.PageNumberCurrentlyViewing-1        
                    paging.MaxPageNumberPossible=this.gridSettings.pagination.MaxPageNumberPossible
            } else {
                    paging.MinRecordsViewable=1
                    paging.MaxRecordsViewable=this.gridSettings.pagination.NumberOfApplicibleRowsPerPage
                    paging.PageNumberCurrentlyViewing=1    
                    paging.MaxPageNumberPossible=Math.ceil(this.gridSettings.pagination.TotalNumberOfRecords/this.gridSettings.pagination.NumberOfApplicibleRowsPerPage)
            }
            this.gridSettings.pagination = paging
        },
        handleChangeNumberPerPage(event){
            const isTheLastPage = ()=>{
                return this.gridSettings.pagination.PageNumberCurrentlyViewing === this.gridSettings.pagination.MaxPageNumberPossible
            }

            if(this.gridSettings.developmentMode.Enabled){return} 
            this.weAreUsingTheSlider=true
            this.sliderCount = parseInt(event.target.value) //comes in from the control as a string
            this.reConfigurePagination(this.sliderCount);
            const min = this.gridSettings.pagination.MinRecordsViewable
            const max = isTheLastPage()?this.gridSettings.pagination.TotalNumberOfRecords:this.gridSettings.pagination.NumberOfApplicibleRowsPerPage
            this.setGridState(min,max)            
            this.runScroller({target:{scrollTop:0}})
            this.$refs.viewportElement.scrollTop = this.$refs.viewportElement.scrollTop-1

        },            
        reConfigurePagination(count){
            let paging = {
                Enabled:this.gridSettings.pagination.Enabled,
                MinRecordsViewable:1,
                MaxRecordsViewable:this.cmpDataSet.length<count?this.cmpDataSet.length:count,
                TotalNumberOfRecords:this.cmpDataSet.length,
                PageNumberCurrentlyViewing:1,        
                MaxPageNumberPossible:Math.ceil(this.cmpDataSet.length/count),
                NumberOfApplicibleRowsPerPage:count,
            }
            this.gridSettings.pagination = paging          
        },
        resetScroll(){
            this.$refs.viewportElement.scrollTop=0;
        },
        handleShowCancelEye(){
            this.isHovering = !this.isHovering
        },    
///////End Helper Functions////////    

///////Filter Code/////////
        handleApplyFilter(strategy){
            if(this.gridSettings.developmentMode.Enabled){return} 

            const addFilter = (col,filter) =>{ 
                this.filterStrategy.isCurrentlyFiltering = true
                this.filterStrategy.filters.push(`${col}^^${filter}`)
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
            if(this.filterStrategy.isCurrentlyFiltering){
                if(this.filterStrategy.columnsBeingFiltered.includes(col)){
                    updateFilter(col,filter)
                    this.isDoneFiltering=false
                    if(this.filterStrategy.columnsBeingFiltered.length>1){ /////////////////////todo refactor these ?
                        this.ww_forwardWorker1.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                        this.ww_forwardWorker2.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                        this.ww_reverseWorker1.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                        this.ww_reverseWorker2.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                    } 
                    if(this.filterStrategy.columnsBeingFiltered.length===1){ 
                        this.ww_forwardWorker1.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':false})  
                        this.ww_forwardWorker2.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':false})  
                        this.ww_reverseWorker1.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':false}) 
                        this.ww_reverseWorker2.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':false}) 
                    }
                } else {
                    addFilter(col,filter)
                    this.isDoneFiltering=false
                    this.ww_forwardWorker1.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':true})  
                    this.ww_forwardWorker2.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':true})  
                    this.ww_reverseWorker1.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':true}) 
                    this.ww_reverseWorker2.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':true}) 
                }
            } else {
                //then we are adding the only filter
                addFilter(col,filter)
                this.isDoneFiltering=false
                this.ww_forwardWorker1.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':false})  
                this.ww_forwardWorker2.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':false})  
                this.ww_reverseWorker1.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':false}) 
                this.ww_reverseWorker2.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':false}) 
            }
        },
        clearFilters(){
            this.filterStrategy = {isCurrentlyFiltering:false, filters:[], columnsBeingFiltered:[]}
        },
        handleClearFilter(columnIndex){
            if(this.gridSettings.developmentMode.Enabled||!this.filterStrategy.isCurrentlyFiltering){return} 
            const clearAFilter= (col)=>{
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
            }
            if(this.filterStrategy.columnsBeingFiltered.length===1&&this.filterStrategy.columnsBeingFiltered[0] === columnIndex.toString()){
                this.clearFilters() //will reset the filter object completely
                const min = this.gridSettings.pagination.MinRecordsViewable
                const max = this.cmpDataSet.length>this.sliderCount?this.sliderCount:this.cmpDataSet.length
                this.setGridState(min,max)
                this.runScroller({target:{scrollTop:0}})
                this.resetScroll();
            } else {
                //then clear a filter was called on a column but other filters are applied. 
                clearAFilter(columnIndex)
                this.ww_forwardWorker1.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                this.ww_forwardWorker2.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                this.ww_reverseWorker1.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                this.ww_reverseWorker2.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
            }

            if(this.sortStrategy.isCurrentlySorting===true){
                this.ww_sortWorker.postMessage({'MessageType':'applySort', 'SortStrategy':this.sortStrategy.strategy})
            } 
            this.reConfigurePagination(this.sliderCount)               
        },
        handleClearAllFilters(){
            this.sortStrategy = { //todo. refactor this into a function 
                isCurrentlySorting:false,
                strategy:'',
                columnBeingSorted:''
            }
            this.clearFilters();
            this.clearAllFilters = true //TODO. follow this down and see if its needed
            const min = this.gridSettings.pagination.MinRecordsViewable
            const max = this.cmpDataSet.length>this.sliderCount?this.sliderCount:this.cmpDataSet.length
            this.reConfigurePagination(max)                    
            this.setGridState(min,max)
            this.runScroller({target:{scrollTop:0}})
            this.resetScroll();            
        },
        handleFilterClosed(){
            if(this.gridSettings.developmentMode.Enabled){return} 
            this.filterCount = 0
        },
///////End Filter Code/////////

///////Worker Messaging Code/////////
        handleMessage(message){
            const setMinAndScroll = (count) => {
                this.reConfigurePagination(count)
                const min = this.gridSettings.pagination.MinRecordsViewable
                const max = this.gridSettings.pagination.MaxRecordsViewable
                this.setGridState(min,max)
                this.runScroller({target:{scrollTop:0}})
                this.resetScroll()
            }

            switch (message.data.MessageType) {
                case 'filterResults':
                case 'allFiltersApplied':   
                    this.tmpResults = [...this.tmpResults, ...message.data.Data]
                    break;
                case 'filterTerminated':
                    this.numberOfTerminatedFilters = this.numberOfTerminatedFilters +1                      
                    if(this.numberOfTerminatedFilters===4)    
                    {
                        this.filterStrategy.isCurrentlyFiltering=true

                        if(this.sortStrategy.isCurrentlySorting===true){
                            this.ww_sortWorker.postMessage({'MessageType':'sortFilteredData', 'SortStrategy':this.sortStrategy.strategy, 'Data': this.tmpResults})
                        } else {
                            this.workingDataSet = this.tmpResults
                            setMinAndScroll(this.cmpDataSet.length>this.sliderCount?this.sliderCount:this.cmpDataSet.length)
                        }
                        this.tmpResults = []
                        this.numberOfTerminatedFilters = 0
                        this.isDoneFiltering=true

                    }
                    break;
                case 'sortComplete': //normal sort route
                        this.workingDataSet = [...message.data.Data]
                        this.sortStrategy.strategy = message.data.Strategy
                        this.sortStrategy.isCurrentlySorting = true
                        this.reConfigurePagination(this.sliderCount) //I AM NOT SURE THIS SHOULD BE SLIDER COUNT?? WHY?
                        this.sortStrategy.columnBeingSorted = message.data.Column
                        this.setGridState(this.gridSettings.pagination.MinRecordsViewable,this.gridSettings.pagination.MaxRecordsViewable)
                        this.runScroller({target:{scrollTop:0}})
                        this.resetScroll()
                        this.isDoneSorting = true
                    break;
                case 'dataSorted'://this is only used by the pre-sorting code
                    this.tmpResultsSort= {...this.tmpResultsSort, ...message.data.Data}
                    break;
                case 'sortTerminated': //this is only used by the pre-sorting code
                    this.numberOfTerminatedSorts = this.numberOfTerminatedSorts +1                      
                    if(this.numberOfTerminatedSorts===2)    
                    {
                        this.sortedData = this.tmpResultsSort
                        this.isDonePreSorting = true
                        this.ww_oddSortWorker.terminate()
                        this.ww_evenSortWorker.terminate()
                        setTimeout(() => {
                            this.$refs.viewportElement.scrollTop += ((this.verifiedNavigateToRow - this.gridSettings.pagination.MinRecordsViewable)*this.settings.itemHeight)
                        }, 100);
                    }
                    break;
                default:
                    break;
            }
        },
///////End Worker Messaging Code/////////

///////Sorting Code/////////
        handleColumnSort(strategy){
            if(this.gridSettings.developmentMode.Enabled){return} 
            this.isDoneSorting = false
           
            if(strategy !== ''){
                    if(this.filterStrategy.isCurrentlyFiltering){
                        this.ww_sortWorker.postMessage({'MessageType':'sortFilteredData','SortStrategy':strategy, 'Data':this.cmpDataSet})
                    } else {
                        const split = strategy.split('^^')
                        const tmp = parseInt(split[0])
                        if(this.isDonePreSorting&&this.gridSettings.columns[tmp].IsPreSortEnabled)
                        {
                            this.sortStrategy = {}
                            this.sortStrategy.strategy = strategy
                            this.sortStrategy.isCurrentlySorting = true
                            this.sortStrategy.columnBeingSorted = tmp
                            this.workingDataSet = this.sortedData[tmp][split[1]]
                            const min = this.gridSettings.pagination.MinRecordsViewable;
                            const max = this.gridSettings.pagination.MaxRecordsViewable;
                            this.setGridState(min,max)
                            this.resetScroll()
                            this.runScroller({target:{scrollTop:0}})
                            this.isDoneSorting = true;
                        } else {
                            this.ww_sortWorker.postMessage({'MessageType':'applySort','SortStrategy':strategy})
                        }
                    }
            } else {
                this.clearSortStrategy()
                this.isDoneSorting = true;
                if(this.filterStrategy.isCurrentlyFiltering){
                    this.ww_forwardWorker1.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                    this.ww_forwardWorker2.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                    this.ww_reverseWorker1.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                    this.ww_reverseWorker2.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                } else {
                    const min = this.gridSettings.pagination.MinRecordsViewable;
                    const max = this.gridSettings.pagination.MaxRecordsViewable;
                    this.setGridState(min,max)
                    this.resetScroll()
                    this.runScroller({target:{scrollTop:0}})                    
                }
            }
        },
        clearSortStrategy(){
            this.sortStrategy={
                isCurrentlySorting:false,
                strategy:'',
                direction:'',
                columnBeingSorted:null
            }
        },
///////End Sorting Code/////////
    },
    props:{
        gridConfig:{
            type: Object,
            required: false,
            default: ()=>[]
        }, 
        gridData:{
            type:Array,
            required: false,
            default: ()=>[]
        },
        componentList:{
            type:Array,
            required: false,
            default: ()=>[]
        },
        rowRules:{
            type:Array,
            required:false,
            default:()=>[]
        },
        navigateToRow:{
            type:Number,
            required:false,
            default:null
        }

    },        
    async mounted(){
        setTimeout(() => {
            this.loadingMsg = 'Processing Filters And Sort..'
        }, 1000);
        this.headerHeight = this.calculateHeightOfHeaderRow()        
        this.boolGridWillScroll = this.gridWillScroll(this.headerHeight)
        this.calculateColumnWidths()
        const rows = this.getRowsPerPage()
        this.sliderCount = rows
        this.initializeSlider(rows) //init before paging b/c paging uses the slider values
        this.initializePaging(rows)
        setTimeout(() => {
            this.loadingMsg = 'Finishing Up, Just A Sec..'
        }, 2500);        
        this.settings.maxIndex = this.gridSettings.pagination.Enabled?rows:this.cmpDataSet.length
        
        this.settings.amount = this.calculateNumRows()
        this.setInitialState(this.settings.minIndex,this.settings.maxIndex,this.settings.startIndex,this.settings.itemHeight,this.settings.amount,this.settings.tolerance)
        this.dataPages = this.processDataIntoPages()
        if(this.verifiedNavigateToRow){
            this.navigateDataToRow(this.verifiedNavigateToRow)
        } else {
            this.runScroller({target:{scrollTop:0}})   
        }
    },
    created(){
        //we need to map the components to an object for easy use
        this.gridSettings = this.processConfig()
        this.fullDS = this.processData(this.gridSettings.developmentMode.Enabled)
        this.verifiedNavigateToRow = this.verifyNavigateToRow()
        this.configureWebWorkers(this.cmpDataSet)
        this.processComponents();
        this.processRowRules();
        console.log('this... ', this.rowRulesObj)
        this.gridApi.refreshRow = this.refreshRow
        this.gridApi.deleteRow = this.deleteRow
        this.gridApi.addNewRow = this.addNewRow
        this.gridApi.scrollToNewRow = this.scrollToNewRow

    }
};
</script>
<style >
        td {
            vertical-align: middle;
        }
        .pointer {
            cursor: pointer;
        }
        html {
        scroll-behavior: smooth;
        }
        .cell{
            width:20%;
        }
        .row{
            height:auto;
            max-height:25px;
        }
        .dataRow{
            width:100%; 
            display:flex; 
            flex-direction:row;
            scroll-behavior: smooth;
        }
        .title{
            font-size:24px;
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
            width: 200px;
            text-align: center;
            border-radius: 6px;
            padding: 5px 0;
            position: absolute;
            z-index: 1;
            top: 0px;
            left:50px;
        }
        .tooltip:hover .tooltiptext {
            visibility: visible;
        }
        .eye{
            display:flex;
            flex-direction: row;
            align-items: flex-end;
        }
        .configTool{
            max-height:0px;
            height:auto;
            overflow:hidden;
            max-height:30px;
            transition:max-height 1.5s;            
        }
        .animateConfigTool{
            max-height:380px;
        }
        .tab{
            justify-content: flex-start;
            align-items:center;
        }
        .tab :hover{
            transform: scale(1.1);
        }
        .colorPicker{
            border:none;
            cursor: pointer;
            height:30px; 
            background-color:transparent;
            width:30px;
            border-radius:5px;
            outline: none;
        }
        .smallerText{
            font-size: 12px;
        }
        .mediumText{
            font-size:14px
        }
        .item{
            
        }
        .fade-in {
        animation: fadeIn ease .5s;
        -webkit-animation: fadeIn ease .5s;
        -moz-animation: fadeIn ease .5s;
        -o-animation: fadeIn ease .5s;
        -ms-animation: fadeIn ease .5s;
        }
        @keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
        }

        @-moz-keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
        }

        @-webkit-keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
        }

        @-o-keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
        }

        @-ms-keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
        }
</style>
