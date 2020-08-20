
let gridConfig =  {
    GridWidth:'1000px', //required
    GridHeight:'600px', //required
    Paging:{
        EnablePaging:true //default to true
    },
    Slider:{
        EnableSlider:true, //default to true
        Values:{
            UseDefaultValues:true, //default to true
            SliderWidth:300,
            MinValue:10,
            MaxValue:100,
            StepValue:10,
            InitialValue:10,

        }
    },
    GridHeader:'New Race Cars - 2020',
    Columns:[
            {
                header:{text:"Make"},
                dataProperty:"make",
                dataType:'number',
                preSortColumn: false,
            },
            {
                header:{text:"Model"},
                dataProperty:"model",
                dataType:'number',
                preSortColumn: false
            },
            {
                header:{text:"Year"},
                dataProperty:"year",
                dataType:'number',
                preSortColumn: false
            },
            {
                header:{text:"Trim"},            
                dataProperty:"trim",
                dataType:'number',
                preSortColumn: false,
            },
            {
                header:{text:"Color"},            
                dataProperty:"color",
                dataType:'number',
                preSortColumn: false,
                width:'450px'
            }            
        ]
}

export default gridConfig;