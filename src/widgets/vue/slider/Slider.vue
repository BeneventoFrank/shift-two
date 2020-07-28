<template>
<div style="width:100%">
  <div class="slideContainer">
    <input ref="rangeSlider" class="slider" type="range" min="1" max="10" steps="100" value="1">
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
    getTrackStyle:function(el) {  
    let prefs = ['webkit-slider-runnable-track', 'moz-range-track', 'ms-track']
    let curVal = el.value, val = (curVal - 1) * 16.666666667, style = '';
    var sheet = document.createElement('style')
    // // Set active label
    // $('.range-labels li').removeClass('active selected');
    
    // var curLabel = $('.range-labels').find('li:nth-child(' + curVal + ')');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
    // curLabel.addClass('active selected');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
    // curLabel.prevAll().addClass('selected');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
    
    // Change background gradient
    for (var i = 0; i < prefs.length; i++) {
      style += '.range {background: linear-gradient(to right, #37adbf 0%, #37adbf ' + val + '%, #fff ' + val + '%, #fff 100%)}';
      style += '.range input::-' + prefs[i] + '{background: linear-gradient(to right, #37adbf 0%, #37adbf ' + val + '%, #b2b2b2 ' + val + '%, #b2b2b2 100%)}';
    }

    return style;
  }

  },
  mounted(){
    
    this.$refs.rangeSlider.addEventListener('input',this.getTrackStyle(this))
    
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