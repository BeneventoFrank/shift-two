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
        for (let i = ds.length-1; i >= 0 ; i--) {
            if(ds[i].data[col].toString().toLowerCase().includes(keyword.toLowerCase())){
                console.log('hit - pushing')
                tmp.push(ds[i])
            } 
        }
        if(runningMode!='silent'){
            filteredData = []
            filteredData = tmp
            postMessage({'MessageType':'filterResults', 'Column':col, 'Filter':strategy, 'Data':filteredData})
            postMessage({'MessageType':'filterTerminated'})
        } else {
            return tmp
        }
    }

    onmessage = (event)=>{ 
        message = event.data 
        let tmp = []
        switch (message.MessageType) {
            case 'data':
                originalData = message.Data
                break;
            case 'filter':
                if(message.IsCurrentlyFiltering){
                    tmp = filteredData
                } else {
                    tmp = originalData
                }
                 filterDS(tmp, message.Strategy)
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
                break;
            default:
                break;
        }
    }
}