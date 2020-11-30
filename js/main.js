loadData().then(data => {

    
    // Creates the view objects
    const map = new Map(data, updateJobType, highlightBubble);
    const bubblechart = new BubbleChart(data, updateJobType, highlightPieChart, toggleRent, toggleTax);
    const buttons = new Buttons(data, updateJobType, toggleRent, toggleTax, highlightBest);

    //Setup bubbleChart space
    
   
    var promises = [
        d3.json("../data/states.json"),
    ]
    Promise.all(promises).then(ready)
        function ready([us]) {
                states = topojson.feature(us, us.objects.states).features;
                map.setupMap(states);
                map.updateMap('Accountant');
                bubblechart.updatePlot('Accountant');
        }
    

    /**
     *
     * @param jobType - String that represents the selected job type
     */
    function updateJobType(jobType) { 
        map.updateMap(jobType);
        bubblechart.updatePlot(jobType);
    }

    /**
     *
     * @param city - String that represents the selected city
     */
    function highlightPieChart(city) {
        //alert("here")
        map.updateCity(city);
    }

    function highlightBubble(city, isOn) {
        if (isOn) {
            map.updateCity(city);
        }
        else {
            map.updateCity("");
        }
        bubblechart.updateCity(city, isOn);
    }

    /**
     *
     * @param isOn - Boolean that reperensents whether rent is toggled or not
     */
    function toggleRent(isOn) {
        map.rentToggle = isOn;
        map.updateMap(map.currentJobType);
        bubblechart.toggleRent(isOn);

    }

    /**
     *
     * @param isOn - Boolean that reperensents whether tax is toggled or not
     */
    function toggleTax(isOn) {
        map.taxToggle = isOn;
        map.updateMap(map.currentJobType);
        bubblechart.toggleTax(isOn);
    }

    /**
     *
     * @param isOn - Boolean that reperensents whether the top picks are highlighted or not
     */
    function highlightBest(isOn) {
        bubblechart.highlightBest(isOn);

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
        'averageRentPerCity': averageRentPerCity,
    };
}
