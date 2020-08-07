export default () => {
    let message = ''
    let originalData = []
    let virtualColumns = []
    let sortedData={}

  
    const sortDataset = (strategy, dataset) => {
        const setValue = (value)=>{return value?value:''}
        console.log(strategy)
        let sort = strategy.split('^^')
        let column = sort[0]             
        let sortDirection = sort[1]             
        console.log('that equals', column, ' and ', sortDirection)
        let tmp = []
        if(sortDirection==="asc")
        {
            console.log('here i go asc on my own')
            tmp = dataset.sort(function (a, b) {return ('' + setValue(a[column]).toLowerCase()).localeCompare(setValue(b[column]).toLowerCase());})
        } else {
            console.log('going down the only road i know')
            tmp = dataset.sort(function (a, b) {return ('' + setValue(b[column]).toLowerCase()).localeCompare(setValue(a[column]).toLowerCase());})
        }
        return tmp
    }


    const sortAllColumns = ()=>{
        let tmp = originalData.slice(0,originalData.length-1)
        for (let i = 0; i < virtualColumns.length; i++) {
              sortedData[virtualColumns[i].columnIndex]= {}
              sortedData[virtualColumns[i].columnIndex].asc = sortDataset(`${virtualColumns[i].columnIndex}^^asc`,tmp)
              sortedData[virtualColumns[i].columnIndex].desc = sortDataset(`${virtualColumns[i].columnIndex}^^desc`,tmp)
        }
    }

    onmessage = (event)=>{ 
        message = event.data 
        console.log("forward filter received a message ", message)
        switch (message.MessageType) {
            case 'data':
                originalData = message.Data
                console.log('sort', originalData.length)
                virtualColumns = message.Columns
                console.log('sort got these columns ', virtualColumns )
                sortAllColumns()
                console.log(sortedData)
                break;
            case '':
                break;
            default:
                break;
        }
    }
}