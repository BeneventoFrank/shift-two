
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
                dataProperty:"trim"
            }                        
        ]
}

export default gridConfig;