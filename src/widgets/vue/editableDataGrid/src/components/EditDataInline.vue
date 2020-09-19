<template>
    <div style='display:flex; align-items:flex-start;    flex-direction: column; border:1px solid #455982; border-radius:3px; background-color:lightgrey; padding:30px; width:250px; height:225px;'>
        <label style="margin-bottom:7px;">Current Value</label>
        <input type="text" :value="params.data[params.columnBeingEdited]" disabled style="border-radius:3px; border:none; outline:none; width:100%;"/>
        <label style="margin-top:15px; margin-bottom:7px;">New Value</label>
        <input type="text" v-model="newValue" autofocus style="border-radius:3px; border:none; outline:none; width:100%;"/>
        <div style="display:flex; justify-content:flex-end; width:100%">
            <button @click="``" style="cursor:pointer; color:white; border:none; background-color:#455982; width:75px; margin-top:30px; height:17px; border-radius:3px;">Save</button>
        </div>
    </div>
</template>
<script>
export default {
    name:"EditDataInline",
    data(){
        return(
            {
                newValue:''
            }
        )
    },
    watch:{
        params:function(val){
            this.newValue = val.UserInteractingWithComponent?this.newValue:'';
        }
    },
    props:{
        params:{
            type:Object
        }

    },
    mounted(){
    }
}
</script>