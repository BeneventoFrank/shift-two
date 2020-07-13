<template>
    <div class='headerRow' :style="`width:${gridWillScroll?'99%':'100%'}`">
        <div :ref="`header-${header.columnIndex}`" class="headerCell" @mouseenter="()=>{handleFlyout(header.columnIndex,true)}" @mouseleave="()=>{handleFlyout(header.columnIndex,false)}"  v-for="(header) in headers" :key="header.columnIndex" 
            :style="`width:${header.width}; height:${header.height};  backgroundColor:${header.backgroundColor}; color:${header.textColor}; 
                     border-right:${getBorder(header.borderWidth, header.borderColor, header.columnIndex)};`">
            <span> 
                {{header.text}}
            </span>
            <div :ref="`flyout-${header.columnIndex}`" class='flyout' v-if="showAFilter&&showFilter[header.columnIndex]===true" :style="`right:${wouldCauseAScroll(header.columnIndex)?wouldCauseAScroll(header.columnIndex):null}`">
                <div class='innerDiv' :style="`background-color:${bgColor}`">
                    <label class='filterHeader'>Filter {{header.text}}</label>
                    <br>
                    <FilterInput :defaultValue="cmpFilter(header.columnIndex)" :ref="`filterInput-${header.columnIndex}`" @filterInputChanged="(evt)=>{debounceInput(evt,header.columnIndex)}" :columnIndex="header.columnIndex"></FilterInput>
                    <br>
                    <div v-if="filterCount>0">
                        <span>Results: {{filterCount}}, Specify More Characters. </span>
                        <br>
                        <span @click="handleShowTheDataAnyway" style="text-decoration:underline; cursor:pointer; font-size:small;">Just give me the data</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {colors} from '../../../../../assets/shiftTwo'
import debounce from 'lodash.debounce'
import FilterInput from '../components/filterInput'
export default {
    name:"HeaderRow",
    components: {
        FilterInput
    },
    data() {
        return {
            showAFilter:false,
            showFilter:{},
            bgColor:''
        };
    },
    computed: {
    },
    props:{
        headers:{
            type:Array
        },
        gridWillScroll:{
            type:Boolean
        },
        currentFilters:{
            type:Object
        },
        filterCount:{
            type:Number
        },
        gridWidth:{
            type:Number
        }
    },        
    methods: {
       wouldCauseAScroll(index){
            let retVal = '50px'
            let y = this.$refs[`header-${index}`]
            if((y[0].offsetLeft+350)>this.gridWidth){
                retVal = '350px'
            }
            return retVal
       },
       cmpFilter:function(columnIndex){
            let tmp = ['','']
            if (this.currentFilters.filters[columnIndex]){
                tmp = this.currentFilters.filters[columnIndex].split('^^')
            }
            return tmp[1]
       },
       handleShowTheDataAnyway(){
           this.$emit('showDataAnyway')
       },
       handleFlyout(index,value){
        this.showAFilter=value
        this.showFilter[index] = value
       },
       debounceInput: debounce(function(evt, index){
           const strategy = `${index}^^${evt.target.value}`
           this.$emit('filterApplied',strategy)
           if(evt.target.value){
               this.$refs[`header-${index}`][0].classList.add('activeFilter')
           } else 
           {
               this.$refs[`header-${index}`][0].classList.remove('activeFilter')
           }
       }, 50),
       getBorder(usersBorderWidth, usersBorderColor, columnIndex){
           if(columnIndex===this.headers.length-1){return null} //no left border on the first column or the last one 
           return usersBorderWidth?`${usersBorderWidth} solid ${usersBorderColor}`:`${this.defaultValues.borderWidth} solid ${this.defaultValues.borderColor}`
       },
    },
    mounted(){
        let tmp = {}
         for (let i = 0; i < this.headers.length; i++) {
             tmp[i]=false
         }
         this.showFilter = tmp
         this.bgColor = colors.editableDataGrid.defaultHeaderColor
  }
};
</script>
<style scoped>
    .headerRow{
        display:flex;
        flex-direction:row;
        align-items: center;
        border-bottom: 1px solid #C8C8C8;
    }
    .headerCell{
        display:flex; 
        flex-direction:row; 
        align-items:center; 
        justify-content:center; 
        font-size: 15px; 
        font-family:Arial, Helvetica, sans-serif;
        padding-left:5px;
        padding-right:5px;
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
        height:250px;
        width:300px;
        padding:10px;
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
        width: 250px;
        border-radius: 4px;
        outline: none;
        border: 1px solid rgb(176, 176, 176);
        line-height: 25px;
        padding:5px;
        font-size:16px;

    }
</style>
