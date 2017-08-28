var request = require('supertest');
var should = require('should'); 
var assert = require('assert'); 
var Models = require("./models");
var mongoose = require("mongoose");
function handleError(err) {
  should.equal(1, 0, err.stack);
}

var url = "";

if(process.env.NODE_ENV === 'development') {
	console.log("In development url");
	url = 'localhost:3000';
}
else if(process.env.NODE_ENV === 'production') {
	url = 'http://gravitytimesheet.herokuapp.com';
}

var counter = 2;

Models.Global.findOne({}, function(err, global) {
	if(err) return handleError(err);
	else {


		month_end = global.currentMonthEnd;
		Models.User.findOne({'username' : 'roya'}, function(err, users) {
			if(err) return handleError(err);
			else {
					for(var j = 3; j < users.projectIds.length; ++j) {
						var payload = {
							user_id: users._id,
							project_id: users.projectIds[j],
							month: month_end.getMonth(), //Remember zero indexed
							year: month_end.getFullYear(),
							day: month_end.getDate()
						}
						request(url)
						.post('/timesheet')
						.send(payload)
						.set({'Content-Type': 'application/json'})
						.end(function(err, res) {
							if(err) return handleError(err);
							else {
								counter -= 1;
								if(counter === 0) {
									process.exit(0);
								}
								
							}
						});
					}
			}
		});
	}
});


