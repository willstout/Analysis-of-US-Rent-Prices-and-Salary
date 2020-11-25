class City {
    /**
     * Creates a city Object
     * @param updateTable a callback function used to notify other parts of the program when a set of bubbles is selected
     * 
     */
    constructor(city, state, localTaxStyle, localTaxRate, stateTaxStyle, stateTaxRate, averageRent, Accountant, Administrative_Assistant,Mechanical_Engineer,Graphic_Designer,Project_Manager,Elementary_School_Teacher,Operations_Manager,Registered_Nurse,Human_Resources_Manager,Software_Engineer,Paralegal,Case_Manager,Account_Manager) {
        this.city = city;
        this.state = state;
        this.localTaxStyle = localTaxStyle;
        this.localTaxRate = localTaxRate;
        this.stateTaxStyle = stateTaxStyle;
        this.stateTaxRate = stateTaxRate;
        this.averageRent = averageRent;
        this.Accountant = Accountant;
        this.Administrative_Assistant = Administrative_Assistant;
        this.Mechanical_Engineer = Mechanical_Engineer;
        this.Graphic_Designer = Graphic_Designer;
        this.Project_Manager = Project_Manager;
        this.Elementary_School_Teacher = Elementary_School_Teacher;
        this.Operations_Manager = Operations_Manager;
        this.Registered_Nurse = Registered_Nurse;
        this.Human_Resources_Manager = Human_Resources_Manager;
        this.Software_Engineer = Software_Engineer;
        this.Paralegal = Paralegal;
        this.Case_Manager = Case_Manager;
        this.Account_Manager = Account_Manager;
        this.currentTaxes = 0;
    }
}

class Map {
    /**
     * Creates a Map Object
     * @param updateTable a callback function used to notify other parts of the program when a set of bubbles is selected
     * 
     */
    constructor(data, updateJobType, updateCity) {
        this.updateJobType = updateJobType;
        this.updateCity = updateCity;
        this.cityArray = [];
        this.data = data 
        this.rentToggle = true;
        this.taxToggle = true;
    }

    /**
     * Gives table header stuff and lines
     */
    setupMap(states) {
        var index = 0;
        while (index < this.data.averageRentPerCity.length) {
            var newCity = new City();
            newCity.city = this.data.averageRentPerCity[index].City;
            newCity.state = this.data.averageRentPerCity[index].State;
            newCity.averageRent = this.data.averageRentPerCity[index].AvgRent;
            newCity.localTaxStyle = this.data.localIncomeTaxRates[index].Tax_Style;
            newCity.localTaxRate = this.data.localIncomeTaxRates[index].Tax_Rate;
            newCity.stateTaxStyle = this.data.stateIncomeTaxRates[index].Tax_Style;
            newCity.stateTaxRate = this.data.stateIncomeTaxRates[index].Tax_Rate;
            //Salaries
            newCity.Accountant = this.data.salaryPerJobPerCity[index].Accountant;
            newCity.Administrative_Assistant = this.data.salaryPerJobPerCity[index].Administrative_Assistant;
            newCity.Mechanical_Engineer = this.data.salaryPerJobPerCity[index].Mechanical_Engineer;
            newCity.Graphic_Designer = this.data.salaryPerJobPerCity[index].Graphic_Designer;
            newCity.Project_Manager = this.data.salaryPerJobPerCity[index].Project_Manager;
            newCity.Elementary_School_Teacher = this.data.salaryPerJobPerCity[index].Elementary_School_Teacher;
            newCity.Operations_Manager = this.data.salaryPerJobPerCity[index].Operations_Manager;
            newCity.Registered_Nurse = this.data.salaryPerJobPerCity[index].Registered_Nurse;
            newCity.Human_Resources_Manager = this.data.salaryPerJobPerCity[index].Human_Resources_Manager;
            newCity.Software_Engineer = this.data.salaryPerJobPerCity[index].Software_Engineer;
            newCity.Paralegal = this.data.salaryPerJobPerCity[index].Paralegal;
            newCity.Case_Manager = this.data.salaryPerJobPerCity[index].Case_Manager;
            newCity.Account_Manager = this.data.salaryPerJobPerCity[index].Account_Manager;
            
            this.cityArray.push(newCity);
            index +=1 ;
        }

        var that = this;
        var svg = d3.select("#mapsvg")
            .attr("width", 1280)
            .attr("height", 900);

        
        var projection = d3.geoAlbers();         
        var path = d3.geoPath();

        svg.append("g")
            .attr("class", "counties")
            .selectAll("path")
            .data(states)
            .enter()
            .append("path")
            .attr("fill", function(d) { 
                return '#F1E9DA';
            })
            .attr("d", path)
            .attr("transform", "scale(1)")
            .style("stroke", "black")
            .style("stroke-width", .8);

        // svg.append("circle")
        //     .attr("r", 2)
        //     .attr("transform", function(d, i) {
        //         return "translate(" + projection([-67.5,39.9]) + ")";
        //     });

        d3.select("#mapsvg")
            .append('div')
            .attr("class", "tooltip")
            .style("opacity", 0);
        
        //Final version, but first gotta find all those useable city coordinates
        var circles = svg.selectAll("g")
            .data(that.data.cityCoordinates)
            .enter()
            .append("g")
            .attr("class", "city")
            .attr("transform", function(d, i) {
                return "translate(" + projection([d.Latitude,d.Longitude]) + ")";
            })
            .on("mouseover", function(d, i) {
                var div = d3.select(".tooltip");		
                div.transition()		
                    .duration(100)
                    .style("opacity", 1);
                div.html(that.tooltipRender(d, i))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
            })
            .on("mouseleave", function() {
                var div = d3.select(".tooltip");	
                div.transition()		
                    .duration(100)
                    .style("opacity", 0);	
            })
            .style("border-radius", "50%");

            // .style("left", "250px")
            // .style("top", `${300}px`);

            // .style("left", (d3.event.pageX) + "px")		
            // .style("top", (d3.event.pageY) + "px");


    }

    //Update map
    updateMap(jobType) {
        
        this.salrayData = this.data.salaryPerJobPerCity;
        let minTakehome = 100000000;
        let maxTakehome = 0;
        var that = this;
        var svg = d3.select("#mapsvg")
        //Remove all existing pie slices, remove this if implementing transitions
        svg.selectAll(".pieSlice").remove();

        //Determine percentages of each category
        var percentArray = [];
        this.cityArray.forEach(element => {
            var cityPercentArray = [];
            var salary = +element[jobType];
            var rent = 0;
            var overallTaxPaid = 0;
            
            if (that.rentToggle == true) {
                //Average rent is monthly
                rent = (+element.averageRent * 12);
            }
            if (that.taxToggle == true) {
                //Federal taxes
                var federalTaxRate = "0:10, 9876:12, 40126:22, 85526:24, 163301:32";
                overallTaxPaid += that.calculateProgressiveTaxes(salary, federalTaxRate);
                //State taxes
                if (element.stateTaxStyle == "Flat") {
                    overallTaxPaid += (salary * (+element.stateTaxRate * .01))
                }
                else {
                    overallTaxPaid += that.calculateProgressiveTaxes(salary, element.stateTaxRate);
                }
                //Local taxes
                if (element.localTaxStyle == "Flat") {
                    overallTaxPaid += (salary * (+element.localTaxRate * .01))
                }
                else {
                    overallTaxPaid += that.calculateProgressiveTaxes(salary, element.localTaxRate);
                }
                //Income tax that goes toward Social Security
                overallTaxPaid += (salary * .062);
                //Income tax that goes toward Medicare
                overallTaxPaid += (salary * .0145);
                //console.log("Tax paid = " + overallTaxPaid); 
                element.currentTaxes = overallTaxPaid; 
            }
            if (salary != 0) {
                var salaryAsPercentageOfWhole = salary;
                var rentAsPercentageOfWhole = 0;
                var taxAsPercentageOfWhole = 0;

                rentAsPercentageOfWhole = rent / salary;
                cityPercentArray.push("rent:" + rentAsPercentageOfWhole);
                salaryAsPercentageOfWhole -= rent;
                
                taxAsPercentageOfWhole = overallTaxPaid / salary;
                cityPercentArray.push("tax:" + taxAsPercentageOfWhole);
                salaryAsPercentageOfWhole -= overallTaxPaid;
                
                salaryAsPercentageOfWhole = salaryAsPercentageOfWhole / salary;
                if (salaryAsPercentageOfWhole * salary < minTakehome && salary != 0) {
                    minTakehome = salaryAsPercentageOfWhole * salary;
                }
                if (salaryAsPercentageOfWhole * salary > maxTakehome) {
                    maxTakehome = salaryAsPercentageOfWhole * salary;
                } 
                cityPercentArray.unshift(salaryAsPercentageOfWhole);
                
                percentArray.push(cityPercentArray);

                //console.log("Salary as percent:" + salaryAsPercentageOfWhole + ", " + "Rent as percent:" + rentAsPercentageOfWhole + ", " + "Tax as percent:" + taxAsPercentageOfWhole);
            }
            else {
                percentArray.push("");
            }
            
        });

        this.scaleRadius = d3
            .scaleLinear()
            .domain([minTakehome, maxTakehome])
            .range([.5, 1.5]);

        this.borderScaleRadius = d3
            .scaleLinear()
            .domain([minTakehome, maxTakehome])
            .range([.7, 1.7]);
        
        //Offset set to 1               
        var percIndex = 1;
        //Number of slices (5th index chosen because 5th index always has non "0" information while many others don't)
        var pieSlices = percentArray[4].length;
        svg.selectAll(".city")
            .each(function(d) {
                if (percentArray[percIndex] != "") {
                    
                    //Calculate percentages that each category will take up
                    var pieSliceIndex = 0;
                    var firstSlice = (+percentArray[percIndex][0] * 100);
                    var secondSlice = null;
                    var thirdSlice = null;
                    if (pieSlices >= 2) {
                        secondSlice = (+percentArray[percIndex][1].split(":")[1] * 100);
                    }
                    if (pieSlices == 3) {
                        thirdSlice = (+percentArray[percIndex][2].split(":")[1] * 100);
                    }

                    //Background slice
                    d3.select(this)
                        .append("circle")
                        .attr("class", "pieSlice " + that.cityArray[percIndex].city)
                        .attr("fill", "black")
                        .attr("r", 10)
                        .attr("transform", function(d, i) {
                            return "scale(" + (that.borderScaleRadius(firstSlice * .01 * +that.salrayData[percIndex][jobType])) + ")";
                        })
                    
                    //For each pie we're going to make, add it's slices individually
                    while (pieSliceIndex < pieSlices) {
                        d3.select(this)
                            .append("circle")
                            .attr("stroke-dasharray", function(d,i) {
                                //First slice is salary
                                if (pieSliceIndex == 0) {
                                    return "calc(100 * 31.42 / 100) 31.42";
                                }
                                //Second slice could be either tax or rent
                                //If it's tax then we're at the end, if it's rent, there could be another, which would then be the tax color
                                if (pieSliceIndex == 1) {
                                    if (thirdSlice == null) {
                                        return "calc(" + (secondSlice ) + "* 31.42 / 100) 31.42";
                                    }
                                    else {
                                        return "calc(" + (secondSlice + thirdSlice) + "* 31.42 / 100) 31.42";
                                    }
                                }
                                if (pieSliceIndex == 2) {
                                    return "calc(" + thirdSlice + " * 31.42 / 100) 31.42";
                                }
                            })
                            .attr("stroke-width", 10)
                            //Salary = blue, rent = bisque, tax = black
                            .attr("stroke", function(d,i) {
                                //First slice is salary
                                if (pieSliceIndex == 0) {
                                    return "#BDDBC0";
                                }
                                //Second slice could be either tax or rent
                                //If it's tax then we're at the end, if it's rent, there could be another, which would then be the tax color
                                if (pieSliceIndex == 1) {
                                    var slice = percentArray[percIndex][pieSliceIndex];
                                    if (slice.split(":")[0] == "tax") {
                                        return "#EB996F";
                                    }
                                    else {
                                        return "#9EA5D1"
                                    }
                                }
                                if (pieSliceIndex == 2) {
                                    return "#EB996F";
                                }
                            })
                            .attr("fill", "none")
                            .attr("class", "pieSlice " + that.cityArray[percIndex].city)
                            .attr("r", function(d,i) {
                                if (+that.salrayData[percIndex][jobType] > 0) {
                                    return 5;
                                }
                                else {
                                    return 0;
                                }
                            })
                            .attr("transform", function(d, i) {
                                //Scale by money earned as percentage of things being considered times salary
                                //console.log(firstSlice + " " + +that.salrayData[percIndex][jobType])
                                return "scale(" + (that.scaleRadius(firstSlice * .01 * +that.salrayData[percIndex][jobType])) + ")";
                            })
                            .style("border", "black")
                        pieSliceIndex += 1;

                        //lines
                        d3.select(this)
                            .append("line")
                            .attr("x1", 0)
                            .attr("y1", 0)
                            .attr("x2", 10)
                            .attr("y2", 0)
                            .attr("class", "pieSlice " + that.cityArray[percIndex].city)
                            .style("stroke","black")
                            .style("stroke-width",.7)
                            .attr("transform", function(d, i) {
                                return "scale(" + (that.scaleRadius(firstSlice * .01 * +that.salrayData[percIndex][jobType])) + ")";
                            })
                        
                        var angle =  (firstSlice * .01 * 360);
                        var x2 = 10 * Math.sin((angle + 90) * Math.PI/180);
                        var y2 = 10 * Math.cos((angle + 90) * Math.PI/180);
                        d3.select(this)
                            .append("line")
                            .attr("x1", 0)
                            .attr("y1", 0)
                            .attr("x2", x2)
                            .attr("y2", y2)
                            .attr("class", "pieSlice " + that.cityArray[percIndex].city)
                            .style("stroke","black")
                            .style("stroke-width",.7)
                            .attr("transform", function(d, i) {
                                return "scale(" + (that.scaleRadius(firstSlice * .01 * +that.salrayData[percIndex][jobType])) + ")";
                            })

                        angle =  ((firstSlice + secondSlice) * .01 * 360);
                        x2 = 10 * Math.sin((angle + 90) * Math.PI/180);
                        y2 = 10 * Math.cos((angle + 90) * Math.PI/180);
                        d3.select(this)
                            .append("line")
                            .attr("x1", 0)
                            .attr("y1", 0)
                            .attr("x2", x2)
                            .attr("y2", y2)
                            .attr("class", "pieSlice " + that.cityArray[percIndex].city)
                            .style("stroke","black")
                            .style("stroke-width",.7)
                            .attr("transform", function(d, i) {
                                return "scale(" + (that.scaleRadius(firstSlice * .01 * +that.salrayData[percIndex][jobType])) + ")";
                            })
                        
                    }
                }
                percIndex += 1;
            });
    }

    /**
     * Returns html that can be used to render the tooltip.
     * @param data 
     * @returns {string}
     */
    tooltipRender(data, i) {
        var jobType = d3.select("#dropdown").select(".buttons")._groups[0][0].value;
        var text = "<div style='background-color:white; position:relative;'>" + data.City + "<br>";
        var takeHome = +this.cityArray[i][jobType];
        text += "Avg Salary: $" + this.cityArray[i][jobType] + "<br>";
        if (this.rentToggle) {
            text += "Avg Rent: $" + (+this.cityArray[i].averageRent*12).toFixed(2) + "<br>";
            takeHome -= (+this.cityArray[i].averageRent*12).toFixed(2);
        }
        if (this.taxToggle) {
            text += "Tax: $" + (+this.cityArray[i].currentTaxes).toFixed(2) + "<br>";
            takeHome -= (+this.cityArray[i].currentTaxes).toFixed(2);
        }
        if (this.rentToggle && this.taxToggle) {
            text += "Takehome: $" + takeHome.toFixed(2) + "<br>";
        }
        text += "</div>"
        return text;
    }


    calculateProgressiveTaxes(salary, _taxBrackets) {
        var taxPaid = 0;
        var taxBrackets = _taxBrackets.split(",");
        var taxBracketsIndex = 0;
        while (taxBracketsIndex < taxBrackets.length - 1) {
            //Find the
            var percentPaid = taxBrackets[taxBracketsIndex].split(":")[1];
            var taxBracketLowerBound = +taxBrackets[taxBracketsIndex].split(":")[0];
            var taxBracketUpperBound = (+taxBrackets[taxBracketsIndex + 1].split(":")[0]) - 1;
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
        var taxBracketLowerBound = +taxBrackets[taxBracketsIndex].split(":")[0];
        var percentPaid = taxBrackets[taxBracketsIndex].split(":")[1];
        if (taxBracketLowerBound <= salary) {
            taxPaid += (salary - taxBracketLowerBound) * (percentPaid * .01);
            //console.log("Paying: " + percentPaid + "% from " + taxBracketLowerBound + " to " + salary + "= " + taxPaid);
        }
        //console.log("Tax paid = " + taxPaid);
        return taxPaid;
    }

}
