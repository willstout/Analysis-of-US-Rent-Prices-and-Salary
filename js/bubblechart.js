class BubbleChart {
    constructor(data, updateJobType, highlightPieChart) {
        this.updateJobType = updateJobType;
        this.highlightPieChart = highlightPieChart;
        this.data = data;

        this.jobTypes = Object.keys(this.data.salaryPerJobPerCity[0]);
        this.jobTypes.splice(0, 2);

        this.cityData = JSON.parse(JSON.stringify(this.data.salaryPerJobPerCity));
        for (let d of this.cityData) {
            for (let job of this.jobTypes) {
                let salary = +d[job];
                d[job] = {};
                d[job].salary = salary;
                d[job].toDraw = salary;
            }
            let rent_obj = this.data.averageRentPerCity.find(element => (element.City == d.City & element.State == d.State));
            let state_tax_obj = this.data.stateIncomeTaxRates.find(element => (element.City == d.City & element.State == d.State));
            let local_tax_obj = this.data.localIncomeTaxRates.find(element => (element.City == d.City & element.State == d.State));
            d.AvgRent = +rent_obj.AvgRent*12;
            
            d.Tax = {};
            let federalTaxRate = "0:10, 9876:12, 40126:22, 85526:24, 163301:32";

            for (let job of this.jobTypes) {
                d.Tax[job] = this.calculateProgressiveTaxes(d[job].salary, federalTaxRate);
                if (state_tax_obj.Tax_Style == 'Flat') {
                    d.Tax[job] += d[job].salary * (+state_tax_obj.Tax_Rate)/100;
                }
                else {
                    d.Tax[job] += this.calculateProgressiveTaxes(d[job].salary, state_tax_obj.Tax_Rate);
                }
                if (local_tax_obj.Tax_Style == 'Flat') {
                    d.Tax[job] += d[job].salary * (+local_tax_obj.Tax_Rate)/100;
                }
                else {
                    d.Tax[job] += this.calculateProgressiveTaxes(d[job].salary, local_tax_obj.Tax_Rate);
                }
                d.Tax[job] += (d[job].salary * .062);
                d.Tax[job] += (d[job].salary * .0145);
            }
        }
        this.cityData = this.cityData.filter(d => d.AvgRent > 0);
        let restrictList = ["Cleveland", "Irvine", "Greeley", "Fort Collins", "Stamford", "Hartford", "Fort Lauderdale", "Lakeland", "Long Beach", "Stockton", "Ventura", "Bakersfield", "Toledo", "Baltimore", "Worcester"];
        this.cityData = this.cityData.filter(d => !restrictList.includes(d.City));
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
            .attr('transform', 'translate(105, 10)');
        
        let svgGroup = d3.select('#bubbleChart').select('svg')
                            .append('g')
                            .attr('id', 'plotGroup')
                            .attr('width', '100%')
                            .attr('height', '100%')
                            .attr('transform', 'translate(140, 5)');

        svgGroup.append('g').attr('id', 'axis');
        svgGroup.append("text").attr("id", "axis-label");
        svgGroup.append('g').attr('id', 'bubbleGroup');

        d3.select('#bubbleChart')
            .append('div')
            .attr("class", "tooltip")
            .attr('id', 'bubbletooltip')
            .style("opacity", 0);
            
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

        let sMax = d3.max(this.cityData, d=>d[this.jobType].toDraw);
        let sMin = d3.min(this.cityData, d=>d[this.jobType].salary>0 ? d[this.jobType].toDraw : Infinity);

        this.axisScale = d3
                        .scaleLinear()
                        .domain([sMax, sMin])
                        .range([40, 710]);

        let ticks = [sMax, sMin];
        let tickValue = sMax - sMax%5000;
        if (sMax - tickValue < 2000) {tickValue -= 5000;}
        while (tickValue > sMin) {
            if (tickValue - sMin > 2000) {ticks.push(tickValue);}
            tickValue -= 5000;
        }   

        d3.select("#axis").call(d3.axisLeft(this.axisScale)
                                    .tickPadding(20)
                                    //.tickFormat(d3.format(".2s"))
                                    .tickSize(70)
                                    .tickValues(ticks))
                        .attr('transform', 'translate(35, 0)');
        
        const tooltip = d3.select("#bubbletooltip");
        
        d3.select('#bubbleGroup').selectAll('circle')
                        .data(this.cityData)
                        .join('circle')
                        .attr('cx', 0)
                        .attr('cy', d=>this.axisScale(d[this.jobType].toDraw))
                        .attr('r', d=>d[this.jobType].salary > 0 ? 30 : 0)
                        .classed('bubble', true)
                        .on("mouseover", function(d) {
                            tooltip
                                .transition()
                                .duration(100)
                                .style("opacity", 1);
                            tooltip
                                .html(that.tooltipRender(d))
                                .style("left", "250px")
                                .style("top", `${+d3.select(this).attr("cy")+145}px`);
                            d3.select(this).raise();
                            that.highlightPieChart(d.City);
                        })
                        .on("mouseleave", function() {
                            tooltip
                                .transition()
                                .duration(100)
                                .style("opacity", 0);
                            that.highlightPieChart(null);
                        });
        
        d3.select('#axis').raise();
    }

    tooltipRender(data) {
        let text = "<h2>" + data['City'] + ", " + data['State'] + "</h2>";
        return text;
    }

    updateCity(city, isOn) {
        let bubble = d3.select('#bubbleChart')
                        .selectAll("circle")
                        .filter(e => e.City === city)
                        .classed('highlighted', true);
        bubble.raise();
        if (isOn) {
            let d = this.cityData.find(element => element.City == city);
            
            let div = d3.select("#bubbletooltip");		
            div.transition()		
                .duration(100)
                .style("opacity", 1);
            div.html(this.tooltipRender(d))
                .style("left", "250px")
                .style("top", `${+bubble.attr('cy')+145}px`);

        }
        else {
            let div = d3.select("#bubbletooltip");	
            div.transition()		
                .duration(100)
                .style("opacity", 0);	
            bubble.classed('highlighted', false);
        }

    }

    toggleRent(isOn) {
        if (isOn) {
            for (let city of this.cityData) {
                for (let job of this.jobTypes) {
                    city[job].toDraw -= city.AvgRent;
                }
            }
            this.plot()
        }
        else {
            for (let city of this.cityData) {
                for (let job of this.jobTypes) {
                    city[job].toDraw += city.AvgRent;
                }
            }
            this.plot()
        }

    }

    toggleTax(isOn) {
        if (isOn) {
            for (let city of this.cityData) {
                for (let job of this.jobTypes) {
                    city[job].toDraw -= city.Tax[job];
                }
            }
            this.plot()
        }
        else {
            for (let city of this.cityData) {
                for (let job of this.jobTypes) {
                    city[job].toDraw += city.Tax[job];
                }
            }
            this.plot()
        }

    }

    highlightBest(isOn) {
        if (isOn) {
            this.cityData.sort((a, b) => (a[this.jobType].toDraw < b[this.jobType].toDraw) ? 1 : -1);
            let cities = [];
            cities.push(this.cityData[0].City);
            cities.push(this.cityData[1].City);
            cities.push(this.cityData[2].City);

            let bubble1 = d3.select('#bubbleChart')
                            .selectAll("circle")
                            .filter(e => e.City === cities[0]);

            let bubble2 = d3.select('#bubbleChart')
                            .selectAll("circle")
                            .filter(e => e.City === cities[1]);

            let bubble3 = d3.select('#bubbleChart')
                            .selectAll("circle")
                            .filter(e => e.City === cities[2]);

            bubble1.classed('topbubbles', true);
            bubble1.raise();

            bubble2.classed('topbubbles', true);
            bubble2.raise();

            bubble3.classed('topbubbles', true);
            bubble3.raise();

            return cities;


        } else {
            d3.select('#highlight-button').classed('clicked', false);

            d3.select('#bubbleChart')
                .selectAll("circle")
                .classed('topbubbles', false);

            return null;
        }

    }

    calculateProgressiveTaxes(salary, _taxBrackets) {
        let taxPaid = 0;
        let taxBrackets = _taxBrackets.split(",");
        let taxBracketsIndex = 0;
        while (taxBracketsIndex < taxBrackets.length - 1) {
            //Find the
            let percentPaid = taxBrackets[taxBracketsIndex].split(":")[1];
            let taxBracketLowerBound = +taxBrackets[taxBracketsIndex].split(":")[0];
            let taxBracketUpperBound = (+taxBrackets[taxBracketsIndex + 1].split(":")[0]) - 1;
            //If the salary is more than the upper bound of the current tax bracket, pay that entire brackets tax
            if (taxBracketLowerBound <= salary && taxBracketUpperBound <= salary) {
                taxPaid += (taxBracketUpperBound - taxBracketLowerBound) * (percentPaid * .01);
            }
            //If the salary is less than the upper bound of the tax bracket, only pay for the amount that goes over the lower bound
            else if (taxBracketLowerBound <= salary && taxBracketUpperBound > salary) {
                taxPaid += (salary - taxBracketLowerBound) * (percentPaid * .01);
            }
            //console.log("Paying: " + percentPaid + "% from " + taxBracketLowerBound + " to " + taxBracketUpperBound + "= " + taxPaid);
            taxBracketsIndex += 1;
        }
        //We stop short one because of index out of bounds, so this is how we add the details of the last tax bracket
        let taxBracketLowerBound = +taxBrackets[taxBracketsIndex].split(":")[0];
        let percentPaid = taxBrackets[taxBracketsIndex].split(":")[1];
        if (taxBracketLowerBound <= salary) {
            taxPaid += (salary - taxBracketLowerBound) * (percentPaid * .01);
            //console.log("Paying: " + percentPaid + "% from " + taxBracketLowerBound + " to " + salary + "= " + taxPaid);
        }
        //console.log("Tax paid = " + taxPaid);
        return taxPaid;
    }
}