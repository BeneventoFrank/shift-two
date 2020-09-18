<template>
    <div style="display:flex; height:100%; width:100%; justify-content:center; align-items:center;">
        <button @click="handleEditClick" style="cursor:pointer; color:white; border:none; background-color:#455982; width:75px; height:17px; border-radius:3px;">Edit</button>
        <button @click="handleDeleteClick" style="cursor:pointer; margin-left:15px; border:none; color:white; background-color:#455982; width:75px; height:17px; border-radius:3px;">Delete</button>
    </div>
    
</template>

<script>
    export default {
        name:'HelloWorld',
        props:{
            params:{}
        },
        methods:{
            handleDeleteClick(){
                this.params.deleteRow(this.params.rowIndex)
            },
            handleEditClick(){
                const data = ['hello World', 'hello world', 'HELLO WORLD', 'Hello world','']
                this.params.refreshRow(this.params.rowIndex,data)
            }
        },
    }
    
</script>

