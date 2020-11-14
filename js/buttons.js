class Buttons {
    constructor(data, updateJobType){
        this.updateJobType = updateJobType;

        this.jobTypes = data.salaryPerJobPerCity;
        this.jobTypes = Object.keys(this.jobTypes[0]);
        this.jobTypes.splice(0, 2);

        this.drawButtons();
    }

    drawButtons() {
        let that = this;

        let buttonPanel = d3.select('#buttonPanel');

        let dropdownWrap = buttonPanel.append('div');

        dropdownWrap.append('div')
            .append('text')
            .text('Job Type')
            .classed('dropdown-label', true);

        dropdownWrap.append('div').attr('id', 'dropdown')
                .append('div').classed('dropdown-content', true)
                .append('select').classed('buttons click-button', true);

        let drop = d3.select('#dropdown').select('.dropdown-content').select('select');

        let options = drop.selectAll('option')
            .data(this.jobTypes);


        options.exit().remove();

        let optionsEnter = options.enter()
            .append('option')
            .attr('value', d => d);

        optionsEnter.append('text')
            .text(d => d.split('_').join(' '));

        options = optionsEnter.merge(options);

        drop.on('change', function () {
            let value = this.options[this.selectedIndex].value;
            that.updateJobType(value);
        });

        
        buttonPanel
                    .append('button')
                    .classed('buttons click-button', true)
                    .attr('id', 'rent-button')
                    .html('Toggle Rent')
                    .on('click', function(){
                        if (d3.select('#rent-button').classed('clicked')) {
                            d3.select('#rent-button').classed('clicked', false);
                        } else {
                            d3.select('#rent-button').classed('clicked', true);
                        }
                    });
        
        buttonPanel
                    .append('button')
                    .classed('buttons click-button', true)
                    .attr('id', 'tax-button')
                    .html('Toggle Tax')
                    .on('click', function(){
                        if (d3.select('#tax-button').classed('clicked')) {
                            d3.select('#tax-button').classed('clicked', false);
                        } else {
                            d3.select('#tax-button').classed('clicked', true);
                        }
                    });

        buttonPanel
                    .append('button')
                    .classed('buttons click-button', true)
                    .attr('id', 'highlight-button')
                    .html('Hightlight Top 3')
                    .on('click', function(){
                        if (d3.select('#highlight-button').classed('clicked')) {
                            d3.select('#highlight-button').classed('clicked', false);
                        } else {
                            d3.select('#highlight-button').classed('clicked', true);
                        }
                    });
                    
    }
}