
let gridData =  {
    Columns:[
            {
                header:{text:"Make", height:"35px", alignment:"", backgroundColor:"", textColor:"", borderWidth:"", borderColor:""},//all optional
                width:"10%", //optional, if left out will auto size
                dataProperty:"make", //required to tie a column to a piece of data in the dataset
                dataAllignment:"left"
            },
            {
                header:{text:"Model", height:"35px", alignment:"", backgroundColor:"", textColor:"", borderWidth:"", borderColor:""},
                width:"10%", //optional, if left out will auto size
                dataProperty:"make", //required to tie a column to a piece of data in the dataset
                dataAllignment:"left"
            },
            {
                header:{text:"Year", height:"35px", alignment:"", backgroundColor:"", textColor:"", borderWidth:"", borderColor:""},
                width:"10%", //optional, if left out will auto size
                dataProperty:"make", //required to tie a column to a piece of data in the dataset
                dataAllignment:"center"
            },
            {
                header:{text:"Color", height:"35px", alignment:"", backgroundColor:"", textColor:"", borderWidth:"", borderColor:""},
                width:"40%", //optional, if left out will auto size
                dataProperty:"make", //required to tie a column to a piece of data in the dataset
                dataAllignment:"right"
            },
            {
                header:{text:"Trim", height:"35px", alignment:"", backgroundColor:"", textColor:"", borderWidth:"", borderColor:""},            
                width:"30%", //optional, if left out will auto size
                dataProperty:"make", //required to tie a column to a piece of data in the dataset
                dataAllignment:"center"
            },
        ],
    Rows:[
         {make:'Toyota',model:'Rav4',year:'2020',color:'Graphite',trim:'XSE'},
         {make:'Ford',model:'Escort',year:'2020',color:'Navy Blue',trim:'XE'},
         {make:'Dodge',model:'Ram 1500',year:'2020',color:'Silver',trim:'SE'},
         {make:'Dodge',model:'Ram 2500',year:'2020',color:'Midnight Black',trim:'Limited'},
         {make:'Toyota',model:'Rav4',year:'2020',color:'Graphite',trim:'XSE'},
         {make:'Ford',model:'Escort',year:'2020',color:'Navy Blue',trim:'XE'},
         {make:'Dodge',model:'Ram 1500',year:'2020',color:'Silver',trim:'SE'},
         {make:'Dodge',model:'Ram 2500',year:'2020',color:'Midnight Black',trim:'Limited'},
         {make:'Toyota',model:'Rav4',year:'2020',color:'Graphite',trim:'XSE'},
         {make:'Ford',model:'Escort',year:'2020',color:'Navy Blue',trim:'XE'},
         {make:'Dodge',model:'Ram 1500',year:'2020',color:'Silver',trim:'SE'},
         {make:'Dodge',model:'Ram 2500',year:'2020',color:'Midnight Black',trim:'Limited'},
         {make:'Jeep',model:'Liberty',year:'2020',color:'Blue',trim:'XE'}
    ],
    PagingConfiguration:""
}

export default gridData;