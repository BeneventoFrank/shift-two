
let gridConfig =  {
    GridWidth:'800px', //required
    GridHeight:'400px', //required
    Paging:{
        EnablePaging:true, //default to true
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
    //GridHeader:'New Race Cars - 2020',
    Columns:[
            {
                header:{text:"Make"},
                dataProperty:"make",
                dataType:'number',
                preSortColumn: true,
            },
            {
                header:{text:"Model"},
                dataProperty:"model",
                dataType:'number',
                preSortColumn: true
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
                preSortColumn: true
            },            
            // {
            //     header:{text:"Manufacturer"},            
            //     dataProperty:"manufacturer",
            // },
            // {
            //     header:{text:"Plant"},            
            //     dataProperty:"plant"
            // },
            // {
            //     header:{text:"Vin"},            
            //     dataProperty:"vin",
            //     dataType:'number'
            // },
            // {
            //     header:{text:"Plate Number"},            
            //     dataProperty:"plateNumber",
            //     dataType:'number'
            // },
            // {
            //     header:{text:"Price"},            
            //     dataProperty:"price",
            //     dataType:'number'
            // }                                    
        ]
}

export default gridConfig;