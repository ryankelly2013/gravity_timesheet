var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Models = require("../models");

function handleError(err) {
	console.log(err.stack);
}

//Get timesheet, returns dates in iso string format
router.get('/:username/:projectId/:month/:day/:year', function(req, res) {
	var username = req.params.username;
	var project_id = req.params.projectId;
	var month = req.params.month;
	var day = req.params.day;
	var year = req.params.year;

	Models.User.findOne({username: username}, '_id' , function(err, user) {
		if(err) return handleError(err);
		else if(user === null) {
			res.json({success : false, message: "Invalid username"});
		}
		else {
			var user_id = user._id;
			console.log("user_id: " + user_id + " project_id: " + project_id);
			Models.Timesheet.findOne({ userId: user_id, projectId: project_id, monthEnd: new Date(year, month, day)}, 'data', function(err, timesheet) {
				if(err) return handleError(err);
				else if(timesheet === null) {
					res.json({success : false, message: "Timesheet not found"});
				}
				else {
					res.json({success : true, data: timesheet.data });
				}
			});
		}
	});
});

//Creates new timesheet for specified month
router.post('/', function(req, res) {
	var user_id = req.body.user_id;
	var project_id = req.body.project_id;
	var month = req.body.month; //zero indexed
	var year = req.body.year;
	var day = req.body.day;

	//No error checking for now
	//User valid, create company
	var timesheet = new Models.Timesheet({
		userId: user_id,
		projectId: project_id,
		monthEnd: new Date(year, month, day),
		data: []
	});

	for(var i = 0; i < day; ++i) {
		timesheet.data.push({ day: new Date(year, month, i + 1), time: 0.00, description: "" });
	}

	timesheet.save(function(err) {
		if(err) return handleError(err);
		else {
			res.json({ success: true, message: "Timesheet creation successful"});
		}
	});
});

//Edits timesheet
router.put('/', function(req,res) {
	var user_id = req.body.user_id;
	var project_id = req.body.project_id;
	var month = req.body.month; //zero indexed
	var year = req.body.year;
	var day = req.body.day;
	var data = req.body.data;

	Models.Timesheet.update({ userId: user_id, projectId: project_id, monthEnd: new Date(year, month, day)}, {$set : { data: data}}, function(err, n) {
		if(err) return handleError(err);
		else {
			res.json({success : true, message: "Timesheet updated successfully"});
		}
	});
});



module.exports = router;












