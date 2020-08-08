export default () => {
    let message = ''
    let originalData = []
    let virtualColumns = []
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
        for (let i = 0; i < virtualColumns.length; i++) {
              let tmpAsc = originalData.slice(0,originalData.length)
              let tmpDesc = originalData.slice(0,originalData.length)
    
              sortedData[virtualColumns[i].dataProperty]= {}
              sortedData[virtualColumns[i].dataProperty].asc = sortDataset(`${virtualColumns[i].dataProperty}^^asc`,tmpAsc, virtualColumns[i].dataType)
              sortedData[virtualColumns[i].dataProperty].desc = sortDataset(`${virtualColumns[i].dataProperty}^^desc`,tmpDesc, virtualColumns[i].dataType)
        }
    }

    const getDataType = (index) => {
        for (let i = 0; i < virtualColumns.length; i++) {
            if(virtualColumns[i].dataProperty===index){
                return virtualColumns[i].dataType
            }
        }
        return 'string'

    }

    onmessage = (event)=>{ 
        message = event.data 
        console.log("forward filter received a message ", message)
        
        let split='',property='',direction='', data=[]

        switch (message.MessageType) {
            case 'data':
                originalData = message.Data
                virtualColumns = message.Columns
                sortAllColumns()
                break;
            case 'applySort':
                sortStrategy = message.SortStrategy //should come in as dataProperty^^direction
                split = sortStrategy.split('^^')
                property = split[0]
                direction = split[1]
                console.log('sending back ', sortedData[property][direction])
                postMessage({'MessageType':'dataSorted', 'Data':sortedData[property][direction], 'Column':property})
                break;
            case 'sortFilteredData':
                sortStrategy = message.SortStrategy 
                data = message.Data
                split = sortStrategy.split('^^')
                property = split[0]
                postMessage({'MessageType':'dataSorted', 'Column':property, 'Data':sortDataset(sortStrategy, data, getDataType(property))})
                break;
            default:
                break;
        }
    }
}