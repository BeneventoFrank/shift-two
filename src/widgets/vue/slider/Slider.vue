<template>
<div style="width:100%">
  <div class="slideContainer">
    <input class="slider" type="range" min="1" max="10" steps="100" value="1">
  </div>
  <ul class="range-labels">
   <li>h</li>
   <li>d</li>
   <li>f</li>
   <li>w</li>
   <li>w</li>
   <li>w</li>
   <li>w</li>
   <li>w</li>
   <li>e</li>
</ul>
</div>
</template>
<script>
export default {
  name: 'Slider',
  props:{
  }, 
  methods:{
  },
  mounted(){
  }
}
</script>

<style lang="css" scoped>
.slideContainer {
  width: 50%;
  position: relative;
  text-align: start;
}
.slider {
  position: absolute;
  -webkit-appearance: none;
  width: 100%;
  height: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  margin-left: 0px;
  appearance: none;
  width: 25px;
  height: 25px;
  background: #4CAF50;
  cursor: pointer;
  border-radius:50%;
}

.range-labels {
  width: 50%;
 
  padding: 0;
  list-style: none;
  position:fixed;
}
 .range-labels li {
    position: relative;
    float: left;
    width: 75px;
    color: red;
    font-size: 14px;
    cursor: pointer;
 }
  .range-labels li::before {
      position: absolute;
      background: #4CAF50;
      top: -16px;
      right: 0;
      left: 2px;
      content: "";
      width: 9px;
      height: 9px;
      border-radius: 50%;
    
  }


</style>