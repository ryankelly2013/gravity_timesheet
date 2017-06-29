var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Models = require("../models");

function handleError(err) {
	console.log(err.stack);
}

//Get project with associated project id, if it exists
router.get('/', function(req, res) {
	var project_id_in = req.query.id;
	if(!mongoose.Types.ObjectId.isValid(project_id_in)) {
		res.json({success: false, message: "Invalid project id"});
	}
	else {
		Models.Project.findOne({_id: project_id_in}, function(err, project) {
			if(err) return handleError(err);
			else if(project == null) {
				res.json({success: false, message: "Invalid project id"});
			}
			else {
				res.json({success: true, project: project });
			}
		});
	}
});

//Creates new project if not duplicate
router.post('/', function(req, res) {
	var name = req.body.name;

  Models.Project.findOneAndUpdate({name: name}, {$setOnInsert: {"name": name}}, {upsert: true}, function(err, project_result) {
  	if(err) return handleError(err);
  	else if(project_result == null) {
  		//creation successful
  		res.json({success: true, message: "Project creation successful"});
  	}
  	else {
  		//duplicate name
  		res.json({success: false, message: "Duplicate project name"});
  	}
  });
});

module.exports = router;












