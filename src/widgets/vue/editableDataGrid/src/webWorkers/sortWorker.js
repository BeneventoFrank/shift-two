export default () => {
    let message = ''
    let originalData = []
    let columns = []
    let sortStrategy=''

  
    const sortDataset = (strategy, dataset, dataType) => {
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
                    tmp = dataset.sort(function (a, b) {return ('' + a.data[column].toString().toLowerCase().localeCompare(b.data[column].toLowerCase()));})
                    break;
                case 'number':
                    tmp = dataset.sort(function (a, b) {return (a.data[column] - b.data[column])})
                    break;            
                default:
                    break;
            }
        } else {
            switch (dataType) {
                case 'string':
                    tmp = dataset.sort(function (a, b) {return ('' + b.data[column].toString().toLowerCase().localeCompare(a.data[column].toString().toLowerCase()));})
                    break;
                case 'number':
                    tmp = dataset.sort(function (a, b) {return (b.data[column] - a.data[column])})
                    break;            
                default:
                    break;
            }
        }
        return tmp
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
        
        let split='',index=0, data=[]
        switch (message.MessageType) {
            case 'data':
                originalData = message.Data
                columns = message.Columns
                break;
            case 'applySort':
                sortStrategy = message.SortStrategy 
                split = sortStrategy.split('^^')
                index = split[0]
                postMessage({'MessageType':'sortComplete', 'Data':sortDataset(sortStrategy, null, getDataType(index)), 'Column':index, 'Strategy':sortStrategy})
                break;
            case 'sortFilteredData':
                sortStrategy = message.SortStrategy
                data = message.Data
                split = sortStrategy.split('^^')
                index = split[0]
                postMessage({'MessageType':'sortComplete', 'Column':index, 'Strategy':sortStrategy,  'Data':sortDataset(sortStrategy, data, getDataType(index))})
                break;
            default:
                break;
        }
    }
}