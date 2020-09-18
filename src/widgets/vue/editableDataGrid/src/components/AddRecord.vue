<template>
    <div style="display:flex; align-items:center;">
        <button @click="handleAddRecordClick" style="cursor:pointer; border:none; color:white; background-color:#455982; width:110px; height:17px; border-radius:3px;">New Record</button>
    </div>
</template>

<script>
    export default {
        name:'AddRecord',
        props:{
            params:{}
        },
        methods:{
            handleAddRecordClick(){
                const data = ['hello World', 'hello world', 'HELLO WORLD', 'Hello world','']
                this.params.addNewRow(data)
            }
        },
    }
    
</script>

