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
            .attr('transform', 'translate(50, 0)');
        
    }

    updatePlot(jobType) {
        let svgGroup = d3.select('#bubbleChart').select('svg')
                            .append('g')
                            .attr('id', 'plotGroup')
                            .attr('width', '100%')
                            .attr('height', '100%')
                            .attr('transform', 'translate(90, 0)');

        svgGroup.append('g').attr('id', 'axis');

        this.salrayData = this.data.salaryPerJobPerCity;
        let sMax = d3.max(this.salrayData, d=>+d[jobType]);
        let sMin = d3.min(this.salrayData, d=>+d[jobType]>0 ? +d[jobType] : Infinity);
        let axisScale = d3
                        .scaleLinear()
                        .domain([sMin, sMax])
                        .range([40, 710]);
        d3.select("#axis").call(d3.axisLeft(axisScale));


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