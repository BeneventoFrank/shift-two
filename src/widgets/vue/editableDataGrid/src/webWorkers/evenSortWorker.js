export default () => {
    let message = ''
    let originalData = []
    let columns = []
    let sortedData={}
  
    const sortDataset = (strategy, dataType) => {
        let sort = strategy.split('^^')
        let index = sort[0]
        let sortDirection = sort[1]             
        let tmp = []
        let copy = []
        if(sortDirection==="asc")
        {
            switch (dataType) {
                case 'string':
                    copy = originalData.slice()
                    tmp = copy.sort(function (a, b) {return ('' + a.data[index].toString().toLowerCase().localeCompare(b.data[index].toString().toLowerCase()))})
                    break;
                case 'number':
                    copy = originalData.slice()
                    tmp = copy.sort(function (a, b) {return (a.data[index] - b.data[index])})
                    break;            
                default:
                    break;
            }
        }
         return tmp
    }
    const sortAllColumns = ()=>{
        let copy = []
        for (let i = 0; i <= columns.length; i=i+2) {
            
            if(columns[i]&&!columns[i].IsUsingCustomComponent&&columns[i].IsPreSortEnabled){
                sortedData[columns[i].Index]= {}
                sortedData[columns[i].Index].asc = sortDataset(`${columns[i].Index}^^asc`, columns[i].DataType)
                copy = sortedData[columns[i].Index].asc.slice()
                sortedData[columns[i].Index].desc = copy.reverse()
            }
        }
        postMessage({'MessageType':'dataSorted', 'Data':sortedData })
        postMessage({'MessageType':'sortTerminated'})
    }

    onmessage = (event)=>{ 
        message = event.data 
        switch (message.MessageType) {
            case 'data':
                columns = message.Columns
                originalData = message.Data
                sortAllColumns()
                break;

            default:
                break;
        }
    }
}