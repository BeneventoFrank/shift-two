<template>
  <svg
    viewBox="0 0 320 512"
    :height="`${height}px`"
    :fill="getFillColor()"
  >
    <path
        d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z"
    />
  </svg>
</template>

<script>
export default {
  name: 'SortDescSVG',
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