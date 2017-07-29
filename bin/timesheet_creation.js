var request = require('supertest');
var should = require('should'); 
var assert = require('assert'); 
var Models = require("../models");
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


//1. Get all users

//2. For each user, create timesheet in current month with the associated project, via post request

var counter = 0;

Models.Global.findOne({}, function(err, global) {
	if(err) return handleError(err);
	else {


		month_end = global.currentMonthEnd;
		Models.User.find({}, function(err, users) {
			if(err) return handleError(err);
			else {

				users.should.not.equal(null);
				users.should.be.a.Array();
				users.length.should.not.equal(0);

				for(var i = 0; i < users.length; ++i) {
					counter += users[i].projectIds.length;
				}



				for(var i = 0; i < users.length; ++i) {
					for(var j = 0; j < users[i].projectIds.length; ++j) {
						var payload = {
							user_id: users[i]._id,
							project_id: users[i].projectIds[j],
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
								res.body.should.have.property("success");
								res.body.success.should.equal(true);
								counter -= 1;
								if(counter === 0) {
									process.exit(0);
								}
								
							}
						});
					}
				}
			}
		});
	}
});


