export default () => {
    let message = ''
    let originalData = []
    let columns = []
    let sortedData={}
    let sortStrategy=''

  
    const sortDataset = (strategy, dataset, dataType) => {
        const setValue = (value)=>{return value?value:''}
        let sort = strategy.split('^^')
        let column = sort[0]             
        let sortDirection = sort[1]             
        let tmp = []
        if(sortDirection==="asc")
        {
            switch (dataType) {
                case 'string':
                    tmp = dataset.sort(function (a, b) {return ('' + setValue(a[column].toString()).toLowerCase()).localeCompare(setValue(b[column].toString()).toLowerCase());})
                    break;
                case 'number':
                    tmp = dataset.sort(function (a, b) {return (a[column] - b[column])})
                    break;            
                default:
                    break;
            }
        } else {
            switch (dataType) {
                case 'string':
                    tmp = dataset.sort(function (a, b) {return ('' + setValue(b[column].toString()).toLowerCase()).localeCompare(setValue(a[column].toString()).toLowerCase());})
                    break;
                case 'number':
                    tmp = dataset.sort(function (a, b) {return (b[column] - a[column])})
                    break;            
                default:
                    break;
            }
        }
        return tmp
    }
    const sortAllColumns = ()=>{
        for (let i = 0; i < columns.length; i=i+2) {
                if(columns[i].IsPreSortEnabled){
                    console.log("WE GOT ONE!")
                    let tmpAsc = originalData.slice(0,originalData.length)
                    let tmpDesc = originalData.slice(0,originalData.length)
                    sortedData[columns[i].Index]= {}
                    sortedData[columns[i].Index].asc = sortDataset(`${columns[i].Index}^^asc`,tmpAsc, columns[i].DataType)
                    sortedData[columns[i].Index].desc = sortDataset(`${columns[i].Index}^^desc`,tmpDesc, columns[i].DataType)
                }
        }
        postMessage({'MessageType':'dataSorted', 'Data':sortedData })
        postMessage({'MessageType':'sortTerminated'})
    }

    const getDataType = (index) => {
        for (let i = 0; i < columns.length; i++) {
            if(columns[i].Index===index){
                return columns[i].DataType
            }
        }
        return 'string'

    }

    onmessage = (event)=>{ 
        message = event.data 
        console.log("sort worker received a message ", message)
        
        let split='',index=0,direction='', data=[]
        let retVal=[]
        switch (message.MessageType) {
            case 'data':
                originalData = message.Data
                columns = message.Columns
                sortAllColumns()
                break;
            case 'applySort':
                sortStrategy = message.SortStrategy //should come in as index^^direction
                split = sortStrategy.split('^^')
                index = split[0]
                direction = split[1]
                
                if(sortedData[index][direction].length>message.Limit){
                    retVal = sortedData[index][direction].slice(0,2)
                } else 
                {
                    retVal = sortedData[index][direction]
                }
                console.log("retval?", retVal)
                postMessage({'MessageType':'dataSorted', 'Data':retVal, 'Column':index})
                break;
            case 'sortFilteredData':
                sortStrategy = message.SortStrategy 
                data = message.Data
                split = sortStrategy.split('^^')
                index = split[0]
                postMessage({'MessageType':'dataSorted', 'Column':index, 'Data':sortDataset(sortStrategy, data, getDataType(index))})
                break;
            default:
                break;
        }
    }
}