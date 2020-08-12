export default () => {
    let message = ''
    let originalData = []
    let virtualColumns = []
    let sortStrategy=''

  
    const sortDataset = (strategy, dataset, dataType) => {
        const setValue = (value)=>{return value?value:''}
        if(!dataset){
            dataset = originalData
        }
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
        console.log("sort worker received a message ", message)
        
        let split='',property='', data=[]
        switch (message.MessageType) {
            case 'data':
                originalData = message.Data
                virtualColumns = message.Columns
                break;
            case 'applySort':
                sortStrategy = message.SortStrategy //should come in as dataProperty^^direction
                split = sortStrategy.split('^^')
                property = split[0]
                postMessage({'MessageType':'sortComplete', 'Data':sortDataset(sortStrategy, null, getDataType(property)), 'Column':property, 'Strategy':sortStrategy})
                break;
            case 'sortFilteredData':
                console.log("wtf ", message.SortStrategy)
                sortStrategy = message.SortStrategy
                data = message.Data
                split = sortStrategy.split('^^')
                property = split[0]
                postMessage({'MessageType':'sortComplete', 'Column':property, 'Strategy':sortStrategy,  'Data':sortDataset(sortStrategy, data, getDataType(property))})
                break;
            default:
                break;
        }
    }
}