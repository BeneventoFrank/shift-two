
let gridConfig =  {
    GridWidth:'700px', //required
    GridHeight:'950px', //required
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


        // SliderFillColor:'#3a4a4a',
        // PagingTextColor:'#3a4a4a',
        // GridTitleColor:'#6a7575',
        // GridHeaderTextColor:'#e4f0f0',
        // GridRowTextColor:'#52504f',
        // GridHeaderBackgroundColor:'#20838a',
        // GridHeaderBorderColor:'#181c1c',
        // GridRowOddBackgroundColor:'#aebdbd',
        // GridRowEvenBackgroundColor:'#e6f5f5',
        // ActiveIndicatorColor:'#c7c3c1',
        // FlyoutBackgroundColor:'#e8683a',
        // FlyoutTextColor:'#faf3f0'


        // SliderFillColor:'#e8683a',
        // PagingTextColor:'green',
        // GridTitleColor:'#ba4920',
        // GridHeaderTextColor:'#faf3f0',
        // GridRowTextColor:'#52504f',
        // GridHeaderBackgroundColor:'#e8683a',
        // GridHeaderBorderColor:'green',
        // GridRowOddBackgroundColor:'#d6c0b6',
        // GridRowEvenBackgroundColor:'#fae9e1',
        // ActiveIndicatorColor:'#c7c3c1',
        // FlyoutBackgroundColor:'#e8683a',
        // FlyoutTextColor:'#faf3f0'


        SliderFillColor:'#495973',
        PagingTextColor:'#495973',
        GridTitleColor:'#495973',
        GridHeaderTextColor:'white',
        GridRowTextColor:'#495973',
        GridHeaderBackgroundColor:'#626d80',
        GridHeaderBorderColor:'white',
        GridRowOddBackgroundColor:'#e6ebf5',
        GridRowEvenBackgroundColor:'#c7ccd6',
        ActiveIndicatorColor:'#c2c5d1',
        FlyoutBackgroundColor:'#f0f1f5',
        FlyoutTextColor:'#495973'
    },
    GridHeader:'New Race Cars - 2020',
    Columns:[
            {
                header:{text:"Make"},
                dataProperty:"make",
                dataType:'number',
                preSortColumn: false
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
                preSortColumn: true
            },
            {
                header:{text:"Color"},            
                dataProperty:"color",
                dataType:'number',
                preSortColumn: true
            }            
        ]
}

export default gridConfig;