
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
            }                        
        ]
}

export default gridConfig;