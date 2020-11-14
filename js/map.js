class Map {
    /**
     * Creates a Map Object
     * @param updateTable a callback function used to notify other parts of the program when a set of bubbles is selected
     * 
     */
    constructor(data, updateMap) {
        this.updateMap = updateMap;
        this.data = data
    }

    /**
     * Gives table header stuff and lines
     */
    setupMap() {
        var that = this;
        var svg = d3.select("#mapsvg")
            .attr("width", 1280)
            .attr("height", 900);

        
        var projection = d3.geoAlbers();         
        var path = d3.geoPath();

        var promises = [
            d3.json("../data/states.json"),
        ]
        Promise.all(promises).then(ready)

            function ready([us]) {
            
                svg.append("g")
                    .attr("class", "counties")
                    .selectAll("path")
                    .data(topojson.feature(us, us.objects.states).features)
                    .enter()
                    .append("path")
                    .attr("fill", function(d) { 
                        return 'lightblue';
                    })
                    .attr("d", path)
                    .attr("transform", "scale(1)")
                    .style("stroke", "black")
                    .style("stroke-width", .8);

                // svg.append("circle")
                //     .attr("r", 2)
                //     .attr("transform", function(d, i) {
                //         return "translate(" + projection([-106.4,38.2]) + ")";
                //     });
                
                //Final version, but first gotta find all those useable city coordinates
                svg.selectAll("circle")
                    .data(that.data.cityCoordinates)
                    .enter()
                    .append("circle")
                    .attr("r",6)
                    .attr("transform", function(d, i) {
                        return "translate(" + projection([d.Latitude,d.Longitude]) + ") translate(0,0)";
                    });
            }
        
    }
}
