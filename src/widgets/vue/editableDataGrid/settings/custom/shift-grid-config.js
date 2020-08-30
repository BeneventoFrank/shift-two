let shiftSettings = {
    developmentMode:{
        Enabled:true
    },
    size:{
        GridWidth:'900px', //px value of width
        GridWidthValue:900,
        GridHeight:'600px', //px value of height
        GridHeightValue:600, //int value used for calculations
    },
    header:{
        Enabled:true
    },
    rows:{
        Height:'30px', //Change at own risk
        HeightValue:30, //Change at own risk
        HighlightRowEnabled:'true',
    },
    slider:{ //Change at own risk
        Enabled:true,
        SliderWidth:300,
        MinValue:100,
        MaxValue:1000,
        StepValue:100,
        InitialValue:100
    },
    pagination:{ //Change at own risk
        Enabled:true, 
        MinRecordsViewable:0,
        MaxRecordsViewable:0,
        TotalNumberOfRecords:0,
        PageNumberCurrentlyViewing:0,        
        MaxPageNumberPossible:0,
        NumberOfApplicibleRowsPerPage:0,
        InitialNumberOfRowsPerPage:0
    },
    title:{
        Enabled:'true',
        Text:'My Title'
    },
    colorScheme:{
        SliderFillColor:'#206ebc',
        PagingTextColor:'#708090',
        GridTitleColor:'#4d9c30',
        GridHeaderTextColor:'#dee3e8',
        GridRowTextColor:'#708090',
        GridHeaderBackgroundColor:'#327e16',
        GridRowOddBackgroundColor:'#F8F8F8',
        GridRowEvenBackgroundColor:'#FFFFFF',
        ActiveIndicatorColor:'#0e58c8',
        GridHeaderBorderColor:'#0863bf',
        FlyoutBackgroundColor:'#c71a1a',
        FlyoutTextColor:'#c1ccd7',
        RowHighlightBackground:'#8fdbd2',
        RowHighlightActiveCell:'#629dd0',

    },
    columns:[
        {
            ColumnHeader:'Daniel',
            Index:0,
            Width:'350px',
            WidthValue:350,
            IsUsingACustomWidth:true,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:true                            
        },
        {
            ColumnHeader:'Column',
            Index:1,
            Width:'100px',
            WidthValue:100,
            IsUsingACustomWidth:false,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:false                            
        },
        {
            ColumnHeader:'Header',
            Index:2,
            Width:'250px',
            WidthValue:250,
            IsUsingACustomWidth:true,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:false                            
        },
        {
            ColumnHeader:'Column',
            Index:3,
            Width:'100px',
            WidthValue:100,
            IsUsingACustomWidth:false,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:false                            
        },
        {
            ColumnHeader:'Column',
            Index:4,
            Width:'100px',
            WidthValue:100,
            IsUsingACustomWidth:undefined,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:false                            
        },

    ]
}
export default shiftSettings
