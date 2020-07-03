
let gridData =  {
    Columns:[
            {
                header:{text:"Make", height:"35px", alignment:"", backgroundColor:"", textColor:"", borderWidth:"", borderColor:""},//all optional
                width:"20%", //optional, if left out will auto size
                dataProperty:"make" //required to tie a column to a piece of data in the dataset
            },
            {
                header:{text:"Model",width:"20%", height:"35px", alignment:"", backgroundColor:"", textColor:"", borderWidth:"", borderColor:""},
                width:"20%", //optional, if left out will auto size
                dataProperty:"make" //required to tie a column to a piece of data in the dataset
            },
            {
                header:{text:"Year",width:"20%", height:"35px", alignment:"", backgroundColor:"", textColor:"", borderWidth:"", borderColor:""},
                width:"20%", //optional, if left out will auto size
                dataProperty:"make" //required to tie a column to a piece of data in the dataset
            },
            {
                header:{text:"Color",width:"20%", height:"35px", alignment:"", backgroundColor:"", textColor:"", borderWidth:"", borderColor:""},
                width:"20%", //optional, if left out will auto size
                dataProperty:"make" //required to tie a column to a piece of data in the dataset
            },
            {
                header:{text:"Trim",width:"20%", height:"35px", alignment:"", backgroundColor:"", textColor:"", borderWidth:"", borderColor:""},            
                width:"20%", //optional, if left out will auto size
                dataProperty:"make" //required to tie a column to a piece of data in the dataset
            },
        ],
    Rows:[
        {make:'Toyota',model:'Rav4',year:'2020',color:'Graphite',trim:'XSE'},
        {make:'Ford',model:'Escort',year:'2020',color:'Navy Blue',trim:'XE'},
        {make:'Dodge',model:'Ram 1500',year:'2020',color:'Silver',trim:'SE'},
        {make:'Dodge',model:'Ram 2500',year:'2020',color:'Midnight Black',trim:'Limited'},
        {make:'Jeep',model:'Liberty',year:'2020',color:'Blue',trim:'XE'}
    ],
    PagingConfiguration:""
}

export default gridData;