export default () => {
    let message = ''
    let originalData = []
    let filteredData = []
    let virtualColumns = null
    let filterStrategy = {}
    const filterDS = (ds,strategy,runningMode)=>{
        const strat = strategy.split('^^')
        const col = strat[0]
        const keyword = strat[1]
        let tmp = []
        let count = 0
        let updateCount = 1
        for (let i = ds.length-1; i >= 0 ; i--) {
            if(ds[i][virtualColumns[col].dataProperty].includes(keyword)){
                count++
                tmp.push(ds[i])
            } 
            updateCount++
            if(updateCount > 2500){
                if(runningMode!='silent'){
                    postMessage({'MessageType':'countUpdate','Count':count})
                }
                updateCount = 0
            }
        }
        if(runningMode!='silent'){
            filteredData = []
            filteredData = tmp
            postMessage({'MessageType':'filterResults', 'Column':col, 'Data':filteredData})
        } else {
            return tmp
        }
    }

    onmessage = (event)=>{ 
        message = event.data 
        let tmp = []
        console.log("reverse filter received a message ", message)
        switch (message.MessageType) {
            case 'data':
                originalData = message.Data.splice(Math.ceil(message.Data.length/2),message.Data.length)
                console.log("reverse filter will handle ", originalData.length)
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
                postMessage({'MessageType':'countUpdate','Count':0})
                filterDS(tmp, message.Strategy)
                postMessage({'MessageType':'filterTerminated'})        
                break;
            case 'applyAllFilters':
                filterStrategy = message.Strategy
                tmp = originalData
                for (let i = 0; i < filterStrategy.filters.length; i++) {
                    tmp = filterDS(tmp,filterStrategy.filters[i],'silent')
                }
                filteredData = tmp
                postMessage({'MessageType':'allFiltersApplied', 'Data':tmp})
                postMessage({'MessageType':'filterTerminated'})        
                break;
            case 'returnInitialData':
                postMessage({'MessageType':'originalData', 'Data':originalData})
                postMessage({'MessageType':'filterTerminated'})        
                break;
            default:
                break;
        }
        
    }
}