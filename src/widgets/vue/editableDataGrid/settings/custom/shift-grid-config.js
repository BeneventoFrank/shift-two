let shiftSettings = {
    developmentMode:{
        Enabled:false
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
        Text:'Title'
    },
    colorScheme:{
        SliderFillColor:'#4a6b8c',
        PagingTextColor:'#4a6b8c',
        GridTitleColor:'#708090',
        GridHeaderTextColor:'#ffffff',
        GridRowTextColor:'#708090',
        GridHeaderBackgroundColor:'#8a9db2',
        GridRowOddBackgroundColor:'#F8F8F8',
        GridRowEvenBackgroundColor:'#FFFFFF',
        ActiveIndicatorColor:'#57abff',
        GridHeaderBorderColor:'#57abff',
        FlyoutBackgroundColor:'#eaebf1',
        FlyoutTextColor:'#48596a',
        RowHighlightBackground:'#d5d8dc',
        RowHighlightActiveCell:'#c6c9cd',

    },
    columns:[
        {
            ColumnHeader:'Column',
            Index:0,
            Width:'150px',
            WidthValue:150,
            IsUsingACustomWidth:false,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:true                            
        },
        {
            ColumnHeader:'Column',
            Index:1,
            Width:'150px',
            WidthValue:150,
            IsUsingACustomWidth:false,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:false                            
        },
        {
            ColumnHeader:'Column',
            Index:2,
            Width:'150px',
            WidthValue:150,
            IsUsingACustomWidth:false,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:false                            
        },
        {
            ColumnHeader:'Column',
            Index:3,
            Width:'150px',
            WidthValue:150,
            IsUsingACustomWidth:false,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:false                            
        },

    ]
}
export default shiftSettings
