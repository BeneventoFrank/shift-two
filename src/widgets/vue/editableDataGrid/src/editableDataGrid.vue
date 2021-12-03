<template>
<div :style="`position:relative; display:flex; min-width:${gridSettings.size.GridWidth};  flex-direction:column; align-items:center;`">
    <div :style="`position:absolute; width:${gridSettings.size.GridWidth}; display: flex; flex-direction: column; align-items: center; `">
        <div ref='grid' :style="` width:${gridSettings.size.GridWidth};`" >
            <div ref='gridHeader' id='gridHeader'>
                <div style='display:flex; flex-direction:row;'>
                    <div ref="title" style="width:100%;"><span class='title' :style="`color:${gridSettings.colorScheme.GridTitleColor}`" v-if="gridSettings.title.Enabled" >{{gridSettings.title.Text}}</span></div>
                </div>
                <div ref="headerRow" v-if="gridSettings.header.Enabled" :style="`width:100%;`">
                    <HeaderRow 
                                    :gridSettings="gridSettings">
                    </HeaderRow>
                </div>
            </div>
            
            <div class='fade-in' v-show="gridLoaded" id='viewport' :ref="`viewportElement`" :style="`overflow-y:auto  ; overflow-x:hidden; scroll-behavior:smooth;`">
                <div :style="`display:flex; flex-direction:column;`">

                    <div :style="`height:${topPaddingHeight}px; `"></div>
                    <div class='item'
                        @mouseleave="()=>{hoverIndex=null}" 
                        @mouseenter="()=>{hoverIndex=item.rowIndex}"     
                        :style="`height:32px; display:flex;  
                                    background-color:${
                                        gridSettings.rows.HighlightRowEnabled&&item.rowIndex===hoverIndex?
                                                    gridSettings.colorScheme.RowHighlightBackground:
                                                            item.rowRules&&item.rowRules.backgroundColor?item.rowRules.backgroundColor: 
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
                                        background-color: ${
                                                gridSettings.rows.HighlightRowEnabled?
                                                    item.rowIndex===hoverIndex&&index===cellHoverIndex?
                                                            gridSettings.colorScheme.RowHighlightActiveCell:
                                                                index===cellHoverIndex?
                                                                    gridSettings.colorScheme.RowHighlightBackground:''
                                                                        :''};
                                        cursor:${gridSettings.columns[index].OnCellClick?'zoom-in':'arrow'}
                                        
                                `">
                                <template v-if="gridSettings.columns[index].IsUsingCustomComponent">
                                    <component :is="components[gridSettings.columns[index].CustomComponentName]" :params="{returnToRow:{page:gridSettings.pagination.PageNumberCurrentlyViewing,rowIndex:item.rowIndex}, ...item, ...gridApi}" ></component>
                                </template>
                                <template v-else>
                                    
                                    <span 
                                        :style="`text-overflow:ellipsis; overflow:hidden; white-space:nowrap; display:block;  
                                                color:${item.rowRules.textColor?item.rowRules.textColor:'#082347'};
                                                vertical-align:center;
                                                font-size:14px;
                                                width:${gridSettings.columns[index].WidthValue-3}px;    

                                                `" 
                                        > {{item.rowIndex+1}}</span>
                                </template>    
                        </div>
                    </div>
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
import generateData from '../data/dataGenerator'

export default {
    name:"EditableDataGrid",
    components: {
        HeaderRow,
        DeveloperMode
    },
    data() {
        return {
            loadingMsg:'Populating Grid Data..',
            gridLoaded:false,
            data:[],
            viewportHeight:0,
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
            components:{},  
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
            tmpResults:[],
            tmpResultsSort:{},
            highestCountLoaded:0,
            isHovering:false,
            isHoverOverCell:true,
            rowCurrentlyHoveringOver:null,
            cellCurrentlyHoveringOver:null,
            curentlyHovering:0,
            userHasHeaders:false,
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
            gridApi:{},
            nextRowIndex:0
            
        };
    },
    computed: {
        cmpDataSet:function(){
            return this.fullDS
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
        processGridUpdate(eventData){
            this.gridSettings = eventData.gridSettings;
            console.log(this.gridSettings)
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
        calculateHeightOfHeaderRow(){
            let tmp=0;
            const height = this.gridSettings.size.GridWidthValue<600?91:51; //TODO document these numbers
            tmp=this.gridSettings.header.Enabled?tmp+51:tmp+0
            tmp=this.gridSettings.pagination.Enabled?tmp+height:tmp+0
            tmp=this.gridSettings.title.Text.length>0?tmp+28:tmp+0
            return tmp
        },        
        calculateNumRows(){
            //return this.boolGridWillScroll?Math.floor((this.gridSettings.size.GridHeightValue - this.headerHeight)/this.settings.itemHeight):this.cmpDataSet.length 
            return Math.floor((this.gridSettings.size.GridHeightValue - this.headerHeight)/this.settings.itemHeight) //fb - made this change but i want to test before removing
        },
        calculateStartingPoint(scrollTop){
                if(this.gridSettings.pagination.Enabled){
                    return Math.max(this.settings.minIndex + Math.floor((scrollTop) / this.settings.itemHeight),0)
                } else {
                    return Math.max(this.settings.minIndex + Math.floor((scrollTop) / this.settings.itemHeight),0)
                }
        },
        calculateTopPad(startingPoint,minIndex,itemHeight){
            return Math.max((startingPoint - minIndex) * itemHeight, 0)
        },
        calculateBottomPad(totalHeight,topPaddingHeight,lengthOfData,itemHeight,gridwillScroll){
            if(!gridwillScroll){return 0}
            return Math.max(totalHeight - topPaddingHeight - (lengthOfData * itemHeight), 0)
        },
        setGridState(min, max){
            this.settings.minIndex = min
            this.settings.maxIndex = max
            this.totalHeight = (this.settings.maxIndex - this.settings.minIndex ) * this.settings.itemHeight
        },        
        runScroller(){
            this.data = this.getData()
        },
        getData(){
            return this.cmpDataSet
        },
///////End Helper Functions////////    
        generateRows(data,currentRowId){
            let rows = []
            for (let i = 0; i < data.length; i++) {
                rows[i] = {
                    data: data[i].data,
                    rowIndex: currentRowId>0?currentRowId:this.nextRowIndex,
                    rowRules: {}
                }
                this.nextRowIndex = currentRowId>0?this.nextRowIndex:this.nextRowIndex+1
            }
            console.log('returning ', rows)
            return rows

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
            return tmp
        },
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
        this.runScroller() 
        this.gridLoaded = true
    },
    created(){
        this.gridSettings = this.processConfig()
        this.fullDS = this.processData(this.gridSettings.developmentMode.Enabled)
        this.processComponents();
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
            max-height:30px;
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
