class BubbleChart {
    constructor(data, updateJobType, updateCity) {
        this.updateJobType = updateJobType;
        this.updateCity = updateCity;
        this.data = data;

        this.jobTypes = this.data.salaryPerJobPerCity;
        this.jobTypes = Object.keys(this.jobTypes[0]);
        this.jobTypes.splice(0, 2);

        this.cityData = this.data.salaryPerJobPerCity;
        for (let d of this.cityData) {
            for (let job of this.jobTypes) {
                d[job] = +d[job];
            }
            let rent_obj = this.data.averageRentPerCity.find(element => (element.City == d.City & element.State == d.State));
            let tax_obj = this.data.stateIncomeTaxRates.find(element => (element.City == d.City & element.State == d.State));
            d.AvgRent = +rent_obj.AvgRent;
            d.Tax_Rate = tax_obj.Tax_Rate;
            d.Tax_Style = tax_obj.Tax_Style;
        }
        console.log(this.cityData);
        this.drawBackground();
    }

    drawBackground() {
        d3.select('#bubbleChart')
            .select('svg')
            .append('g')
            .classed('background', true)
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 70)
            .attr('height', 740)
            .attr('rx', 35)
            .attr('ry', 35)
            .attr('transform', 'translate(105, 25)');
        
        let svgGroup = d3.select('#bubbleChart').select('svg')
            .append('g')
            .attr('id', 'plotGroup')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('transform', 'translate(140, 20)');

        svgGroup.append('g').attr('id', 'axis');
        svgGroup.append("text").attr("id", "axis-label");
        svgGroup.append('g').attr('id', 'bubbleGroup');
        
    }

    updatePlot(jobType) {
        this.jobType = jobType;
        this.plot();
    }

    plot() {
        let that = this;

        // d3.select('#axis-label')
        //     .text("Average Salary")
        //     .style("text-anchor", "top")
        //     .attr('transform', 'translate(-110, -10)');

        let sMax = d3.max(this.cityData, d=>+d[this.jobType]);
        let sMin = d3.min(this.cityData, d=>+d[this.jobType]>0 ? +d[this.jobType] : Infinity);

        this.axisScale = d3
                        .scaleLinear()
                        .domain([sMax, sMin])
                        .range([40, 710]);

        let ticks = [sMax, sMin];
        let tickValue = sMax - sMax%5000;
        while (tickValue > sMin) {
            ticks.push(tickValue);
            tickValue -= 5000;
        }   

        d3.select("#axis").call(d3.axisLeft(this.axisScale)
                                    .tickPadding(20)
                                    //.tickFormat(d3.format(".2s"))
                                    .tickSize(80)
                                    .tickValues(ticks))
                        .attr('transform', 'translate(40, 0)');

        d3.select('#bubbleChart')
            .append('div')
            .attr("class", "tooltip")
            .style("opacity", 0);
        
        const tooltip = d3.select(".tooltip");
        
        d3.select('#bubbleGroup').selectAll('circle')
                        .data(this.cityData)
                        .join('circle')
                        .attr('cx', 0)
                        .attr('cy', d=>this.axisScale(+d[this.jobType]))
                        .attr('r', 30)
                        .classed('bubble', true)
                        .on("mouseover", function(d) {
                            tooltip
                                .transition()
                                .duration(100)
                                .style("opacity", 1);
                            tooltip
                                .html(that.tooltipRender(d))
                                .style("left", "250px")
                                .style("top", `${+d3.select(this).attr("cy")+160}px`);
                        })
                        .on("mouseleave", function() {
                            tooltip
                                .transition()
                                .duration(100)
                                .style("opacity", 0);
                        })
                        .on("click", function(d){
                            //that.updateCity(d.City);
                        });
        
        d3.select('#axis').raise();
    }

    tooltipRender(data) {
        let text = "<h2>" + data['City'] + ", " + data['State'] + "</h2>";
        return text;
    }

    updateCity(city) {

    }

    toggleRent(isOn) {
        if (isOn) {
            for (let city of this.cityData) {
                for (let job of this.jobTypes) {
                    city[job] -= city.AvgRent;
                }
            }
            this.plot()
        }
        else {
            for (let city of this.cityData) {
                for (let job of this.jobTypes) {
                    city[job] += city.AvgRent;
                }
            }
            this.plot()
        }

    }

    toggleTax(isOn) {

    }

    highlightBest(isOn) {

    }
}