var users;
var accountType;
var accountUsername;
var currentMonth;

function isNum(num)
{
    var regex=/^[0-9]+$/;
    if (!num.match(regex))
    {
        return false;
    }
    return true;
}

function get_timesheet(user_id, username, project_id) {
//Get the timesheet for the specified user and project id for the current month
//Then return html to display it

	$.ajax({
	  type: "GET",
	  url: "/timesheet/" + username + "/" + project_id + "/" + currentMonth.getMonth() + "/" + currentMonth.getDate() + "/" + currentMonth.getFullYear(),
	  cache: false,
	  success: function(data){
	  	console.log(data);
	  	//Format the data
	  	var dataSource = [];
	  	data.data.sort(function(a, b) {
	  		a = new Date(a.day);
	  		b = new Date(b.day);
	  		return a - b;
	  	});

	  	function pdf_clicked(mass) {
	  		$("#" + user_id + project_id + "_feedback").addClass("fa fa-spinner fa-spin");

	  		var req = new XMLHttpRequest();
	  		if(mass) {
	  			req.open("GET", "/pdf/" + username + "/" + accountUsername + "/" + project_id + "/" + currentMonth.getMonth() + "/" + currentMonth.getDate() + "/" + currentMonth.getFullYear() + "?mass=true" , true);
	  		}
	  		else {
	  			req.open("GET", "/pdf/" + username + "/" + accountUsername + "/" + project_id + "/" + currentMonth.getMonth() + "/" + currentMonth.getDate() + "/" + currentMonth.getFullYear() + "?mass=false" , true);
	  		}
			  
			  req.responseType = "blob";

			  req.onload = function (event) {
			  	$("#" + user_id + project_id + "_feedback").removeClass("fa fa-spinner fa-spin");
			    var blob = req.response;
			    console.log(blob.size);
			    var link=document.createElement('a');
			    link.href=window.URL.createObjectURL(blob);
			    var filename = "";
			    var disposition = this.getResponseHeader('Content-Disposition');
			    if (disposition && disposition.indexOf('inline') !== -1) {
			        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
			        var matches = filenameRegex.exec(disposition);
			        if (matches != null && matches[1]) { 
			          filename = matches[1].replace(/['"]/g, '');
			        }
			    }
			    link.download=filename;
			    link.click();
			  };

			  req.send();
	  	}

	  	if(accountType === 0) {
	  		$("#" + user_id + project_id).append("<div class = 'row'><div class = 'col-md-7'><div class = 'col-md-1'><i id='" + user_id + project_id + "_feedback' style='font-size:24px'></i></div></div><div class = 'col-md-2'><button id='" + user_id + project_id + "_save' style='width: 100%;' type='button' class='btn btn-primary btn-md disabled'>Save</button></div><div class = 'col-md-2'><button id='" + user_id + project_id + "_pdf' style='width: 100%;' type='button' class='btn btn-primary btn-md'>Generate PDF</button></div></div>");
	  	}
	  	else {
	  		//Owner or admin, give them the generate mass pdf button
	  		$("#" + user_id + project_id).append("<div class = 'row'><div class = 'col-md-5'></div><div class = 'col-md-1'><i id = '" + user_id + project_id + "_feedback' style='font-size:24px'></i></div><div class = 'col-md-2'><button id='" + user_id + project_id + "_save' style='width: 100%;' type='button' class='btn btn-primary btn-md disabled'>Save</button></div><div class = 'col-md-2'><button id='" + user_id + project_id + "_pdf' style='width: 100%;' type='button' class='btn btn-primary btn-md'>Generate PDF</button></div><div class = 'col-md-2'><button id='" + user_id + project_id + "_pdf_mass' style='width: 100%;' type='button' class='btn btn-primary btn-md'>Generate PDF All</button></div></div>");
	  	
	  		$("#" + user_id + project_id + "_pdf_mass").click(function() { 
	  		  pdf_clicked(true);

	  		});

	  	}

	  	
	    $("#" + user_id + project_id).append("<table class = 'table table-hover' id='" + user_id + project_id + "_table' width='100%'><thead><tr><th class = 'col-md-2'>Day</th><th class = 'col-md-2'>Time</th><th class = 'col-md-8'>Description</th></tr></thead><tbody id='" + user_id + project_id + "_body'></tbody></table>");
	  	
	    var total_time = 0;



	  	for(var i = 0; i < data.data.length; ++i) {
	  		var current_day = data.data[i];
	  		var current_date = new Date(current_day.day);

	  		console.log("Returned date object: " + current_day.day);
	  		console.log("month: " + current_date.getMonth() + " day: " + current_date.getDate());

	  		//Next, display the selected month
				var month = current_date.getMonth();
				var dt = current_date.getDate();

				total_time += current_day.time;
				$("#" + user_id + project_id + "_body").append("<tr><td>" + (month + 1) + "/" + dt + "</td><td contentEditable='true'>" + current_day.time.toFixed(2) + "</td><td contentEditable='true'>" + current_day.description + "</td></tr>");
	  	}

	  	//Add the total time at bottom of tabel
	  	$("#" + user_id + project_id).append("<h3 id='" + user_id + project_id + "_totaltime'>Total: " + total_time + "</h3>")

	  	function update_total_time() {
	  		var total_temp = 0;
	    	for(var i = 0; i < data.data.length; ++i) {
	    		total_temp += data.data[i].time;
	    	}
	    	$("#" + user_id + project_id + "_totaltime").text("Total: " + total_temp);
	    }

	  	var original_text = "";
	  	var change = false;

	  	$("#" + user_id + project_id + "_body tr td").focus(function() {
	  		original_text = $(this).text();
	  		var col = $(this).parent().children().index($(this));
	  		if(col === 1 && original_text === "0") {
	  			$(this).text("");
	  		}
	  		
	  	});

	  	$("#" + user_id + project_id + "_body tr td").blur(function() {
	  		if(original_text !== $(this).text()) {
	  			var col = $(this).parent().children().index($(this));
			  	var row = $(this).parent().parent().children().index($(this).parent());

			  	if(col === 1) {
			  		if(!$.isNumeric($(this).text()) || $(this).text() < 0) {
			  			$(this).text(original_text);
			  			return;
			  		}

			  		data.data[row].time = parseFloat(parseFloat($(this).text()).toFixed(2));

			  		$(this).text(data.data[row].time.toFixed(2));
			  		console.log(data.data[row]);
			  		update_total_time();

			  	}
			  	else if(col === 2) {
			  		data.data[row].description = $(this).text();
			  	}

	  			if(!change) {
	  				change = true;
	  				$("#" + user_id + project_id + "_save").removeClass("disabled");
	  			}
	  		}
	  	});

	  	//Make put request when saved
	  	$("#" + user_id + project_id + "_save").click(function() {
	  		var save_button = $("#" + user_id + project_id + "_save");
	  		if(!save_button.hasClass("disabled") && !save_button.hasClass("active")) {
	  			//make it active to let user know it was triggered
	  			save_button.addClass("active");
	  			change = false;

	  			//Make the ajax request
	  			var payload = {
						user_id: user_id,
						project_id: project_id,
						month: currentMonth.getMonth(), //Remember zero indexed
						year: currentMonth.getFullYear(),
						day: currentMonth.getDate(),
						data: data.data
					}

					$("#" + user_id + project_id + "_feedback").addClass("fa fa-spinner fa-spin");

	  			$.ajax({
            url: '/timesheet',
            type: 'PUT',    
            data: JSON.stringify(payload),
            contentType: 'application/json',
            success: function(result) {
            	$("#" + user_id + project_id + "_feedback").removeClass("fa fa-spinner fa-spin");
            	if(result.success) {
            		save_button.removeClass("active");
            		save_button.addClass("disabled");

            		$("#" + user_id + project_id + "_feedback").html("<p id='save_message' style='font-size: 14px;'>Success</p>");
            	}
            	else {
            		$("#" + user_id + project_id + "_feedback").html("<p id='save_message' style='font-size: 14px;'>Unable to save</p>");
            	}
            	setTimeout(function () {
            		$("#save_message").fadeOut(1000, function() {
            			$("#" + user_id + project_id + "_feedback").html("");
            		});
            	}, 2000);
            	
            }
        	});

	  		}	
	  	});


	  	$("#" + user_id + project_id + "_pdf").click(function() { 
	  		  pdf_clicked(false);
	  	});

	  	

	  }
	});

}

function create_inner_pill_html(user, project, is_user) {
	var result = "";
	result += "<div id = '" + user._id + project._id + "' class = 'tab-pane fade";
	if(is_user) {
		result += " in active";
	}
	result += "'>"

	//Get current timesheet
	get_timesheet(user._id, user.username, project._id);

	result += "</div>"

	return result;
}

function create_pill_html(user, is_user) {
	var result = "";
	result += "<div id = '" + user._id + "' class = 'tab-pane fade";
	if(is_user) {
		result += " in active";
	}
	result += "'>"

	if(user.projects.length == 0) {
		//Display note saying there are not projects for this user
		result += "<h3>No projects assigned to this user</h3>";
	}
	else {
		//Add projects pill
		result += "<ul class='nav nav-pills'>";
		//Creat pill for first project
		result += "<li class='active'><a data-toggle='pill' href='#" + user._id + user.projects[0]._id + "'>" + user.projects[0].name + "</a></li>"

		//For each project, create the list item
		for(var i = 1; i < user.projects.length; ++i) {
			result += "<li><a data-toggle='pill' href='#" + user._id + user.projects[i]._id + "'>" + user.projects[i].name + "</a></li>"
		}

		result += "</ul>";

		//Now create the other div
		result += "<div class ='row'></div><div class = 'col-md-11'><div class = 'tab-content'>"

		//Create first tab content
		result += create_inner_pill_html(user, user.projects[0], true);
		//Create the rest of the tab content
		for(var i = 1; i < user.projects.length; ++i) {
			result += create_inner_pill_html(user, user.projects[i], false);
		}

		result += "</div></div></div>"
	}

	result += "</div>";
	

	return result;
	
}



$(document).ready(function () {
	$.ajax({
	  type: "GET",
	  url: "/data",
	  success: function(data){
	     users = data.users;
	     accountType = data.accountType;
	     accountUsername = data.accountUsername;
	     currentMonth = new Date(data.currentMonthEnd);

	   		//First, set up names pill
	   		$("#names_pills").append("<li class='active'><a data-toggle='pill' href='#" + users[0]._id + "'>" + users[0].name + "</a></li>")
	   		$("#tab-content").append(create_pill_html(users[0], true));

	   		for(var i = 1; i < users.length; ++i) {
	   			$("#names_pills").append("<li><a data-toggle='pill' href='#" + users[i]._id + "'>" + users[i].name + "</a></li>");
	   			$("#tab-content").append(create_pill_html(users[i], false));
	   		}
	   		//$("#names").css('display', 'block');
	 

	     	//Next, display the selected month
				var year = currentMonth.getFullYear();
				var month = currentMonth.getMonth() + 1;
				var dt = currentMonth.getDate();

				if (dt < 10) {
				  dt = '0' + dt;
				}
				if (month < 10) {
				  month = '0' + month;
				}

	     $('#selected_month_label').text(month + '-' + dt + '-' + year);

	     //Display the projects for the selected user


	     $("#main_div").css('display', 'block');
	  }
	});	
});




