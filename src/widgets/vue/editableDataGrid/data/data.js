
let gridConfig =  {
    EnablePaging:true,
    GridHeader:'New Race Cars - 2020',
    Columns:[
            {
                header:{text:"Make"},
                dataProperty:"make",
                dataType:'number'
            },
            {
                header:{text:"Model"},
                dataProperty:"model",
                dataType:'number'

            },
            {
                header:{text:"Year"},
                dataProperty:"year",
                dataType:'number'
            },
            {
                header:{text:"Trim"},            
                dataProperty:"trim",
                dataType:'number'
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