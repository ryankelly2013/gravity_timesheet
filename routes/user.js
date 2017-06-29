var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Models = require("../models");
const crypto = require('crypto');

function handleError(err) {
	console.log(err.stack);
}

//Get user with associated user id, if it exists
router.get('/', function(req, res) {
	var user_id_in = req.query.id;
	if(!mongoose.Types.ObjectId.isValid(user_id_in)) {
		res.json({success: false, message: "Invalid user id"});
	}
	else {
		Models.User.findOne({_id: user_id_in}, function(err, user) {
			if(err) return handleError(err);
			else if(user == null) {
				res.json({success: false, message: "Invalid user id"});
			}
			else {
				res.json({success: true, user: user });
			}
		});
	}
});

//Creates new user if not duplicate
router.post('/', function(req, res) {
	var username = req.body.username;
	var name = req.body.name;
	var password = req.body.password;
	var company_id = req.body.company_id;
	var accessType = req.body.accessType;
	var project_ids = req.body.project_ids;

	//Encrypt the password
	const hash = crypto.createHash('sha256');
  hash.update(password + username); //password hashed and salted
  var password_hashed = hash.digest('hex');

  Models.User.findOneAndUpdate({username: username}, {$setOnInsert: {"name": name, "password": password_hashed, "companyId": company_id, "accessType": accessType, "projectIds": project_ids}}, {upsert: true}, function(err, user_result) {
  	if(err) return handleError(err);
  	else if(user_result == null) {
  		//creation successful
  		res.json({success: true, message: "User creation successful"});
  	}
  	else {
  		//duplicate username
  		res.json({success: false, message: "Duplicate username"});
  	}
  });
});

//Adds new project to user, if user and project exists
router.put('/project', function(req,res) {
	var user_id = req.body.user_id;
	var project_id = req.body.project_id;

	//First check that user and project ids are valid
	if(!mongoose.Types.ObjectId.isValid(user_id)) {
		res.json({success: false, message: "Invalid user id"});
	}
	else if(!mongoose.Types.ObjectId.isValid(project_id)) {
		res.json({success: false, message: "Invalid project id"});	
	}
	else {
		//Won't be atomic, however don't think this will be an issue
		Models.User.findOne({_id: user_id}, function(err, user) {
			if(err) return handleError(err);
			else if(user == null) {
				res.json({success: false, message: "Invalid user id"});
			}
			else {
				//Check that this project already hasn't been added
				for(var i = 0; i < user.projectIds.length; ++i) {
					if(String(user.projectIds[i]) === String(project_id)) {
						res.json({success: false, message: "Project already added to user"});
						return;
					}
				}

				//Check that project exists
				Models.Project.findOne({_id: project_id}, function(err, project) {
					if(err) return handleError(err);
					else if(project == null) {
						res.json({success : false, message: "Invalid project id"});
					}
					else {						
						//Checks hold up, add project
						Models.User.update({_id: user_id}, {$push : {"projectIds": project_id}}, function(err, n) {
							if(err) return handleError(err);
							else {
								res.json({success: true, message: "Project added to user"});
							}
						});
					}
				});
			}
		});
	}
});

module.exports = router;












