<template>
    <div ref="grid" style='width:100%;' class='container'>
        <div :style="`width:100%; background-color:${virtualColumns[virtualColumns.length-1]?virtualColumns[virtualColumns.length-1].backgroundColor:null}`">
            <HeaderRow v-if="userHasHeaders" @showDataAnyway="handleShowDataAnyway" :defaultValues="defaultValues" :filterCount="filterCount" :gridWillScroll="gridWillScroll()" :currentFilters="filterStrategy" @filterApplied="handleApplyFilter" :gridWidth="gridWidth" :headers="virtualColumns"></HeaderRow>
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
import axios from 'axios'
import worker from './webWorker/filterWorker'
import WebWorker from './webWorker/filterServiceWorkerSetup'

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
            tableTop:0,
            scrollCount:0,
            multiple:10,
            addToTop:74,
            highestCountLoaded:150,
            skip:20,
            dataSlice:[],
            initialSlice:[],
            filteredData:[],
            userHasHeaders:false,
            virtualColumns:[],
            virtualHeight:0,
            lastPosition:0,
            filterStrategy:{
                isCurrentlyFiltering:false,
                filters:{}
            },
            backgroundWorker:null,
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
        setDefaultValues(){
           const numColumns = Object.keys(this.fullDS[0]).length
           const widthOfGrid = this.$refs.dataRow.offsetWidth
           const eachColumn = Math.round(widthOfGrid/numColumns)
            console.log(numColumns , ' ', eachColumn, ' ', widthOfGrid)

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
        async getTestData(){
            await axios.get('http://localhost:5003/client/741/client-lists/1/list-data/1')
            .then(results=>{
                this.virtualHeight = results.data.length*29-950
                this.dataSlice = results.data.slice(1,this.highestCountLoaded)
                this.initialSlice = this.dataSlice
                this.highestCountLoaded = this.highestCountLoaded + 1
                this.fullDS = results.data
            })
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
            console.log('message', message)
            // if(message.data.MessageType==='filterToShort'){
            //     this.filterCount = message.data.Count
            //     this.filteredData = message.data.Data
            // } else if(message.data.MessageType ==='filterResults'){
            //     this.dataSlice = message.data.Data
            //     this.filterCount = 0
            // }
        },
        handleShowDataAnyway(){
            this.highestCountLoaded = 150
            this.virtualHeight = this.filteredData.length*29-950
            this.dataSlice = this.filteredData.slice(1,this.highestCountLoaded)
        },
        handleApplyFilter(strategy){
            this.backgroundWorker.postMessage({'MessageType':'filter','Strategy':strategy})
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
        
        this.backgroundWorker = new WebWorker(worker)
        this.backgroundWorker.addEventListener('message',event =>{this.handleMessage(event)})
        this.backgroundWorker.postMessage({'MessageType':'data','Data':this.fullDS, 'Columns':this.virtualColumns})
        

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
