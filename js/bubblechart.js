class BubbleChart {
    constructor(data, updateJobType, updateCity) {
        this.updateJobType = updateJobType;
        this.updateCity = updateCity;
        this.data = data
        console.log(data);
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
            .attr('width', 80)
            .attr('height', 750)
            .attr('rx', 40)
            .attr('ry', 40)
            .attr('transform', 'translate(70, 0)');
        
    }

    updatePlot(jobType) {
        let svgGroup = d3.select('#bubbleChart').select('svg')
                            .append('g')
                            .attr('id', 'plotGroup')
                            .attr('width', '100%')
                            .attr('height', '100%')
                            .attr('transform', 'translate(110, 0)');

        svgGroup.append('g').attr('id', 'axis');

        this.salrayData = this.data.salaryPerJobPerCity;
        let sMax = d3.max(this.salrayData, d=>+d[jobType]);
        let sMin = d3.min(this.salrayData, d=>+d[jobType]>0 ? +d[jobType] : Infinity);
        let axisScale = d3
                        .scaleLinear()
                        .domain([sMax, sMin])
                        .range([40, 710]);
        // let ticks = axisScale.ticks();
        // ticks.push(sMax);
        // ticks.push(sMin);
        let ticks = [sMax, sMin];
        let tickValue = sMax - sMax%10000;
        while (tickValue > sMin) {
            ticks.push(tickValue);
            tickValue -= 10000;
        }     
        d3.select("#axis").call(d3.axisLeft(axisScale)
                                    .tickPadding(20)
                                    .tickFormat(d3.format(".2s"))
                                    .tickSize(80)
                                    .tickValues(ticks)
                                    .ticks(5))
                        .attr('transform', 'translate(40, 0)');
        


    }

    updateCity(city) {

    }

    toggleRent(isOn) {

    }

    toggleTax(isOn) {

    }

    highlightBest(isOn) {

    }
}