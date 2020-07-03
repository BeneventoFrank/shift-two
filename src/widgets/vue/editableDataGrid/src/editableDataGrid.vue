<template>

    <div class='container'>
        <HeaderRow v-if="userHasHeaders" :headers="virtualColumns"></HeaderRow>
        <div>
            <DataRow v-for="(row,index) in gridConfig.Rows" :key="index" :rowData="row" :virtualColumns="virtualColumns"></DataRow>            
        </div>
    </div>

</template>
<script>

import HeaderRow from './components/HeaderRow'
import DataRow from './components/DataRow'
import { colors } from '../../../../assets/shiftTwo'
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
                }
            }
        };
    },
    computed: {
    },
    methods: {
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
                }
                this.userHasHeaders=hasHeader
                this.virtualColumns.push(tmp)
            }
        },
        setDefaultValues(){
           this.defaultValues.columnValues.backgroundColor = colors.editableDataGrid.defaultHeaderColor
           this.defaultValues.columnValues.borderColor = colors.editableDataGrid.defaultBorderColor
           this.defaultValues.columnValues.textColor = colors.editableDataGrid.defaultTextColor
           this.defaultValues.columnValues.height = '35px';
           this.defaultValues.columnValues.width = Math.round((100/this.gridConfig.Columns.length),1)+'%'
           this.defaultValues.columnValues.borderWidth = '1px'
           this.defaultValues.columnValues.alignment = 'center'
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
        }
    },
    props:{
        gridConfig:{
            type: Object,
            required: true
        }
    },        
    
    mounted(){
        this.setDefaultValues()
        this.deriveHeaders()
  }
};
</script>
<style>

</style>
