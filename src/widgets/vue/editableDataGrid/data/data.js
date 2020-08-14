
let gridConfig =  {
    EnablePaging:true,
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
                preSortColumn: true
            },
            {
                header:{text:"Color"},            
                dataProperty:"color",
            },            
            {
                header:{text:"Manufacturer"},            
                dataProperty:"manufacturer"
            },
            {
                header:{text:"Plant"},            
                dataProperty:"plant"
            },
            {
                header:{text:"Vin"},            
                dataProperty:"vin",
                dataType:'number'
            },
            {
                header:{text:"Plate Number"},            
                dataProperty:"plateNumber",
                dataType:'number'
            },
            {
                header:{text:"Price"},            
                dataProperty:"price",
                dataType:'number'
            }                                    
        ]
}

export default gridConfig;