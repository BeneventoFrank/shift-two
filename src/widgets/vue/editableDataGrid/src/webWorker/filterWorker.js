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

        for (let i = 0; i < ds.length; i++) {
            if(ds[i][virtualColumns[col].dataProperty].includes(keyword)){
                count++
                tmp.push(ds[i])
            } 
            updateCount++
            if(updateCount > 4000){
                if(runningMode!='silent'){
                    postMessage({'MessageType':'countUpdate','Count':count})
                }
                updateCount = 0
            }
        }
        

        if(runningMode!='silent'){
            filteredData = []
            filteredData = tmp
            if(count>1000)
            {
                postMessage({'MessageType':'filterToShort', 'Column':col, 'Count':count,'Data':filteredData })
            } else {
                postMessage({'MessageType':'filterResults', 'Column':col, 'Data':filteredData})
            }
        } else {
            return tmp
        }
        postMessage({'MessageType':'filterTerminated'})
    }

    onmessage = (event)=>{ 
        message = event.data 
        let tmp = []
        switch (message.MessageType) {
            case 'data':
                originalData = message.Data
                virtualColumns = message.Columns
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
                break;
            case 'returnInitialData':
                postMessage({'MessageType':'originalData', 'Data':originalData})
                break;
            default:
                break;
        }
    }
}