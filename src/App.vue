<template>
  <div id="app" style='width:100%;'>
    <EditableDataGrid 
      :navigateToRow="8564"
      :componentList="components" 
      :rowRules="rowRules" 
      :gridConfig="localConfig"
    />
    
  </div>
</template>

<script> 
//import Slider from './widgets/vue/slider/Slider'
import EditableDataGrid from './widgets/vue/editableDataGrid/src/editableDataGrid'
import gridConfig from './widgets/vue/editableDataGrid/settings/custom/shift-grid-config'
import EditAndDelete from './widgets/vue/editableDataGrid/src/components/EditAndDelete'
import AddRecord from './widgets/vue/editableDataGrid/src/components/AddRecord'
import EditDataInline  from './widgets/vue/editableDataGrid/src/components/EditDataInline'

export default {
  name: 'App',
  components: {
    //Slider,
    EditableDataGrid
  },
  data(){
    return {
       localConfig:gridConfig,
       components:[],
       rowRules:[]
    }
  },
  created(){
    this.components = [EditAndDelete,AddRecord,EditDataInline]
    this.rowRules = [
                      {
                        columnToCompare:0,
                        compareFunction:(value)=>{return value.toLowerCase()==="milford"},
                        stylesToApply:{
                          textColor:'#082347',
                          backgroundColor:'#ffebea'
                        }
                      },
                      {
                        columnToCompare:2,
                        compareFunction:(value)=>{return value.toLowerCase()==="milford"},
                        stylesToApply:{
                          textColor:'#082347',
                          backgroundColor:'#fef4e2'

                        }
                      }

                    ]
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
