export default () => {
    let message = ''
    let originalData = []
    let filteredData = []
    let filterStrategy = {}
    const filterDS = (ds,strategy,runningMode)=>{
        const strat = strategy.split('^^')
        const col = strat[0]
        const keyword = strat[1]
         let tmp = []
         console.log('ds..........................................................', ds)
        for (let i = 0; i <= ds.length-1; i++) {
            if(ds[i].data[col].toString().toLowerCase().includes(keyword.toLowerCase())){
                tmp.push(ds[i])
            } 
        }
        if(runningMode!='silent'){
            filteredData = []
            filteredData = tmp
            postMessage({'MessageType':'filterResults', 'Column':col, 'Filter':strategy, 'Data':filteredData})
        } else {
            return tmp
        }
    }

    onmessage = (event)=>{ 
        message = event.data 
        let tmp = []
        console.log("forward filter received a message ", message)
        switch (message.MessageType) {
            case 'data':
                originalData = message.Data
                console.log('forward filter will handle ', originalData.length)
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