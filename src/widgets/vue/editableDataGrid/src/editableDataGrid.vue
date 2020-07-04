<template>
    <div class='container'>
        <div :style="`width:100%; background-color:${virtualColumns[virtualColumns.length-1]?virtualColumns[virtualColumns.length-1].backgroundColor:null}`">
            <HeaderRow v-if="userHasHeaders" :gridWillScroll="gridWillScroll()" :headers="virtualColumns"></HeaderRow>
        </div>
        <div ref='dataRow' class="dataRow" @scroll="debounceScroll" :style="`max-height:${gridConfig.Height}; overflow: auto; width:100%;`">
            <DataRow  v-for="(row,index) in gridData" :key="index" :rowIndex="index" :rowData="row" :virtualColumns="virtualColumns"></DataRow>            
        </div>
    </div>
</template>
<script>

import HeaderRow from './components/HeaderRow'
import DataRow from './components/DataRow'
import debounce from 'lodash.debounce'
import { colors } from '../../../../assets/shiftTwo'
import axios from 'axios'

export default {
    name:"EditableDataGrid",
    components: {
        HeaderRow,
        DataRow
    },
    data() {
        return {
            headers:{
                hasHeaders:false
            },
            highestScrollPosition:0,
            gridData:[],
            userHasHeaders:false,
            virtualColumns:[],
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
        setDefaultValues(){
           this.defaultValues.columnValues.backgroundColor = colors.editableDataGrid.defaultHeaderColor
           this.defaultValues.columnValues.borderColor = colors.editableDataGrid.defaultBorderColor
           this.defaultValues.columnValues.textColor = colors.editableDataGrid.defaultTextColor
           this.defaultValues.columnValues.height = '35px';
           this.defaultValues.columnValues.width = Math.round((100/this.gridConfig.Columns.length),1)+'%'
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
                this.gridData = results.data.slice(1,1000)
                this.fullDS = results.data
                this.workingDS = results.data
                console.log("TICKTOCK - DONE", new Date())
            })
        },
        debounceScroll: debounce(function (event){
            //we only want to add records if they are scrolling down. 
            //so we need to keep track of the scrollHeight.
            //if its going up, add some  if its <= the highest its been. then don't add any
            if(this.highestScrollPosition<event.srcElement.scrollTop){
                let numToAdd = 5;
                if((event.srcElement.scrollHeight - event.srcElement.scrollTop)<=4000){
                    numToAdd = 1000;
                }
                const currentlyViewing=this.gridData
                let nextBatch = []
                for (let i = currentlyViewing.length; i < currentlyViewing.length+numToAdd; i++) {  
                    if(this.fullDS[i] && Object.keys(this.fullDS[i]>0)){
                        nextBatch.push(this.fullDS[i])
                    }
                }
                this.gridData = [...currentlyViewing, ...nextBatch]
                this.highestScrollPosition = event.srcElement.scrollTop
            }
        },50)
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

        

  }
};
</script>
<style scoped>
.dataRow{
    
}
.dataRow :hover{
    background-color: #E8E8E8;
}

</style>
