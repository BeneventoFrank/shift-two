
let gridConfig =  {
    GridWidth:'800px', //required
    GridHeight:'600px', //required
    Paging:{
        EnablePaging:true //default to true
    },
    Slider:{
        EnableSlider:true, //default to true
        Values:{
            UseDefaultValues:true, //default to true
            // SliderWidth:300,
            // MinValue:10,
            // MaxValue:100,
            // StepValue:10,
            // InitialValue:10,
        }
    },
    ColorScheme:{
        // SliderFillColor:'blue',
        // PagingTextColor:'green',
        // GridTitleColor:'magenta',
        // GridHeaderTextColor:'cyan',
        // GridRowTextColor:'orange',
        // GridHeaderBackgroundColor:'grey',
        // GridHeaderBorderColor:'pink',
        // GridRowOddBackgroundColor:'purple',
        // GridRowEvenBackgroundColor:'lavender',
        // ActiveIndicatorColor:'brown',
        // FlyoutBackgroundColor:'rosybrown',
        // FlyoutTextColor:'gold'
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
                preSortColumn: true
            },
            {
                header:{text:"Trim"},            
                dataProperty:"trim",
                dataType:'number',
                preSortColumn: true,
            },
            {
                header:{text:"Color"},            
                dataProperty:"color",
                dataType:'number',
                preSortColumn: true,
                width:'250px'
            }            
        ]
}

export default gridConfig;