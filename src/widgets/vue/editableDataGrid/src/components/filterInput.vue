<template>
    <input ref="filterInput" autocomplete="off" placeholder="Filter" :value="defaultValue" id='filterInput' @input="handleInputChanged" type='text' class="filterInput">
</template>

<script>
export default {
    name:"filterInput",
    components: {
    },
    data() {
        return {
            showAFilter:false,
            showFilter:{},
            bgColor:''
        };
    },
    computed: {
    },
    
    props:{
        columnIndex:{
            type:Number
        },
        defaultValue:{
            type:String
        }
    },        
    methods: {
        handleInputChanged(evt){
            this.$emit('filterInputChanged',evt)
        },
        trySetFocus(){
            let field = document.querySelector('#filterInput')
            field.focus()
        }

    },
    mounted(){
        //seriously wtf.. this was about 2hrs of my life. i wanted to set the focus in the input
        //and it was not on $refs. this was the only way around it. but it works..sometimes??!!?? now 3 hours.. 
        setTimeout(() => {
            try {
                this.trySetFocus();
            } catch (error) {
                //meh.. we tried.
            }
        }, 200);
  }
};
</script>
<style scoped>
    .filterInput {
        height:30px;
        width: 250px;
        border-radius: 4px;
        outline: none;
        border: 1px solid rgb(176, 176, 176);
        line-height: 25px;
        padding:5px;
        font-size:16px;
    }
    ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #c3c3c3;
    opacity: 1; /* Firefox */
    }

    :-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: #c3c3c3;
    }

    ::-ms-input-placeholder { /* Microsoft Edge */
    color: #c3c3c3  ;
    }    
</style>
