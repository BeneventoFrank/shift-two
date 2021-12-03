<template>
  <div id="app" style='width:100%;'>
    <EditableDataGrid 
      :componentList="components" 
      :gridConfig="localConfig"
    />
    
  </div>
</template>

<script> 
//import Slider from './widgets/vue/slider/Slider'
import EditableDataGrid from './widgets/vue/editableDataGrid/src/editableDataGrid'
import gridConfig from './widgets/vue/editableDataGrid/settings/custom/shift-grid-config'
import Nav from './widgets/vue/editableDataGrid/src/components/Nav.vue'
export default {
  name: 'App',
  components: {
    //Slider,
    EditableDataGrid
  },
  data(){
    return {
       components:[],
       localConfig:gridConfig,
    }
  },
  created(){
   this.components = [Nav]    
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
