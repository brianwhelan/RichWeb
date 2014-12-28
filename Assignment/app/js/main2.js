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
		"task4" : "Pyramid"
	},

	Table : function() {

		$(document).ready(function() {
			$(task_table).css('display', 'inline');
			$(pieChart).css('display', 'none');
			$(".chart").remove;
		});

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
		$(document).ready(function() {
			$(task_table).css('display', 'none');
			$(pieChart).css('display', 'inline');
			$(".chart").remove();
			
		});

		var nations = new NationCollection;

		// var pie = new d3pie("pieChart", {});

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

						pieView.render();

					}
				});
			}
		});

	},

	Bar : function() {
		// Display the number of questionnaires answered by each student in a
		// single chart
		
		$(document).ready(function() {
			$(task_table).css('display', 'none');
			$(pieChart).css('display', 'none');
			$('content').prepend( "<svg class='chart'></svg>" );
		});

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
		// Display the distributions of MWL values
		// (the attributes of each questionnaire named "rmse_value" and
		// "mwl_value")
		// for each task (DIT lecture). You need to implement one chart for each
		// task (DIT lecture).

		var taskList = new TaskCollection;
		
		//var questionTask = new PyramidModel;
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
							
							_.each(temp, function () { 
								//console.log(temp);
								count_attributes++;
							});
							
							//alert(count_attributes);
							
							for (i = 0; i < count_attributes; i++) { 
								tempCollection.add(temp[i]);
							}
							
						}
					});

				});
				
				//console.log(JSON.stringify(tempCollection.toJSON()));
				$.when(taskList.fetch()).done(function(){
					
					var myPyramidView = new PyramidView({
						collection : tempCollection
					});
					
					myPyramidView.render();
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

var AverageCollection = new Backbone.Collection;

var pieCollection = new Backbone.Collection;

var RMSETOTAL = 0;

AverageCollection.on("add", function(AVG) {

	RMSETOTAL = RMSETOTAL + parseInt(AVG.get("RMSE"));

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

// task 4
var PyramidView = Backbone.View.extend({
	render : function() {
		
		 //console.log(JSON.stringify(this.collection.toJSON()));
		var margin = {top: 20, right: 40, bottom: 30, left: 20},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom,
	    barWidth = Math.floor(width / 19) - 1;

	var x = d3.scale.linear()
	    .range([barWidth / 2, width - barWidth / 2]);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("right")
	    .tickSize(-width)
	    .tickFormat(function(d) { return Math.round(d / 1e6) + "M"; });

	// An SVG element with a bottom-right origin.
	var svg = d3.select("body").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// A sliding container to hold the bars by birthyear.
	var birthyears = svg.append("g")
	    .attr("class", "birthyears");

	// A label for the current year.
	var title = svg.append("text")
	    .attr("class", "title")
	    .attr("dy", ".71em")
	    .text(2000);

	d3.csv("movingdata.csv", function(error, data) {

	  // Convert strings to numbers.
	  data.forEach(function(d) {
	    d.people = +d.people;
	    d.year = +d.year;
	    d.age = +d.age;
	  });

	  // Compute the extent of the data set in age and years.
	  var age1 = d3.max(data, function(d) { return d.age; }),
	      year0 = d3.min(data, function(d) { return d.year; }),
	      year1 = d3.max(data, function(d) { return d.year; }),
	      year = year1;

	  // Update the scale domains.
	  x.domain([year1 - age1, year1]);
	  y.domain([0, d3.max(data, function(d) { return d.people; })]);

	  // Produce a map from year and birthyear to [male, female].
	  data = d3.nest()
	      .key(function(d) { return d.year; })
	      .key(function(d) { return d.age; })
	      .rollup(function(v) { return v.map(function(d) { return d.people; }); })
	      .map(data);

	  // Add an axis to show the population values.
	  svg.append("g")
	      .attr("class", "y axis")
	      .attr("transform", "translate(" + width + ",0)")
	      .call(yAxis)
	    .selectAll("g")
	    .filter(function(value) { return !value; })
	      .classed("zero", true);

	  // Add labeled rects for each birthyear (so that no enter or exit is required).
	  var birthyear = birthyears.selectAll(".birthyear")
	      .data(d3.range(year0 - age1, year1 + 1, 5))
	    .enter().append("g")
	      .attr("class", "birthyear")
	      .attr("transform", function(birthyear) { return "translate(" + x(birthyear) + ",0)"; });

	  birthyear.selectAll("rect")
	      .data(function(birthyear) { return data[year][birthyear] || [0, 0]; })
	    .enter().append("rect")
	      .attr("x", -barWidth / 2)
	      .attr("width", barWidth)
	      .attr("y", y)
	      .attr("height", function(value) { return height - y(value); });

	  // Add labels to show birthyear.
	  birthyear.append("text")
	      .attr("y", height - 4)
	      .text(function(birthyear) { return birthyear; });

	  // Add labels to show age (separate; not animated).
	  svg.selectAll(".age")
	      .data(d3.range(0, age1 + 1, 5))
	    .enter().append("text")
	      .attr("class", "age")
	      .attr("x", function(age) { return x(year - age); })
	      .attr("y", height + 4)
	      .attr("dy", ".71em")
	      .text(function(age) { return age; });

	  // Allow the arrow keys to change the displayed year.
	  window.focus();
	  d3.select(window).on("keydown", function() {
	    switch (d3.event.keyCode) {
	      case 37: year = Math.max(year0, year - 1); break;
	      case 39: year = Math.min(year1, year + 1); break;
	    }
	    update();
	  });

	  function update() {
	    if (!(year in data)) return;
	    title.text(year);

	    birthyears.transition()
	        .duration(750)
	        .attr("transform", "translate(" + (x(year1) - x(year)) + ",0)");

	    birthyear.selectAll("rect")
	        .data(function(birthyear) { return data[year][birthyear] || [0, 0]; })
	      .transition()
	        .duration(750)
	        .attr("y", y)
	        .attr("height", function(value) { return height - y(value); });
	  }
	});

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

		var svg = d3.select("body").append("svg").attr("width",
				width + margin.left + margin.right).attr("height",
				height + margin.top + margin.bottom).append("g").attr(
				"transform",
				"translate(" + margin.left + "," + margin.top + ")");

		var data = this.collection.toJSON();
		
		//console.log(this.collection.toJSON());

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
				"bar").attr("x", function(d) {
			return x(d.s_id);
		}).attr("width", x.rangeBand()).attr("y", function(d) {
			return y(d.count);
		}).attr("height", function(d) {
			return height - y(d.count);
		});

	}
});

// TableView
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

					AverageCollection.add(mytempModel);

					self.$content.append(self.template(mytempModel.toJSON()));

				}
			});

		});

	},

	flush : function() {
		this.$el.empty(); // jquery method
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
