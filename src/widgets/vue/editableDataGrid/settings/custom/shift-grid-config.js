let shiftSettings = {
    developmentMode:{
        Enabled:true
    },
    slots:{
        LeftOfTitle:'',
        RightOfTitle:''
    },
    events:{
        cellClick:''
    },
    size:{
        GridWidth:'1000px', //px value of width
        GridWidthValue:1000,
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
        MinValue:10,
        MaxValue:100,
        StepValue:10,
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
        Text:'Grid Title'
    },
    colorScheme:{
        SliderFillColor:'#092a6c',
        PagingTextColor:'#092a6c',
        GridTitleColor:'#092a6c',
        GridHeaderTextColor:'#e6e6e6',
        GridRowTextColor:'#324253',
        GridHeaderBackgroundColor:'#455982',
        GridRowOddBackgroundColor:'#e2e2e4',
        GridRowEvenBackgroundColor:'#ededee',
        ActiveIndicatorColor:'#d5e1f6',
        GridHeaderBorderColor:'#708090',
        FlyoutBackgroundColor:'#e3e5e8',
        FlyoutTextColor:'#455982',
        RowHighlightBackground:'#c8c8cb',
        RowHighlightActiveCell:'#dbdbdc',

    },
    columns:[
        {
            ColumnHeader:'Column',
            Index:0,
            Width:'216px',
            WidthValue:216,
            IsUsingACustomWidth:false,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:true,
            IsUsingCustomComponent:false,
            CustomComponentName:''

        },
        {
            ColumnHeader:'Column',
            Index:1,
            Width:'216px',
            WidthValue:216,
            IsUsingACustomWidth:false,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:true,
            IsUsingCustomComponent:false,
            CustomComponentName:''

        },
        {
            ColumnHeader:'Column',
            Index:2,
            Width:'216px',
            WidthValue:216,
            IsUsingACustomWidth:false,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:true,
            IsUsingCustomComponent:false,
            CustomComponentName:''

        },
        {
            ColumnHeader:'Actions',
            Index:3,
            Width:'150px',
            WidthValue:150,
            IsUsingACustomWidth:true,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:true,
            IsUsingCustomComponent:false,
            CustomComponentName:''

        },
        {
            ColumnHeader:'More Actions',
            Index:4,
            Width:'200px',
            WidthValue:200,
            IsUsingACustomWidth:true,
            Alignment:'center',
            DataType:'string',
            IsPreSortEnabled:false,
            IsUsingCustomComponent:true,
            CustomComponentName:'HelloWorld'

        },

    ]
}
export default shiftSettings
