export default () => {
    let message = ''
    let originalData = []
    let filteredData = []
    let virtualColumns = null



    const filterDS = (ds,strategy)=>{
        const strat = strategy.split('^^')
        const col = strat[0]
        const keyword = strat[1]
        let tmp = []
        let count = 0
        let updateCount = 1

        for (let i = 0; i < ds.length; i++) {
            if(ds[i][virtualColumns[col].dataProperty].includes(keyword)){
                count++
                tmp.push(ds[i])
            } 
            updateCount++
            if(updateCount > 4000){
                postMessage({'MessageType':'countUpdate','Count':count})
                updateCount = 0
            }
        }
        filteredData = []
        filteredData = tmp

        if(count>1000)
        {
            postMessage({'MessageType':'filterToShort', 'Column':col, 'Count':count,'Data':filteredData })
        } else {
            postMessage({'MessageType':'filterResults', 'Column':col, 'Data':filteredData})
        }
    }

    onmessage = (event)=>{ 
        message = event.data 
        let tmp 
        console.log("received a message ", message)
        switch (message.MessageType) {
            case 'data':
                originalData = message.Data
                virtualColumns = message.Columns
                break;
            case 'filter':
                if(message.IsCurrentlyFiltering){
                    console.log("using filteredData")
                    tmp = filteredData
                } else {
                    console.log("using original data")
                    tmp = originalData
                }
                filterDS(tmp, message.Strategy)
                break;
            default:
                break;
        }
    }
}