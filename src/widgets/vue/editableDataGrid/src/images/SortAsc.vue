<template>
  <svg
    viewBox="0 0 320 512"
    :height="`${height}px`"
    :fill="getFillColor()"
  >
    <path
        d="M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z"
    />
  </svg>
</template>

<script>
export default {
  name: 'SortAscSVG',
  props:{
    height:{
      type:Number
    },
    isActiveSort:{
      type:String
    }
  }, 
  methods:{
    getFillColor(){
      return this.isActiveSort==='asc'?'black':'#c3c3c3'
    }
  }
}
</script>

<style lang="css" scoped></style>