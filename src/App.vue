<template>
  <div id="app" style='width:100%;'>
    <!-- <slider 
      :width="300"
      :minValue="500"
      :maxValue="4000"
      :stepValue="500"
      :initialValue="500"    
    /> -->
    <EditableDataGrid :gridConfig="localData" />
  </div>
</template>

<script> 
//import Slider from './widgets/vue/slider/Slider'
import EditableDataGrid from './widgets/vue/editableDataGrid/src/editableDataGrid'
import gridConfig from './widgets/vue/editableDataGrid/data/data.js'

export default {
  name: 'App',
  components: {
    //Slider,
    EditableDataGrid
  },
  data(){
    return {
        localData:gridConfig
    }
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: red !important;
}
</style>
