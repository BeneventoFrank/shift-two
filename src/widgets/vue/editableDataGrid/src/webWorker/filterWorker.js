export default () => {
    let message = ''
    let originalData = []
    let filteredData = []
    let virtualColumns = null
    let isFiltering = false


    const filterDS = (ds,strategy)=>{
        const strat = strategy.split('^^')
        const col = strat[0]
        const keyword = strat[1]

        let count = 0
        for (let i = 0; i < ds.length; i++) {
            if(ds[i][virtualColumns[col].dataProperty].includes(keyword)){
                if(keyword.length<3)
                {
                    count++
                    filteredData.push(ds[i])
                } else {
                    filteredData.push(ds[i])
                }
                isFiltering = true
            }   
        }
        if(count>1000)
        {
            postMessage({'MessageType':'filterToShort','Count':count, 'Data':filteredData})
        } else {
            postMessage({'MessageType':'filterResults','Data':filteredData})
        }

    }

    onmessage = (event)=>{ 
        message = event.data 

        if(message.MessageType==='data')
        {
            originalData = message.Data
            console.log("set original data to ", originalData)
            virtualColumns = message.Columns
        } else if(message.MessageType === 'filter') { 
            let tmp 
            if(isFiltering){
                console.log("is filtering???")
                tmp = filteredData
            } else {
                console.log('using orignal data')
                tmp = originalData
            }
            console.log(tmp, message.Strategy)
            filterDS(tmp, message.Strategy)
        }

    }
}