<template>
  <div id="app">
    <Slider></Slider>
  </div>
</template>

<script> 
import Slider from './widgets/vue/slider/Slider'
//import EditableDataGrid from './widgets/vue/editableDataGrid/src/editableDataGrid'
import gridData from './widgets/vue/editableDataGrid/data/data.js'

export default {
  name: 'App',
  components: {
    Slider,
    //EditableDataGrid
  },
  data(){
    return {
        localData:gridData
    }
  },
  mounted(){
    console.log('data', gridData)
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
