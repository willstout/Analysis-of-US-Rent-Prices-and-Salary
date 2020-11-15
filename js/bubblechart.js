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
            .attr('width', 100)
            .attr('height', 770)
            .attr('rx', 50)
            .attr('ry', 50)
            .attr('transform', 'translate(60, 0)');
        
        let svgGroup = d3.select('#bubbleChart').select('svg')
            .append('g')
            .attr('id', 'plotGroup')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('transform', 'translate(110, 10)');

        svgGroup.append('g').attr('id', 'axis');
        svgGroup.append('g').attr('id', 'bubbleGroup');
        
    }

    updatePlot(jobType) {
        this.salrayData = this.data.salaryPerJobPerCity;
        let sMax = d3.max(this.salrayData, d=>+d[jobType]);
        let sMin = d3.min(this.salrayData, d=>+d[jobType]>0 ? +d[jobType] : Infinity);
        this.plot(sMax, sMin, jobType);
    }

    plot(sMax, sMin, jobType) {
        this.axisScale = d3
                        .scaleLinear()
                        .domain([sMax, sMin])
                        .range([40, 710]);

        let ticks = [sMax, sMin];
        let tickValue = sMax - sMax%10000;
        while (tickValue > sMin) {
            ticks.push(tickValue);
            tickValue -= 5000;
        }   

        d3.select("#axis").call(d3.axisLeft(this.axisScale)
                                    .tickPadding(20)
                                    .tickFormat(d3.format(".2s"))
                                    .tickSize(100)
                                    .tickValues(ticks))
                        .attr('transform', 'translate(50, 0)');
        
        d3.select('#bubbleGroup').selectAll('circle')
                        .data(this.salrayData)
                        .join('circle')
                        .attr('cx', 0)
                        .attr('cy', d=>this.axisScale(+d[jobType]))
                        .attr('r', 40)
                        .classed('bubble', true);
        
        d3.select('#axis').raise();
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