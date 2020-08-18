<template>
  <div id="wrapper">
      <div id="sliderContainer" :style="`width:${width}px;`">
          <div class="tick-slider">
              <div class="tick-slider-value-container">
                  <div id="weightLabelMin" class="tick-slider-label">&nbsp;</div>
                  <div id="weightLabelMax" class="tick-slider-label">&nbsp;</div>
                  <div id="weightValue" class="tick-slider-value"></div>
              </div>
              <div class="tick-slider-background"></div>
              <div id="weightProgress" class="tick-slider-progress"></div>
              <div id="weightTicks" class="tick-slider-tick-container"></div>
              <input
                  ref="sliderInput"
                  id="weightSlider"
                  class="tick-slider-input"
                  type="range"
                  :min="minValue"
                  :max="maxValue"
                  :step="stepValue"
                  :value="initialValue"
                  :data-tick-step="stepValue"
                  data-tick-id="weightTicks"
                  data-value-id="weightValue"
                  data-progress-id="weightProgress"
                  data-handle-size="18"
                  data-min-label-id="weightLabelMin"
                  data-max-label-id="weightLabelMax"
              />
          </div>
      </div>
  </div>
</template>
<script>
import debounce from 'lodash.debounce'
export default {
  name: 'Slider',
  data(){
   return{
   } 
  },
  props:{
    initialValue:{
        type:Number
    },
    stepValue:{
        type:Number
    },
    maxValue:{
        type:Number
    },
    minValue:{
        type:Number
    },
    width:{
      type:Number
    }
  }, 
  updated(){
    this.init()
  },
  methods:{
      init(){
          const slider = this.$refs.sliderInput;
          console.log(slider)
          slider.oninput = this.debounceSlider;
          this.updateValue(slider);
          this.updateValuePosition(slider);
          this.updateProgress(slider);
          this.setTicks(slider);
          this.$emit('initialValue',slider.value)
      },
      debounceSlider: debounce(function (event){
          this.updateValue(event.target);
          this.updateValuePosition(event.target);
          this.updateProgress(event.target);
          setTimeout(() => {this.$emit('change',event)}, 1000);          
      },50),  
      updateValue(slider) {
          let value = document.getElementById(slider.dataset.valueId);
          value.innerHTML = "<div class='sliderIndicator'> " + slider.value + "</div>";
      },
      updateValuePosition(slider) {
          let value = document.getElementById(slider.dataset.valueId);
          console.log('what is the value', value)
          const percent = this.getSliderPercent(slider);

          const sliderWidth = slider.getBoundingClientRect().width;
          const valueWidth = value.getBoundingClientRect().width;
          const handleSize = slider.dataset.handleSize;

          let left = percent * (sliderWidth - handleSize) + handleSize / 2 - valueWidth / 2;

          left = Math.min(left, sliderWidth - valueWidth);
          left = slider.value === slider.min ? 0 : left;

          value.style.left = left + "px";
      },
      updateProgress(slider) {
          let progress = document.getElementById(slider.dataset.progressId);
          const percent = this.getSliderPercent(slider);

          progress.style.width = percent * 100 + "%";
      },
      getSliderPercent(slider) {
          const range = slider.max - slider.min;
          const absValue = slider.value - slider.min;

          return absValue / range;
      },
      setTicks(slider) {
          let container = document.getElementById(slider.dataset.tickId);
          const spacing = parseFloat(slider.dataset.tickStep);
          console.log("wtf is spacing', ", spacing)
          const sliderRange = (parseInt(slider.max)  - parseInt(slider.min));
          console.log('slider range ', sliderRange, parseInt(slider.max), parseInt(slider.min))
          const tickCount = sliderRange / spacing + 1; // +1 to account for 0
          for (let ii = 0; ii < tickCount; ii++) {
              let tick = document.createElement("span");

              tick.className = "tick-slider-tick";

              container.appendChild(tick);
          }
      },
      onResize() {
          const sliders = document.getElementsByClassName("tick-slider-input");

          for (let slider of sliders) {
              this.updateValuePosition(slider);
          }
      }
  },
  mounted(){
    
  this.init();
  window.addEventListener("resize", this.onResize);   
  }
}
</script>

<style>

    :root {
        --yellow: slategray;
        --light-yellow: #fdf2d2;
        --orange: slategray;
        --light-gray: #e3e4e8;
        --gray: #71738b;
        --light-blue: #7a7c93;
        --blue: #34385a;

        --slider-handle-size: 16px;
        --slider-handle-border-radius: 50%;
        --slider-handle-margin-top: -4px;
        --slider-track-height: 8px;
        --slider-track-border-radius: 4px;
    }

    * {
        box-sizing: border-box;
    }

    body {
        margin: 0 auto;
    }

    #wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
    }
    .sliderIndicator {
      background-color: slategray;
      border-radius: 5px;
      color:white;
      width:50px;
      font-size: small;
    }

    #sliderContainer {
        width: 100%;
        max-width: 440px;
    }
    .tick-slider-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 24px;
    }

    .tick-slider-header>h5 {
        margin: 0;

        font-family: "Poppins", sans-serif;
        font-size: 18px;
        font-weight: 300;
        color: var(--gray);
    }

    .tick-slider {
        position: relative;

        width: 100%;
    }

    .tick-slider-value-container {
        position: relative;
        width: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        font-family: "Hind Madurai", sans-serif;
        font-size: 18px;
        color: var(--gray);
    }

    .tick-slider-value {
        position: absolute;
        top: 0;

        font-weight: bold;

        color: var(--blue);

        border-radius: var(--slider-handle-border-radius);
    }

    .tick-slider-value>div {
        animation: bulge 0.3s ease-out;
    }

    .tick-slider-background,
    .tick-slider-progress,
    .tick-slider-tick-container {
        position: absolute;
        bottom: 5px;
        left: 0;

        height: var(--slider-track-height);

        pointer-events: none;

        border-radius: var(--slider-track-border-radius);

        z-index: -1;
    }

    .tick-slider-background {
        width: 100%;
        background-color: var(--light-gray);
    }

    .tick-slider-progress {
        background-color: var(--yellow);
    }

    .tick-slider-tick-container {
        width: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;

        padding: 0 calc(var(--slider-handle-size) / 2);
    }

    .tick-slider-tick {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        margin-bottom:.05rem;
        background-color: white;
    }

    .tick-slider-label {
        opacity: 0.85;
        transition: opacity 0.1s ease;
    }

    .tick-slider-label.hidden {
        opacity: 0;
    }

    @keyframes bulge {
        0% {
            transform: scale(1);
        }

        25% {
            transform: scale(1.1);
        }

        100% {
            transform: scale(1);
        }
    }

    /*

        REMOVE SLIDER STYLE DEFAULTS

    */
    input[type="range"] {
        -webkit-appearance: none;

        width: 100%;
        height: 100%;

        background: transparent;
        outline: none;

        margin: 5px 0;
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;

        border: none;
    }

    input[type="range"]:focus {
        outline: none;
    }

    input[type="range"]::-moz-focus-outer {
        border: 0;
    }

    /*

        HANDLE

    */
    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;

        width: var(--slider-handle-size);
        height: var(--slider-handle-size);

        background: var(--orange);

        border-radius: var(--slider-handle-border-radius);

        cursor: pointer;

        margin-top: var(--slider-handle-margin-top);
      
        -webkit-transform: scale(1);
        transform: scale(1);

        transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    input[type="range"]:hover::-webkit-slider-thumb,
    input[type="range"]:focus::-webkit-slider-thumb {
        transform: scale(1.2);
    }

    input[type="range"]::-moz-range-thumb {
        -webkit-appearance: none;

        width: var(--slider-handle-size);
        height: var(--slider-handle-size);

        background: var(--orange);

        border: none;
        border-radius: var(--slider-handle-border-radius);

        cursor: pointer;

        transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    input[type="range"]:hover::-moz-range-thumb,
    input[type="range"]:focus::-moz-range-thumb {
        transform: scale(1.2);
    }

    /*

        TRACK

    */

    input[type="range"]::-webkit-slider-runnable-track {
        width: 100%;
        height: var(--slider-track-height);

        cursor: pointer;

        background: none;

        border-radius: var(--slider-track-border-radius);
    }

    input[type="range"]::-moz-range-track {
        width: 100%;
        height: var(--slider-track-height);

        cursor: pointer;

        background: none;

        border-radius: var(--slider-track-border-radius);
    }

    input[type="range"]:focus::-webkit-slider-runnable-track {
        background: none;
    }
    input[type="range"]:active::-webkit-slider-runnable-track {
        background: none;
    }


</style>