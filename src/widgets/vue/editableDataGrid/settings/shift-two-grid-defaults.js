let shiftSettings = {
    developmentMode:{
        Enabled:true
    },
    size:{
        GridWidth:'600px', //px value of width
        GridWidthValue:600,
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
        SliderFillColor:'#708090',
        PagingTextColor:'#708090',
        GridTitleColor:'#708090',
        GridHeaderTextColor:'#708090',
        GridRowTextColor:'#708090',
        GridHeaderBackgroundColor:'#F8F8F8',
        GridRowOddBackgroundColor:'#F8F8F8',
        GridRowEvenBackgroundColor:'#FFFFFF',
        ActiveIndicatorColor:'#C3D9F9',
        GridHeaderBorderColor:'#708090',
        FlyoutBackgroundColor:'#F8F8F8',
        FlyoutTextColor:'#708090',
        RowHighlightBackground:'#edeeb4',
        RowHighlightActiveCell:'#dadc8f',

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
