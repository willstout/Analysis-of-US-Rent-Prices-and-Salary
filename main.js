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
    let averageRentPerZipCode = await loadFile('averageRentPerZipCode.csv');
    let cityCoordinates = await loadFile('cityCoordinates.csv');
    let localIncomeTaxRates = await loadFile('localIncomeTaxRates.csv');
    let salaryPerJobPerCity = await loadFile('salaryPerJobPerCity.csv');
    let stateIncomeTaxRates = await loadFile('stateIncomeTaxRates.csv');
    let zipCodePerCity = await loadFile('zipCodePerCity.csv');

    return {
        'averageRentPerZipCode': averageRentPerZipCode,
        'cityCoordinates': cityCoordinates,
        'localIncomeTaxRates': localIncomeTaxRates,
        'salaryPerJobPerCity': salaryPerJobPerCity,
        'stateIncomeTaxRates': stateIncomeTaxRates,
        'zipCodePerCity': zipCodePerCity
    };
}