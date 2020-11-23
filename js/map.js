class City {
    /**
     * Creates a city Object
     * @param updateTable a callback function used to notify other parts of the program when a set of bubbles is selected
     * 
     */
    constructor(city, state, localTaxStyle, localTaxRate, stateTaxStyle, stateTaxRate, averageRent, Accountant, AdminAssistant,MechEngineer,GraphicDesigner,ProjectManager,ElementarySchoolTeacher,OperationsManager,RN,HRManager,SoftwareEngineer,Paralegal,CaseManager,AccountManager) {
        this.city = city;
        this.state = state;
        this.localTaxStyle = localTaxStyle;
        this.localTaxRate = localTaxRate;
        this.stateTaxStyle = stateTaxStyle;
        this.stateTaxRate = stateTaxRate;
        this.averageRent = averageRent;
        this.Accountant = Accountant;
        this.AdminAssistant = AdminAssistant;
        this.MechEngineer = MechEngineer;
        this.GraphicDesigner = GraphicDesigner;
        this.ProjectManager = ProjectManager;
        this.ElementarySchoolTeacher = ElementarySchoolTeacher;
        this.OperationsManager = OperationsManager;
        this.RN = RN;
        this.HRManager = HRManager;
        this.SoftwareEngineer = SoftwareEngineer;
        this.Paralegal = Paralegal;
        this.CaseManager = CaseManager;
        this.AccountManager = AccountManager;
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
            newCity.AdminAssistant = this.data.salaryPerJobPerCity[index].Administrative_Assistant;
            newCity.MechEngineer = this.data.salaryPerJobPerCity[index].Mechanical_Engineer;
            newCity.GraphicDesigner = this.data.salaryPerJobPerCity[index].Graphic_Designer;
            newCity.ProjectManager = this.data.salaryPerJobPerCity[index].Project_Manager;
            newCity.ElementarySchoolTeacher = this.data.salaryPerJobPerCity[index].Elementary_School_Teacher;
            newCity.OperationsManager = this.data.salaryPerJobPerCity[index].Operations_Manager;
            newCity.RN = this.data.salaryPerJobPerCity[index].Registered_Nurse;
            newCity.HRManager = this.data.salaryPerJobPerCity[index].Human_Resources_Manager;
            newCity.SoftwareEngineer = this.data.salaryPerJobPerCity[index].Software_Engineer;
            newCity.Paralegal = this.data.salaryPerJobPerCity[index].Paralegal;
            newCity.CaseManager = this.data.salaryPerJobPerCity[index].Case_Manager;
            newCity.AccountManager = this.data.salaryPerJobPerCity[index].Account_Manager;
            
            this.cityArray.push(newCity);
            index +=1 ;
        }
        //console.log(this.cityArray);

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
                return 'lightblue';
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
            .on("mouseover", function(d) {
                var div = d3.select(".tooltip");		
                div.transition()		
                    .duration(500)
                    .style("opacity", 1);	
                var dThat = d;	
                div.html(that.tooltipRender(d))	
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY) + "px");	
                })					
            .on("mouseout", function(d) {	
                var div = d3.select(".tooltip");	
                div.transition()		
                    .duration(100)
                    .style("opacity", 0);	
            })


    }

    //Update map
    updateMap(jobType) {
        this.salrayData = this.data.salaryPerJobPerCity;
        let sMax = d3.max(this.salrayData, d=>+d[jobType]);
        let sMin = d3.min(this.salrayData, d=>+d[jobType]>0 ? +d[jobType] : Infinity);
        
        this.scaleRadius = d3
                        .scaleLinear()
                        .domain([sMax, sMin])
                        .range([0.1, 13]);
        var that = this;
        var svg = d3.select("#mapsvg")
        svg.selectAll(".city")
            .append("circle")
            .attr("stroke-dasharray", "0 100")
            .attr("stroke-width", "15")
            .attr("fill", "none")
            .attr("r", function(d,i) {
                if (+that.salrayData[i][jobType] > 0) {
                    //console.log("not 0");
                    return that.scaleRadius(+that.salrayData[i][jobType]);
                }
                else {
                    //console.log("0");
                    return 0;
                }
            })
        svg.selectAll(".city")
            .append("circle")
            .attr("stroke-dasharray", "65 100")
            .attr("stroke-width", "15")
            .attr("stroke", "blue")
            .attr("fill", "none")
            .attr("r", function(d,i) {
                if (+that.salrayData[i][jobType] > 0) {
                    //console.log("not 0");
                    return that.scaleRadius(+that.salrayData[i][jobType]);
                }
                else {
                    //console.log("0");
                    return 0;
                }
            })
        svg.selectAll(".city")
            .append("circle")
            .attr("stroke-dasharray", "25 100")
            .attr("stroke-width", "15")
            .attr("stroke", "red")
            .attr("fill", "none")
            .attr("r", function(d,i) {
                if (+that.salrayData[i][jobType] > 0) {
                    //console.log("not 0");
                    return that.scaleRadius(+that.salrayData[i][jobType]);
                }
                else {
                    //console.log("0");
                    return 0;
                }
            })
        svg.selectAll(".city")
            .append("circle")
            .attr("stroke-dasharray", "0 100")
            .attr("stroke-width", "15")
            .attr("stroke", "black")
            .attr("fill", "none")
            .attr("r", function(d,i) {
                if (+that.salrayData[i][jobType] > 0) {
                    //console.log("not 0");
                    return that.scaleRadius(+that.salrayData[i][jobType]);
                }
                else {
                    //console.log("0");
                    return 0;
                }
            })

    }

    /**
     * Returns html that can be used to render the tooltip.
     * @param data 
     * @returns {string}
     */
    tooltipRender(data) {
        var name = data.City;
        let text = "<p id='boldLabel' style='background-color:green; position: relative'>" + name + "<br></p>";
        return text;
    }

}
