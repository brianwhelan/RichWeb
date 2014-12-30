// Needed to allow CROSS-domain requests
$.ajaxSetup({
	crossDomain : true,
	cache : false,
	contentType : "application/json",
	dataType : "json"
});

// Router
var AppRouter = Backbone.Router.extend({

	routes : {
		"task1" : "Table",
		"task2" : "Pie",
		"task3" : "Bar",
		"task4" : "Pyramid",
		"task5" : "Donuts",
		"task6" : "Dashboard"
	},

	Table : function() {
		
		$('#content').css("display","inline-flex");
		$('#task_table').css("display","inline");
		$('#barChart').remove();
		$('#pieChart').remove();
		$('#pyramid').remove();
		$('.donut').remove();
		$('.legend').remove();
		$('#dashboard').remove();
		
		var tableCollection = new TableCollection();

		tableCollection.fetch({
			success : function() {

				// create view and pass collection
				var tableView = new TableHomeView({
					collection : tableCollection
				});

				tableView.flush();
				tableView.render();

			}
		});
	},

	Pie : function() {
		
		$('#content').css("display","inline-flex");
		$('#task_table').css("display","none");
		$('#barChart').remove();
		$('#pieChart').remove();
		$('#pyramid').remove();
		$('.donut').remove();
		$('.legend').remove();
		$('#dashboard').remove();
		
		$('#content').prepend("<div id='pieChart'></div>");

		var nations = new NationCollection;
		
		var pieCollection = new Backbone.Collection;

		nations.fetch({
			success : function() {
				// alert(JSON.stringify(nations));
				var students = new StudentCollection;

				students.fetch({
					success : function() {
						// alert(JSON.stringify(students));

						_.each(nations.models, function(nModels) {
							var country = new countryModel;

							country.set("label", nModels.get("id"));

							pieCollection.add(country);

						});

						_.each(students.models, function(sModels) {
							var X = pieCollection.findWhere({
								"label" : sModels.get("id_nationality")
							}).get("value");
							pieCollection.findWhere({
								"label" : sModels.get("id_nationality")
							}).set("value", X + 1);
							// alert(JSON.stringify(pieCollection));
						});

						_.each(nations.models, function(names) {
							pieCollection.findWhere({
								"label" : names.get("id")
							}).set("label", names.get("description"))
						});

						var pieView = new PieChartView({
							collection : pieCollection
						})

						pieView.flush();
						pieView.render();

					}
				});
			}
		});

	},

	Bar : function() {
		// Display the number of questionnaires answered by each student in a
		// single chart
		
		$('#content').css("display","inline-flex");
		$('#task_table').css("display","none");
		$('#barChart').remove();
		$('#pieChart').remove();
		$('#pyramid').remove();
		$('.donut').remove();
		$('.legend').remove();
		$('#dashboard').remove();
		

		var studentQuestionnaires = new TableCollection;

		var studentQuestionnairesHolder = new Backbone.Collection;

		studentQuestionnaires.fetch({
			success : function() {

				_.each(studentQuestionnaires.models, function(sQuestion) {

					BarModel = new d3BarModel;

					var student_number = sQuestion.get("student_number");

					var find_result = studentQuestionnairesHolder.findWhere({
						s_id : student_number
					});

					if (!find_result) {
						BarModel.set("s_id", student_number);
						var X = BarModel.get("count");
						BarModel.set("count", X + 1);
						studentQuestionnairesHolder.add(BarModel);
					} else {
						var Y = find_result.get("count");
						find_result.set("count", Y + 1);
					}

				});

				// create view and pass collection
				var barView = new BarChartView({
					collection : studentQuestionnairesHolder
				});

				barView.render();

			}
		});

	},

	Pyramid : function() {
		
		
		$('#content').css("display","none");
		$('#task_table').css("display","none");
		$('#barChart').remove();
		$('#pieChart').remove();
		$('#pyramid').remove();
		$('.donut').remove();
		$('.legend').remove();
		$('#dashboard').remove();

		var taskList = new TaskCollection;

		// var questionTask = new PyramidModel;
		var tempCollection = new Backbone.Collection;

		taskList.fetch({
			success : function() {
				_.each(taskList.models, function(taskListModel) {
					// alert(taskListModel.get("task_id"));
					var questionByTask = new PyramidModel({
						id : taskListModel.get("task_id"),
						rmse : 0,
						mwl : 0
					});

					questionByTask.fetch({
						success : function(Model) {

							var temp = Model.attributes;

							var count_attributes = 0;

							_.each(temp, function() {
								// console.log(temp);
								count_attributes++;
							});

							// alert(count_attributes);

							for (i = 0; i < count_attributes; i++) {
								tempCollection.add(temp[i]);
							}

						}
					});

				});

				// console.log(JSON.stringify(tempCollection.toJSON()));
				$.when(taskList.fetch()).done(function() {

					var myPyramidView = new PyramidView({
						collection : tempCollection
					});

					myPyramidView.render();
				});

			}
		});

	},

	Donuts : function() {
		
		$('#content').css("display","inline");
		$('#task_table').css("display","none");
		$('#barChart').remove();
		$('#pieChart').remove();
		$('#pyramid').remove();
		$('.donut').remove();
		$('.legend').remove();
		$('#dashboard').remove();

		
		var taskList = new TaskCollection;
		
		var number_of_tasks = 0;

		// var questionTask = new PyramidModel;
		var tempCollection = new Backbone.Collection;

		taskList.fetch({
			success : function() {
				_.each(taskList.models, function(taskListModel) {
					// alert(taskListModel.get("task_id"));
					var questionByTask = new PyramidModel({
						id : taskListModel.get("task_id"),
						rmse : 0,
						mwl : 0
					});

					questionByTask.fetch({
						success : function(Model) {

							var temp = Model.attributes;

							var count_attributes = 0;

							_.each(temp, function() {
								// console.log(temp);
								count_attributes++;
							});

							// alert(count_attributes);

							for (i = 0; i < count_attributes; i++) {
								tempCollection.add(temp[i]);
								number_of_tasks++;
							}
							
						}
					});

				});

				// console.log(JSON.stringify(tempCollection.toJSON()));
				$.when(taskList.fetch()).done(function() {
					
					//console.log(JSON.stringify(tempCollection.toJSON()))
					
					console.log(number_of_tasks);
					
					var donutCollection = new Backbone.Collection;
					
					_.each(tempCollection.models, function (currentModel) {
						
						var donut_task_number = currentModel.get("task_number");
						
						var holder_collection = donutCollection.findWhere({task : donut_task_number});
						
						if(!holder_collection)
							{
								var myDonutModel = new DonutModel();
								myDonutModel.set("task",donut_task_number);
								myDonutModel.set("count",1);
								myDonutModel.set("total_tasks",number_of_tasks);
								donutCollection.add(myDonutModel);
							}
						else
							{
								holder_collection.set("count",(holder_collection.get("count") + 1));
							}
						

						
					});
					
					//console.log(JSON.stringify(donutCollection.toJSON()))

					var myDounts = new DonutView({
						collection : donutCollection,
						total_tasks : number_of_tasks
					});

					myDounts.render();
				});

			}
		});
		
	},
	
	Dashboard : function() 
	{
		$('#content').css("display","inline");
		$('#task_table').css("display","none");
		$('#barChart').remove();
		$('#pieChart').remove();
		$('#pyramid').remove();
		$('#dashboard').remove();
		$('.donut').remove();
		$('.legend').remove();
		
		$('#content').append("<img id='Load' width='400' height='400' src='images/loading.gif' alt='Loading'>");
		$('#content').prepend("<div id='dashboard'></div>");
		
		
		var taskList = new TableCollection;
		
		var number_of_tasks = 0;

		var tempCollection = new Backbone.Collection;
		

		taskList.fetch({
			success : function() {
				
				_.each(taskList.models, function(taskListModel) {
					
					var questionByTask = new SingleQuestion({
						id : taskListModel.get("id")
					});

					questionByTask.fetch({
						success : function(Model) {

							var myDashboardmodel = new DashboardModel();
							
							myDashboardmodel.set("task_id", Model.get("details").task_number);
							
							var type = Model.get("questionnaireType");
							
							myDashboardmodel.set(type,Model.get("questionnaireValue"));
								
							//console.log(JSON.stringify(myDashboardmodel.toJSON()));
							
							tempCollection.add(myDashboardmodel);
							
						}
					});

				});
				
				$.when(taskList.fetch()).done(function() {
					
					var dashboardCollection = new Backbone.Collection;
					
					_.each(tempCollection.models, function (currentModel) 
					{
						
						var returnDashboard = Backbone.Model.extend(
								{
									defaults : {
										task_id : 0,
									}}
								);
						
						
						var ex = dashboardCollection.findWhere({task_id : currentModel.get("task_id") });
						
						
						if(!ex)
							{
								//console.log("entered if")
								
								var starting_point = new returnDashboard();
								
								starting_point.set("task_id", currentModel.get("task_id"));
								
								starting_point.set({freq : 
												{
													NASA : currentModel.get("NASA") , 
													AT : currentModel.get("AT"), 
													WP : currentModel.get("WP")}
										
												});
								
								//console.log(starting_point);
								
								dashboardCollection.add(starting_point);
							}
						else{
								//console.log(JSON.stringify(exists.toJSON()));
								//console.log("entered else");
								//console.log(JSON.stringify(ex));
							
								var tempNASA = ex.get("freq").NASA;
								var tempAT = ex.get("freq").AT;
								var tempWP = ex.get("freq").WP;
							
								var myNASA = parseInt(currentModel.get("NASA")) + parseInt(tempNASA);
								var myAT = parseInt(currentModel.get("AT")) + parseInt(tempAT);
								var myWP = parseInt(currentModel.get("WP")) + parseInt(tempWP);
								
								
								var starting_point = new returnDashboard();
								
								starting_point.set("task_id", currentModel.get("task_id"));
								starting_point.set("freq", { NASA : myNASA, AT : myAT, WP : myWP});
								
								//console.log(JSON.stringify(starting_point.toJSON()));
								
								dashboardCollection.add(starting_point);
								
								dashboardCollection.remove(ex);
								
							}
						
						
					});
					
					console.log(JSON.stringify(dashboardCollection.toJSON()))
					var myDash = new DashboardView({
						collection : dashboardCollection,

					});

					$('#Load').remove();
					myDash.render();

				});

			}
		});
		
	}

});

// Base Url
var baseUrl = "http://www.lucalongo.eu/courses/2014-2015/questionnaireDIT/app/index.php";

// Base Model
var BaseModel = Backbone.Model.extend();

var questPerTask = Backbone.Model.extend({
	defaults : {
		t_number : 0,
		rmse : 0,
		mwl : 0,
		id : 0
	}
});

var DonutModel =  Backbone.Model.extend({
	defaults : {
		task : 0,
		count : 0,
		total_tasks : 0 
	}
});

var DashboardModel =  Backbone.Model.extend({
	defaults : {task_id : 0 , NASA:0, AT:0, WP:0}
});



var TableCollection = Backbone.Collection.extend({
	model : BaseModel,
	url : this.baseUrl + "/questionnaires"
});

var TaskCollection = Backbone.Collection.extend({
	model : BaseModel,
	url : this.baseUrl + "/tasks"
});

var StudentCollection = Backbone.Collection.extend({
	model : BaseModel,
	url : this.baseUrl + "/students"
});

var PyramidModel = Backbone.Model.extend({
	urlRoot : this.baseUrl + "/questionnaires/task"
})

var countryModel = Backbone.Model.extend({
	defaults : {
		label : "--",
		value : 1
	}
});

var SingleQuestion = Backbone.Model.extend({
	urlRoot : this.baseUrl + "/questionnaires"
});


// table model
var TableModel = Backbone.Model.extend({
	model : BaseModel,
	urlRoot : this.baseUrl + "/questionnaires"

});

var NationCollection = Backbone.Collection.extend({
	model : BaseModel,
	url : this.baseUrl + "/nationalities"
})

var d3BarModel = Backbone.Model.extend({
	defaults : {
		s_id : "--",
		count : 0
	}
});

// temp model
var TempModel = Backbone.Model.extend({
	defaults : {
		time : 10,
		taskID : 0,
		Q_ID : 0,
		Student_ID : 0,
		RMSE : 0,
		MWL : 0,
		Q_type : 0,
		Q_value : 0,
		intrusiveness : 0
	}
});

/**
 * VIEWS
 */


//TableView
var TableHomeView = Backbone.View.extend({

	$content : $("#task_table"),

	template : _.template($("#table-template").html()),

	render : function() {
		var self = this;

		var count = 0;

		_.each(this.collection.models, function(itterator) {

			var singleQuestion = new SingleQuestion({
				id : itterator.get('id')
			});

			singleQuestion.fetch({
				success : function() {
					var mytempModel = new TempModel();

					var time = timeSubtraction(itterator.get("time_2"),
							itterator.get("time_1"));

					mytempModel.set("time", time);
					mytempModel.set("taskID", itterator.get("task_number"));
					mytempModel.set("Q_ID", itterator.get("id"));
					mytempModel.set("Student_ID", itterator
							.get("student_number"));

					mytempModel.set("Q_type", singleQuestion
							.get("questionnaireType"));
					mytempModel.set("Q_value", singleQuestion
							.get("questionnaireValue"));

					var RMSE = singleQuestion.get("details").rmse_value;
					var MWL = singleQuestion.get("details").mwl_value;
					var INT = singleQuestion.get("details").intrusiveness;

					mytempModel.set("RMSE", RMSE);
					mytempModel.set("MWL", MWL);
					mytempModel.set("intrusiveness", INT);


					self.$content.append(self.template(mytempModel.toJSON()));

				}
			});

		});

	},

	flush : function() {
		this.$el.empty(); // jquery method
	}

});

// task2 view
var PieChartView = Backbone.View.extend({
	render : function() {
		pie = new d3pie("pieChart", {
			header : {
				title : {
					text : "Students By Nation"
				}
			},
			data : {
				content : this.collection.toJSON()
			}
		});

	},
	flush : function() {
		this.$el.empty(); // jquery method
	}
});


// Task3 View
var BarChartView = Backbone.View.extend({
	render : function() {
		var margin = {
			top : 20,
			right : 20,
			bottom : 200,
			left : 40
		}, width = 1300 - margin.left - margin.right, height = 500 - margin.top
				- margin.bottom;

		var x = d3.scale.ordinal().rangeRoundBands([ 0, width ], .1);

		var y = d3.scale.linear().range([ height, 0 ]);

		var xAxis = d3.svg.axis().scale(x).orient("bottom");

		var yAxis = d3.svg.axis().scale(y).orient("left").ticks(20);

		var svg = d3.select("#content").append("svg").attr("id","barChart").attr("width",
				width + margin.left + margin.right).attr("height",
				height + margin.top + margin.bottom).append("g").attr(
				"transform",
				"translate(" + margin.left + "," + margin.top + ")");

		var data = this.collection.toJSON();

		// console.log(this.collection.toJSON());

		x.domain(data.map(function(d) {
			return d.s_id;
		}));
		y.domain([ 0, d3.max(data, function(d) {
			return d.count;
		}) ]);

		svg.append("g").attr("class", "x axis").attr("transform",
				"translate(0," + height + ")").call(xAxis).selectAll("text")
				.style("text-anchor", "end").attr("dx", "-1em").attr("dy",
						"-.40em").attr("transform", function(d) {
					return "rotate(-90)"
				});

		svg.append("g").attr("class", "y axis").call(yAxis).append("text")
				.attr("transform", "rotate(-90)").attr("y", 6).attr("dy",
						".71em").style("text-anchor", "end").text("Total");

		svg.selectAll(".bar").data(data).enter().append("rect").attr("class",
				"barChartRect").attr("x", function(d) {
			return x(d.s_id);
		}).attr("width", x.rangeBand()).attr("y", function(d) {
			return y(d.count);
		}).attr("height", function(d) {
			return height - y(d.count);
		});

	}
});

// task 4
var PyramidView = Backbone.View
		.extend({
			render : function() {

				// console.log(JSON.stringify(this.collection.toJSON()));
				var margin = {
					top : 20,
					right : 40,
					bottom : 30,
					left : 20
				}, width = 960 - margin.left - margin.right, height = 500
						- margin.top - margin.bottom, barWidth = 10;

				var data = [ {
					people : 100,
					year : 1,
					age : 5,
					sex : 1
				}, {
					people : 100,
					year : 1,
					age : 5,
					sex : 0
				}, {
					people : 200,
					year : 2,
					age : 10
				}, {
					people : 17900,
					year : 3,
					age : 15
				} ];

				var x = d3.scale.linear().range(
						[ barWidth / 2, width - barWidth / 2 ]);

				var y = d3.scale.linear().range([ height, 0 ]);

				var yAxis = d3.svg.axis().scale(y).orient("right").tickSize(
						-width).tickFormat(function(d) {
					return Math.round(d / 1e6);
				});

				// An SVG element with a bottom-right origin.
				var svg = d3.select("body").append("svg").attr("id","pyramid").attr("width",
						width + margin.left + margin.right).attr("height",
						height + margin.top + margin.bottom).append("g").attr(
						"transform",
						"translate(" + margin.left + "," + margin.top + ")");

				// A sliding container to hold the bars by total.
				var totals = svg.append("g").attr("class", "totals");

				// A label for the current year.
				var title = svg.append("text").attr("class", "title").attr(
						"dy", ".71em").text(2);

				// Convert strings to numbers.
				data.forEach(function(d) {
					d.people = +d.people;
					d.year = +d.year;
					d.age = +d.age;
				});

				// Compute the extent of the data set in age and years.
				var age1 = d3.max(data, function(d) {
					return d.age;
				}), year0 = d3.min(data, function(d) {
					return d.year;
				}), year1 = d3.max(data, function(d) {
					return d.year;
				}), year = year1;

				// Update the scale domains.
				x.domain([ year1 - age1, year1 ]);
				y.domain([ 0, d3.max(data, function(d) {
					return d.people;
				}) ]);

				// Produce a map from year and total to [male, female].
				data = d3.nest().key(function(d) {
					return d.year;
				}).key(function(d) {
					return d.age;
				}).rollup(function(v) {
					return v.map(function(d) {
						return d.people;
					});
				}).map(data);

				// Add an axis to show the population values.
				svg.append("g").attr("class", "y axis").attr("transform",
						"translate(" + width + ",0)").call(yAxis)
						.selectAll("g").filter(function(value) {
							return !value;
						}).classed("zero", true);

				// Add labeled rects for each total (so that no enter or exit is
				// required).
				var total = totals.selectAll(".total").data(
						d3.range(year0 - age1, year1 + 1, 5)).enter().append(
						"g").attr("class", "total").attr("transform",
						function(total) {
							return "translate(" + x(total) + ",0)";
						});

				total.selectAll("rect").data(function(total) {
					return data[year][total] || [ 0, 0 ];
				}).enter().append("rect").attr("x", -barWidth / 2).attr(
						"width", barWidth).attr("y", y).attr("height",
						function(value) {
							return height - y(value) + 46;
						});

				// Add labels to show total.
				total.append("text").attr("y", height).text(function(total) {
					return total;
				});

				// Add labels to show age (separate; not animated).
				svg.selectAll(".age").data(d3.range(0, age1 + 1, 1)).enter()
						.append("text").attr("class", "age").attr("x",
								function(age) {
									return x(year - age);
								}).attr("y", height + 4).attr("dy", ".71em")
						.text(function(age) {
							return age;
						});

				// Allow the arrow keys to change the displayed year.
				window.focus();
				d3.select(window).on("keydown", function() {
					switch (d3.event.keyCode) {
					case 37:
						year = Math.max(year0, year - 1);
						break;
					case 39:
						year = Math.min(year1, year + 1);
						break;
					}
					update();
				});

				function update() {
					if (!(year in data))
						return;
					title.text(year);

					totals.transition().duration(750).attr("transform",
							"translate(" + (x(year1) - x(year)) + ",0)");

					total.selectAll("rect").data(function(total) {
						return data[year][total] || [ 0, 0 ];
					}).transition().duration(750).attr("y", y).attr("height",
							function(value) {
								return 20
							});
				}

			}
		});

//task 5 view
var DonutView = Backbone.View.extend({
	render : function() {

		var radius = 74, padding = 10;

		var color = d3.scale.ordinal().range(
				[ "#FF0000", "#0000FF" ]);

		var arc = d3.svg.arc().outerRadius(radius).innerRadius(radius - 30);

		var pie = d3.layout.pie().sort(null).value(function(d) {
			return d.population;
		});

		var data = this.collection.toJSON();

		color.domain(d3.keys(data[0]).filter(function(key) {
			return key !== "task";
		}));

		data.forEach(function(d) {
			d.ages = color.domain().map(function(name) {
				return {
					name : name,
					population : +d[name]
				};
			});
		});

		var legend = d3.select("#content").append("svg").attr("class", "legend")
				.attr("width", radius * 2).attr("height", radius * 1.5)
				.selectAll("g").data(color.domain().slice().reverse()).enter()
				.append("g").attr("transform", function(d, i) {
					return "translate(0," + i * 20 + ")";
				});

		legend.append("rect").attr("width", 18).attr("height", 18).style(
				"fill", color);

		legend.append("text").attr("x", 24).attr("y", 9).attr("dy", ".35em")
				.text(function(d) {
					if(d == "count")
						{
							return "Completed Questionnaires"
						}
					else if ( d == "total_tasks")
						{
							return "Questionnaires Recorded";
						}
					else
						{
							return d;
						}
				});

		var svg = d3.select("#content").selectAll(".pie").data(data).enter()
				.append("svg").attr("class", "donut").attr("width", radius * 2)
				.attr("height", radius * 2).append("g").attr("transform",
						"translate(" + radius + "," + radius + ")");

		svg.selectAll(".arc").data(function(d) {
			return pie(d.ages);
		}).enter().append("path").attr("class", "arc").attr("d", arc).style(
				"fill", function(d) {
					return color(d.data.name);
				});

		svg.append("text").attr("dy", ".35em").style("text-anchor", "middle")
				.text(function(d) {
					return d.task;
				});

	}
});

//task 6
var DashboardView = Backbone.View.extend({
	
	render : function ()
	{
		var freqData= this.collection.toJSON();

		dashboard('#dashboard',freqData);
		
		
		function dashboard(id, fData){
		    var barColor = 'steelblue';
		    function segColor(c){ return {NASA:"#807dba", AT:"#e08214",WP:"#41ab5d"}[c]; }
		    
		    // compute total for each task_id.
		    fData.forEach(function(d){d.total=d.freq.NASA+d.freq.AT+d.freq.WP;});
		    
		    // function to handle histogram.
		    function histoGram(fD){
		        var hG={},    hGDim = {t: 60, r: 0, b: 30, l: 0};
		        hGDim.w = 500 - hGDim.l - hGDim.r, 
		        hGDim.h = 300 - hGDim.t - hGDim.b;
		            
		        //create svg for histogram.
		        var hGsvg = d3.select(id).append("svg")
		            .attr("width", hGDim.w + hGDim.l + hGDim.r)
		            .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
		            .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

		        // create function for x-axis mapping.
		        var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
		                .domain(fD.map(function(d) { return d[0]; }));

		        // Add x-axis to the histogram svg.
		        hGsvg.append("g").attr("class", "x axis")
		            .attr("transform", "translate(0," + hGDim.h + ")")
		            .call(d3.svg.axis().scale(x).orient("bottom"));

		        // Create function for y-axis map.
		        var y = d3.scale.linear().range([hGDim.h, 0])
		                .domain([0, d3.max(fD, function(d) { return d[1]; })]);

		        // Create bars for histogram to contain rectangles and freq labels.
		        var bars = hGsvg.selectAll(".bar").data(fD).enter()
		                .append("g").attr("class", "bar");
		        
		        //create the rectangles.
		        bars.append("rect")
		            .attr("x", function(d) { return x(d[0]); })
		            .attr("y", function(d) { return y(d[1]); })
		            .attr("width", x.rangeBand())
		            .attr("height", function(d) { return hGDim.h - y(d[1]); })
		            .attr('fill',barColor)
		            .on("mouseover",mouseover)// mouseover is defined below.
		            .on("mouseout",mouseout);// mouseout is defined below.
		            
		        //Create the frequency labels above the rectangles.
		        bars.append("text").text(function(d){ return d3.format(",")(d[1])})
		            .attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
		            .attr("y", function(d) { return y(d[1])-5; })
		            .attr("text-anchor", "middle");
		        
		        function mouseover(d){  // utility function to be called on mouseover.
		            // filter for selected task_id.
		            var st = fData.filter(function(s){ return s.task_id == d[0];})[0],
		                nD = d3.keys(st.freq).map(function(s){ return {type:s, freq:st.freq[s]};});
		               
		            // call update functions of pie-chart and legend.    
		            pC.update(nD);
		            leg.update(nD);
		        }
		        
		        function mouseout(d){    // utility function to be called on mouseout.
		            // reset the pie-chart and legend.    
		            pC.update(tF);
		            leg.update(tF);
		        }
		        
		        // create function to update the bars. This will be used by pie-chart.
		        hG.update = function(nD, color){
		            // update the domain of the y-axis map to reflect change in frequencies.
		            y.domain([0, d3.max(nD, function(d) { return d[1]; })]);
		            
		            // Attach the new data to the bars.
		            var bars = hGsvg.selectAll(".bar").data(nD);
		            
		            // transition the height and color of rectangles.
		            bars.select("rect").transition().duration(500)
		                .attr("y", function(d) {return y(d[1]); })
		                .attr("height", function(d) { return hGDim.h - y(d[1]); })
		                .attr("fill", color);

		            // transition the frequency labels location and change value.
		            bars.select("text").transition().duration(500)
		                .text(function(d){ return d3.format(",")(d[1])})
		                .attr("y", function(d) {return y(d[1])-5; });            
		        }        
		        return hG;
		    }
		    
		    // function to handle pieChart.
		    function pieChart(pD){
		        var pC ={},    pieDim ={w:250, h: 250};
		        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;
		                
		        // create svg for pie chart.
		        var piesvg = d3.select(id).append("svg")
		            .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
		            .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");
		        
		        // create function to draw the arcs of the pie slices.
		        var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(0);

		        // create a function to compute the pie slice angles.
		        var pie = d3.layout.pie().sort(null).value(function(d) { return d.freq; });

		        // Draw the pie slices.
		        piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
		            .each(function(d) { this._current = d; })
		            .style("fill", function(d) { return segColor(d.data.type); })
		            .on("mouseover",mouseover).on("mouseout",mouseout);

		        // create function to update pie-chart. This will be used by histogram.
		        pC.update = function(nD){
		            piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
		                .attrTween("d", arcTween);
		        }        
		        // Utility function to be called on mouseover a pie slice.
		        function mouseover(d){
		            // call the update function of histogram with new data.
		            hG.update(fData.map(function(v){ 
		                return [v.task_id,v.freq[d.data.type]];}),segColor(d.data.type));
		        }
		        //Utility function to be called on mouseout a pie slice.
		        function mouseout(d){
		            // call the update function of histogram with all data.
		            hG.update(fData.map(function(v){
		                return [v.task_id,v.total];}), barColor);
		        }
		        // Animating the pie-slice requiring a custom function which specifies
		        // how the intermediate paths should be drawn.
		        function arcTween(a) {
		            var i = d3.interpolate(this._current, a);
		            this._current = i(0);
		            return function(t) { return arc(i(t));    };
		        }    
		        return pC;
		    }
		    
		    // function to handle legend.
		    function legend(lD){
		        var leg = {};
		            
		        // create table for legend.
		        var legend = d3.select(id).append("table").attr('class','legend');
		        
		        // create one row per segment.
		        var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");
		            
		        // create the first column for each segment.
		        tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
		            .attr("width", '16').attr("height", '16')
					.attr("fill",function(d){ return segColor(d.type); });
		            
		        // create the second column for each segment.
		        tr.append("td").text(function(d){ return d.type;});

		        // create the third column for each segment.
		        tr.append("td").attr("class",'legendFreq')
		            .text(function(d){ return d3.format(",")(d.freq);});

		        // create the fourth column for each segment.
		        tr.append("td").attr("class",'legendPerc')
		            .text(function(d){ return getLegend(d,lD);});

		        // Utility function to be used to update the legend.
		        leg.update = function(nD){
		            // update the data attached to the row elements.
		            var l = legend.select("tbody").selectAll("tr").data(nD);

		            // update the frequencies.
		            l.select(".legendFreq").text(function(d){ return d3.format(",")(d.freq);});

		            // update the percentage column.
		            l.select(".legendPerc").text(function(d){ return getLegend(d,nD);});        
		        }
		        
		        function getLegend(d,aD){ // Utility function to compute percentage.
		            return d3.format("%")(d.freq/d3.sum(aD.map(function(v){ return v.freq; })));
		        }

		        return leg;
		    }
		    
		    // calculate total frequency by segment for all task_id.
		    var tF = ['NASA','AT','WP'].map(function(d){ 
		        return {type:d, freq: d3.sum(fData.map(function(t){ return t.freq[d];}))}; 
		    });    
		    
		    // calculate total frequency by task_id for all segment.
		    var sF = fData.map(function(d){return [d.task_id,d.total];});

		    var hG = histoGram(sF), // create the histogram.
		        pC = pieChart(tF), // create the pie-chart.
		        leg= legend(tF);  // create the legend.
		}
	}
});

function timeSubtraction(X, Y) {
	var X_split = X.split(":");
	var Y_split = Y.split(":");

	var X_split_hours = (parseInt(X_split[0]) * 60) * 60;
	var X_split_min = parseInt(X_split[1]) * 60;
	var X_split_sec = parseInt(X_split[2]);

	var Y_split_hours = (parseInt(Y_split[0]) * 60) * 60;
	var Y_split_min = parseInt(Y_split[1]) * 60;
	var Y_split_sec = parseInt(Y_split[2]);

	var total = (X_split_hours + X_split_min + X_split_sec)
			- (Y_split_hours + Y_split_min + Y_split_sec);
	return total / 60;
}

// Init the App Router
new AppRouter();
Backbone.history.start();
