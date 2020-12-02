class Buttons {
    constructor(data, updateJobType, toggleRent, toggleTax, highlightBest){
        this.updateJobType = updateJobType;
        this.toggleRent = toggleRent;
        this.toggleTax = toggleTax;
        this.highlightBest = highlightBest;

        this.jobTypes = data.salaryPerJobPerCity;
        this.jobTypes = Object.keys(this.jobTypes[0]);
        this.jobTypes.splice(0, 2);
        this.jobTypes.splice(13, 3);
        this.drawButtons();
    }

    drawButtons() {
        let that = this;

        let buttonPanel = d3.select('#buttonPanel');

        //Set up the drop down for job type selection
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
            that.highlightBest(false);
        });

        //Set up the toggle rent button
        buttonPanel
                    .append('button')
                    .classed('buttons click-button', true)
                    .attr('id', 'rent-button')
                    .html('Toggle Rent')
                    .on('click', function(){
                        if (d3.select('#rent-button').classed('clicked')) {
                            d3.select('#rent-button').classed('clicked', false);
                            that.toggleRent(false);
                        } else {
                            d3.select('#rent-button').classed('clicked', true);
                            that.toggleRent(true);
                        }
                        that.highlightBest(false);
                    });
        
        //Set up the toggle tax button
        buttonPanel
                    .append('button')
                    .classed('buttons click-button', true)
                    .attr('id', 'tax-button')
                    .html('Toggle Tax')
                    .on('click', function(){
                        if (d3.select('#tax-button').classed('clicked')) {
                            d3.select('#tax-button').classed('clicked', false);
                            that.toggleTax(false);
                        } else {
                            d3.select('#tax-button').classed('clicked', true);
                            that.toggleTax(true);
                        }
                        that.highlightBest(false);
                    });

        //Set up the highlight top 3 button
        buttonPanel
                    .append('button')
                    .classed('buttons click-button', true)
                    .attr('id', 'highlight-button')
                    .html('Hightlight Top 3')
                    .on('click', function(){
                        if (d3.select('#highlight-button').classed('clicked')) {
                            d3.select('#highlight-button').classed('clicked', false);
                            that.highlightBest(false);
                        } else {
                            d3.select('#highlight-button').classed('clicked', true);
                            that.highlightBest(true);
                        }
                    });
                    
    }
}