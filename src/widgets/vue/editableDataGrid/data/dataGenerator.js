

const generateData = (numCols)=>{
    const rawData = ['Alexander City','Andalusia','Anniston','Athens','Atmore','Auburn','Bessemer','Birmingham','Chickasaw','Clanton','Cullman','Decatur','Demopolis','Dothan','Enterprise','Eufaula','Florence','Fort Payne','Gadsden','Greenville','Guntersville','Huntsville','Jasper','Marion','Mobile','Montgomery','Opelika','Ozark','Phenix City','Prichard','Scottsboro','Selma','Sheffield','Sylacauga','Talladega','Troy','Tuscaloosa','Tuscumbia','Tuskegee','Alaska','Anchorage','Cordova','Fairbanks','Haines','Homer','Juneau','Ketchikan','Kodiak','Kotzebue','Nome','Palmer','Seward','Sitka','Skagway','Valdez','Arizona','Ajo','Avondale','Bisbee','Casa Grande','Chandler','Clifton','Douglas','Flagstaff','Florence','Gila Bend','Glendale','Globe','Kingman','Lake Havasu City','Mesa','Nogales','Oraibi','Phoenix','Prescott','Scottsdale','Sierra Vista','Tempe','Tombstone','Tucson','Walpi','Window Rock','Winslow','Yuma','Arkansas','Arkadelphia','Arkansas Post','Batesville','Benton','Blytheville','Camden','Conway','Crossett','El Dorado','Fayetteville','Forrest City','Fort Smith','Harrison','Helena','Hope','Hot Springs','Jacksonville','Jonesboro','Little ock','Magnolia','Morrilton','Newport','North Little Rock','Osceola','Pine Bluff','Rogers','Searcy','Stuttgart','Van Buren','West Memphis','California','Alameda','Alhambra','Anaheim','Antioch','Arcadia','Bakersfield','Barstow','Belmont','Berkeley','Beverly Hills','Brea','Buena Park','Burbank','Calexico','Calistoga','Carlsbad','Carmel','Chico','Chula Vista','Claremont','Compton','Concord','Corona','Coronado','Costa Mesa','Culver City','Daly City','Davis','Downey','El Centro','El Cerrito','El Monte','Escondido','Eureka','Fairfield','Fontana','Fremont','Fresno','Fullerton','Garden Grove','Glendale','Hayward','Hollywood','Huntington Beach','Indio','Inglewood','Irvine','La Habra','Laguna Beach','Lancaster','Livermore','Lodi','Lompoc','Long Beach','Los Angeles','Malibu','Martinez','Marysville','Menlo Park','Merced','Modesto','Monterey','Mountain View','Napa','Needles','Newport Beach','Norwalk','Novato','Oakland','Oceanside','Ojai','Ontario','Orange','Oroville','Oxnard','Pacific Grove','Palm Springs','Palmdale','Palo Alto','Pasadena','Petaluma','Pomona','Port Hueneme','Rancho Cucamonga','Red Bluff','Redding','Redlands','Redondo Beach','Redwood City','Richmond','Riverside','Roseville','Sacramento','Salinas','San Bernardino','San Clemente','San Diego','San Fernando','San Francisco','San Gabriel','San Jose','San Juan Capistrano','San Leandro','San Luis Obispo','San Marino','San Mateo','San Pedro','San Rafael','San Simeon','Santa Ana','Santa Barbara','Santa Clara','Santa Clarita','Santa Cruz','Santa Monica','Santa Rosa','Sausalito','Simi Valley','Sonoma','South San Francisco','Stockton','Sunnyvale','Susanville','Thousand Oaks','Torrance','Turlock','Ukiah','Vallejo','Ventura','Victorville','Visalia','Walnut Creek','Watts','West Covina','Whittier','Woodland','Yorba Linda','Yuba City','Colorado','Alamosa','Aspen','Aurora','Boulder','Breckenridge','Brighton','Canon City','Central City','Climax','Colorado prings','Cortez','Cripple Creek','Denver','Durango','Englewood','Estes Park','Fort Collins','Fort Morgan','Georgetown','Glenwood Springs','Golden','Grand Junction','Greeley','Gunnison','La Junta','Leadville','Littleton','Longmont','Loveland','Montrose','Ouray','Pagosa Springs','Pueblo','Silverton','Steamboat Springs','Sterling','Telluride','Trinidad','Vail','Walsenburg','Westminster','Connecticut','Ansonia','Berlin','Bloomfield','Branford','Bridgeport','Bristol','Coventry','Danbury','Darien','Derby','East artford','East Haven','Enfield','Fairfield','Farmington','Greenwich','Groton','Guilford','Hamden','Hartford','Lebanon','Litchfield','Manchester','Mansfield','Meriden','Middletown','Milford','Mystic','Naugatuck','New ritain','New Haven','New London','North Haven','Norwalk','Norwich','Old Saybrook','Orange','Seymour','Shelton','Simsbury','Southington','Stamford','Stonington','Stratford','Torrington','Wallingford','Waterbury','Waterford','Watertown','West Hartford','West Haven','Westport','Wethersfield','Willimantic','Windham','Windsor','Windsor Locks','Winsted','Delaware','Dover','Lewes','Milford','New Castle','Newark','Smyrna','Wilmington']
        
    const getRandomData = ()=>{
        let index= Math.floor(Math.random() * rawData.length) + 1       
        let data = rawData[index]
        if(data===undefined){

            let flag=true
            while (flag) {
                index= Math.floor(Math.random() * rawData.length) + 1       
                data = rawData[index]
                if(data != undefined){
                    flag=false
                }
            }
        }

        
        return data
    }

     let rows = Math.floor(Math.random() * 150000) + 1 
    
    console.log('hey we are generatng -----------------------------------------',rows)  
    let cols = numCols
    let data = []
    let dataArray = []
    for (let i = 1; i <=rows; i++) {
        dataArray= []
        for (let j = 0; j < cols; j++) {
            dataArray.push(getRandomData())
        }
        data.push(
            {
                rowIndex:i,
                data:dataArray
            }
        )
    }
    let fakeRow = []
    for (let j = 0; j < cols; j++) {
        fakeRow.push('HiddensVille')
    }
    data.push( {rowIndex:data.length, data:fakeRow} )
    data.push( {rowIndex:data.length, data:fakeRow} )
    data.push( {rowIndex:data.length, data:fakeRow} )

    return data
}

export default generateData