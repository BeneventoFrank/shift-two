let shiftSettings = {
    developmentMode:{
        Enabled:false
    },
    size:{
        GridWidth:'800px', //px value of width
        GridWidthValue:800,
        GridHeight:'450px', //px value of height
        GridHeightValue:450, //int value used for calculations
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
            ColumnHeader:'name',
            Index:0,
            Width:'222px',
            WidthValue:222,
            IsUsingACustomWidth:true,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:true                            
        },
        {
            ColumnHeader:'address',
            Index:1,
            Width:'250px',
            WidthValue:250,
            IsUsingACustomWidth:true,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:false                            
        },
        {
            ColumnHeader:'Column',
            Index:2,
            Width:'15px',
            WidthValue:15,
            IsUsingACustomWidth:false,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:false                            
        },
        {
            ColumnHeader:'Column',
            Index:3,
            Width:'15px',
            WidthValue:15,
            IsUsingACustomWidth:false,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:false                            
        },
        {
            ColumnHeader:'Column',
            Index:4,
            Width:'298px',
            WidthValue:298,
            IsUsingACustomWidth:true,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:false                            
        },

    ]
}
export default shiftSettings
