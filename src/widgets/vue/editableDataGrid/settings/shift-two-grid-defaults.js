let shiftSettings = {
    developmentMode:{
        Enabled:false
    },
    size:{
        GridWidth:'2500px', //px value of width
        GridWidthValue:2500,
        GridHeight:'1000px', //px value of height
        GridHeightValue:1000, //int value used for calculations
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
        Enabled:false,
        SliderWidth:300,
        MinValue:10,
        MaxValue:100,
        StepValue:10,
        InitialValue:100
    },
    pagination:{ //Change at own risk
        Enabled:false, 
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
        Text:'US Cities 2020'
    },
    colorScheme:{
        SliderFillColor:'#5f646d',
        PagingTextColor:'#5f646d',
        GridTitleColor:'#394151',
        GridHeaderTextColor:'#eef1f6',
        GridRowTextColor:'#324253',
        GridHeaderBackgroundColor:'#394151',
        GridRowOddBackgroundColor:'#d4d6d9',
        GridRowEvenBackgroundColor:'#d9dde3',
        ActiveIndicatorColor:'#6a7995',
        GridHeaderBorderColor:'#708090',
        FlyoutBackgroundColor:'#6a7995',
        FlyoutTextColor:'#6a7995',
        RowHighlightBackground:'#d3dff3',
        RowHighlightActiveCell:'#c0cde3',

    },
    columns:[
        {
            ColumnHeader:'Not sure which one this is',
            Index:0,
            Width:'250px',
            WidthValue:250,
            IsUsingACustomWidth:true,
            Alignment:'flex-start',
            DataType:'string',
            IsPreSortEnabled:false                            
        },
        {
            ColumnHeader:'Josh',
            Index:1,
            Width:'111px',
            WidthValue:111,
            IsUsingACustomWidth:false,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:false                            
        },
        {
            ColumnHeader:'Column',
            Index:2,
            Width:'111px',
            WidthValue:111,
            IsUsingACustomWidth:false,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:false                            
        },
        {
            ColumnHeader:'Column',
            Index:3,
            Width:'111px',
            WidthValue:111,
            IsUsingACustomWidth:false,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:false                            
        },
        {
            ColumnHeader:'Column',
            Index:4,
            Width:'111px',
            WidthValue:111,
            IsUsingACustomWidth:false,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:false                            
        },
        {
            ColumnHeader:'Column',
            Index:5,
            Width:'900px',
            WidthValue:900,
            IsUsingACustomWidth:true,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:false                            
        },
        {
            ColumnHeader:'Column',
            Index:6,
            Width:'111px',
            WidthValue:111,
            IsUsingACustomWidth:false,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:false                            
        },
        {
            ColumnHeader:'Column',
            Index:7,
            Width:'111px',
            WidthValue:111,
            IsUsingACustomWidth:false,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:false                            
        },
        {
            ColumnHeader:'Franks Cities',
            Index:8,
            Width:'350px',
            WidthValue:350,
            IsUsingACustomWidth:true,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:false                            
        },
        {
            ColumnHeader:'Column',
            Index:9,
            Width:'111px',
            WidthValue:111,
            IsUsingACustomWidth:false,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:false                            
        },
        {
            ColumnHeader:'Column',
            Index:10,
            Width:'111px',
            WidthValue:111,
            IsUsingACustomWidth:false,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:false                            
        },
        {
            ColumnHeader:'Column',
            Index:11,
            Width:'111px',
            WidthValue:111,
            IsUsingACustomWidth:false,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:false                            
        },

    ]
}
export default shiftSettings
