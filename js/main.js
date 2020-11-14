loadData().then(data => {

    
    // Creates the view objects
    const map = new Map(data, updateMap);


    //Setup bubbleChart space
    map.setupMap();


    /**
     * Callback for table
     *
     * @param category - String that represents the the talking point ("Economy/fiscal issues", "Energy/Environment", etc)
     * @param x and y - The x and y values of things that are highlighted. Will then be sent to table update method
     */
    function updateMap(data) { 
        //map.drawTable(data)
    }

});


/**
 * A file loading function or CSVs
 * @param file
 * @returns {Promise<T>}
 */
async function loadFile(file) {
    let data = await d3.csv(file).then(d => {
        let mapped = d.map(g => {
            for (let key in g) {
                let numKey = +key;
                if (numKey) {
                    g[key] = +g[key];
                }
            }
            return g;
        });
        return mapped;
    });
    return data;
}

async function loadData() {
    let averageRentPerZipCode = await loadFile('../data/averageRentPerZipCode.csv');
    let cityCoordinates = await loadFile('../data/cityCoordinates.csv');
    let localIncomeTaxRates = await loadFile('../data/localIncomeTaxRates.csv');
    let salaryPerJobPerCity = await loadFile('../data/salaryPerJobPerCity.csv');
    let stateIncomeTaxRates = await loadFile('../data/stateIncomeTaxRates.csv');
    let zipCodePerCity = await loadFile('../data/zipCodePerCity.csv');
    let averageRentPerCity = await loadFile('../data/averageRentPerCity.csv');

    return {
        'averageRentPerZipCode': averageRentPerZipCode,
        'cityCoordinates': cityCoordinates,
        'localIncomeTaxRates': localIncomeTaxRates,
        'salaryPerJobPerCity': salaryPerJobPerCity,
        'stateIncomeTaxRates': stateIncomeTaxRates,
        'zipCodePerCity': zipCodePerCity,
        'averageRentPerCity': averageRentPerCity
    };
}
