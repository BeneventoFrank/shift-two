
let gridData =  {
    Columns:[
            {
                header:{text:"Make", height:"35px", alignment:"", backgroundColor:"", textColor:"", borderWidth:"", borderColor:""},//all optional
                width:"10%", //optional, if left out will auto size
                dataProperty:"make", //required to tie a column to a piece of data in the dataset
                dataAlignment:"left"
            },
            {
                header:{text:"Model", height:"35px", alignment:"", backgroundColor:"", textColor:"", borderWidth:"", borderColor:""},
                width:"10%", //optional, if left out will auto size
                dataProperty:"make", //required to tie a column to a piece of data in the dataset
                dataAlignment:"left"
            },
            {
                header:{text:"Year", height:"35px", alignment:"", backgroundColor:"", textColor:"", borderWidth:"", borderColor:""},
                width:"10%", //optional, if left out will auto size
                dataProperty:"make", //required to tie a column to a piece of data in the dataset
                dataAlignment:"center"
            },
            {
                header:{text:"Color", height:"35px", alignment:"", backgroundColor:"", textColor:"", borderWidth:"", borderColor:""},
                width:"40%", //optional, if left out will auto size
                dataProperty:"make", //required to tie a column to a piece of data in the dataset
                dataAlignment:"left"
            },
            {
                header:{text:"Trim", height:"35px", alignment:"", backgroundColor:"", textColor:"", borderWidth:"", borderColor:""},            
                width:"30%", //optional, if left out will auto size
                dataProperty:"make", //required to tie a column to a piece of data in the dataset
                dataAlignment:"center"
            },
        ],
    PagingConfiguration:""
}

export default gridData;