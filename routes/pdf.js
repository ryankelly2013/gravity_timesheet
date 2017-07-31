var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Models = require("../models");
var pdf = require('html-pdf');
var fs = require('fs');

function handleError(err) {
	console.log(err.stack);
}



function generate_html_single(user_name, projectname, timesheet) {
	var html = "<div class = 'page'>";
	html += "<h4 style='text-align: center;' >" + projectname + "</h4><h4 style='text-align: center;'>" + user_name + "</h4>";
	html += "<table class = 'table table-condensed table-hover' width='100%'><thead><tr><th class = 'col-md-2'>Day</th><th class = 'col-md-2'>Time</th><th class = 'col-md-8'>Activities</th></tr></thead><tbody>"

	var total_time = 0;
	//Build table here
	for(var i = 0; i < timesheet.data.length; ++i) {
		var current_day = timesheet.data[i];
		var current_date = new Date(current_day.day);
		//Next, display the selected month
		var month = current_date.getMonth();
		var dt = current_date.getDate();

		total_time += current_day.time;

		html += "<tr><td style='max-width: 5mm;'>" + (month + 1) + "/" + dt + "</td><td style='max-width: 5mm;'>" + current_day.time.toFixed(2) + "</td><td style='max-width: 65mm;'>" + current_day.description + "</td></tr>";
	}

	html += "</tbody></table><h4>Total: " + total_time.toFixed(2);



	html += "</h4></div>";
	return html;
}

//Creates the html for this user, this project, for this month
//And returns { html: the html, filename: the filename }
function create_html(requested_username, account_username, project_id, month, day, year, mass, callback) {
	var html = "<html><head><link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'>";
	html += "<script src='https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js'></script>";
	html += "<script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'></script>";
	html += "<style>html, body { margin: 0; padding: 0; font: 14px 'Lucida Grande', Helvetica, Arial, sans-serif; }";
	html += ".page { position: relative; width: 150mm; display: block; page-break-after: always; margin: 20px; }  table tr th { font-size: 12px; } table tr td{ height: 20px; font-size: 10px; }</style></head>";
	html += "<body>"

	//Depending on if mass, find all the information I need


	//Get the project info
	Models.Project.findOne({_id: project_id}, function(err, project) {
		if(err) return handleError(err);
		else if(project != null){

			//Got my project info, now find all the users I need
			Models.User.findOne({username: account_username}, function(err, account_user) {
				if(err) return handleError(err);
				else if(account_user != null) { 
					var query = {};


					//Step 1: get a list of all the users we need
					if(mass && account_user.accessType == 1) {
						//Get users in account_users company
						query = {companyId: account_user.companyId };
					}
					else if(!mass) {
						query = { username: requested_username };
					}

					Models.User.find(query, function(err, users) {
						if(err) return handleError(err);
						else {
							//Step 2: get all those timesheets
							var num_finished = 0;
							for(var i = 0; i < users.length; ++i) {
								var temp_index = i;

								Models.Timesheet.findOne({userId: users[temp_index]._id, projectId: project_id, monthEnd: new Date(year, month, day)}, function(err, timesheet) {
									if(err) return handleError(err);
									else if(timesheet != null) {
										var user_name_temp = "";
										for(var j = 0; j < users.length; ++j) {
											if(String(users[j]._id) == String(timesheet.userId)) {
												user_name_temp = users[j].name;
											}
										}
										html += generate_html_single(user_name_temp, project.name, timesheet);
									}
									num_finished += 1;
									if(num_finished == users.length) {
										html += "</body></html>";
										var result = {};
										if(!mass) {
											result = { html: html, filename: requested_username + "_" + project.name + "_" + (parseInt(month) + 1) + "-" + year + ".pdf"};
										}
										else {
											result = { html: html, filename: project.name + "_all_" + (parseInt(month) + 1) + "-" + year + ".pdf"};
										}
										callback(result);
									} 
								});
							}		
						}
					});
				}
			});
		}
	});
}

//Need to generate this html, then save 
router.get('/:requestedUsername/:accountUsername/:projectId/:month/:day/:year', function(req, res) {
	var requested_username = req.params.requestedUsername;
	var project_id = req.params.projectId;
	var month = req.params.month;
	var day = req.params.day;
	var year = req.params.year;
	var mass_in = req.query.mass;
	var account_username = req.params.accountUsername;
	var mass = (mass_in == 'true');


	create_html(requested_username, account_username, project_id, month, day,year, mass, function(html_data) {
		var html = html_data.html;
		var filename = html_data.filename;
		filename = filename.replace(/ /g,"_");
		filename = encodeURIComponent(filename);

		var config = {
			"height": "11in", 
		  "width": "8.5in",
		  "header": {
    		"height": "5mm"
    	},
    	"footer": {
    		"height": "5mm"
    	}

		}


		pdf.create(html, config).toBuffer(function(err, buffer) {
	  	if (err) return handleError(err);
		  res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
		  res.setHeader('Content-type', 'application/pdf');
	    res.end(buffer, 'binary');

		});


	});


	
});



module.exports = router;












