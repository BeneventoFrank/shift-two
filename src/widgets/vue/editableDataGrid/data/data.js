
let gridData =  {
    Height:'300px',
    Columns:[
            {
                header:{text:"Make", height:"35px", alignment:"", backgroundColor:"", textColor:"", borderWidth:"", borderColor:""},//all optional
                dataProperty:"make", //required to tie a column to a piece of data in the dataset
                dataAlignment:"left"
            },
            {
                header:{text:"Model", height:"35px", alignment:"", backgroundColor:"", textColor:"", borderWidth:"", borderColor:""},
                dataProperty:"model", //required to tie a column to a piece of data in the dataset
                dataAlignment:"left"
            },
            {
                header:{text:"Year", height:"35px", alignment:"", backgroundColor:"", textColor:"", borderWidth:"", borderColor:""},
                dataProperty:"year", //required to tie a column to a piece of data in the dataset
                dataAlignment:"center"
            },
            {
                header:{text:"Color", height:"35px", alignment:"", backgroundColor:"", textColor:"", borderWidth:"", borderColor:""},
                dataProperty:"color", //required to tie a column to a piece of data in the dataset
                dataAlignment:"left"
            },
            {
                header:{text:"Trim", height:"35px", alignment:"", backgroundColor:"", textColor:"", borderWidth:"", borderColor:""},            
                dataProperty:"trim", //required to tie a column to a piece of data in the dataset
                dataAlignment:"center"
            },
            {
                header:{text:"Mileage"},            
                dataProperty:"mileage", 
            },
            {
                header:{text:"Damage"},            
                dataProperty:"damage", 
            }
            ,
            {
                header:{text:"Number Of Owners"},            
                dataProperty:"numOwners", 
            }
            ,
            {
                header:{text:"AC Blows Cold"},            
                dataProperty:"ac", 
            }

        ],
    PagingConfiguration:""
}

export default gridData;