
let gridConfig =  {
    EnablePaging:true,
    GridHeader:'New Race Cars - 2020',
    Columns:[
            {
                header:{text:"Make"},
                dataProperty:"make"
            },
            {
                header:{text:"Model"},
                dataProperty:"model"

            },
            {
                header:{text:"Year"},
                dataProperty:"year"
            },
            {
                header:{text:"Trim"},            
                dataProperty:"trim",
                dataType:'number'
            }                        
        ]
}

export default gridConfig;