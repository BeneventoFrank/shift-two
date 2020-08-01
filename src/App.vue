<template>
  <div id="app">
    <EditableDataGrid :gridConfig="localData"></EditableDataGrid>
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
  color: slategrey;
  margin-top: 60px;
}
</style>
