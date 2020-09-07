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
        if(sortDirection==="asc")
        {
            switch (dataType) {
                case 'string':
                    tmp = originalData.sort(function (a, b) {return ('' + a.data[index].toLowerCase().localeCompare(b.data[index].toLowerCase()))})
                    break;
                case 'number':
                    tmp = originalData.sort(function (a, b) {return (a.data[index] - b.data[index])})
                    break;            
                default:
                    break;
            }
        }
         return tmp
    }
    const sortAllColumns = ()=>{
        let tmpRev = []
        for (let i = 1; i <= columns.length; i=i+2) {
            
            if(columns[i]&&columns[i].IsPreSortEnabled){
                tmpRev = []
                console.log('......',i, ' and ',tmpRev, sortedData)
                sortedData[columns[i].Index]= {}
                sortedData[columns[i].Index].asc = sortDataset(`${columns[i].Index}^^asc`, columns[i].DataType)
                
                // for (let j = sortedData[columns[i].Index].asc.length; j>=0 ; j--) {
                //     tmpRev.push(sortedData[columns[i].Index].asc[j])
                    
                // }
                // sortedData[columns[i].Index].desc = tmpRev
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