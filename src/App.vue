<template>
  <div id="app">
    <EditableDataGrid :gridConfig="localData"></EditableDataGrid>
  </div>
</template>

<script>
import EditableDataGrid from './widgets/vue/editableDataGrid/src/EditableDataGrid'
import gridData from './widgets/vue/editableDataGrid/data/data.js'

export default {
  name: 'App',
  components: {
    EditableDataGrid
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
