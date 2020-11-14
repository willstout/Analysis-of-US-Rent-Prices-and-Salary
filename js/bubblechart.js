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
        this.drawAxis;

    }

    drawAxis() {

    }

}