export default () => {
    let message = ''
    let originalData = []
    let columns = []
    let sortedData={}
    let sortStrategy=''

  
    const sortDataset = (strategy, dataType) => {
        const setValue = (value)=>{return value?value:''}
        let sort = strategy.split('^^')
        let index = sort[0]
        let sortDirection = sort[1]             
        let tmp = []
        if(sortDirection==="asc")
        {
            switch (dataType) {
                case 'string':
                    tmp = originalData.sort(function (a, b) {return ('' + setValue(a.data[index].toString()).toLowerCase()).localeCompare(setValue(b.data[index].toString()).toLowerCase());})
                    break;
                case 'number':
                    tmp = originalData.sort(function (a, b) {return (a.data[index] - b.data[index])})
                    break;            
                default:
                    break;
            }
        } else {
            switch (dataType) {
                case 'string':
                    tmp = originalData.sort(function (a, b) {return ('' + setValue(b.data[index].toString()).toLowerCase()).localeCompare(setValue(a.data[index].toString()).toLowerCase());})
                    break;
                case 'number':
                    tmp = originalData.sort(function (a, b) {return (b.data[index] - a.data[index])})
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
                    sortedData[columns[i].Index]= {}
                    sortedData[columns[i].Index].asc = sortDataset(`${columns[i].Index}^^asc`, columns[i].DataType)
                    sortedData[columns[i].Index].desc = sortDataset(`${columns[i].Index}^^desc`, columns[i].DataType)
                }
        }
        postMessage({'MessageType':'dataSorted', 'Data':sortedData })
        postMessage({'MessageType':'sortTerminated'})
    }

    const getDataType = (index) => {
        for (let i = 0; i < columns.length; i++) {
            if(columns[i].Index===index){
                return columns[i].DataType.length>0?columns[i].DataType:'string'
            }
        }
        return 'string'

    }
    onmessage = (event)=>{ 
        message = event.data 
        let split='',index=0,direction='', data=[]
        let retVal=[]
        switch (message.MessageType) {
            case 'data':
                columns = message.Columns
                originalData = message.Data
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