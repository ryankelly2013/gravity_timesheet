var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Models = require("../models");

function requireLogin (req, res, next) {
  if (!req.user) {
  	console.log("Redirecting to login");
    res.redirect('/login');
  } else {
    next();
  }
};

function handleError(err) {
	console.log(err.stack);
}

//Callback calls with a {_id(string) to name(string)} dictionary
function get_projectIds(projectIds, callback) {
	var result = {};
	Models.Project.find({_id : {$in : projectIds}}, function(err, projects) {
		if(err) return handleError(err);
		else {
			for(var i = 0; i < projects.length; ++i) {
				result[String(projects[i]._id)] = projects[i].name;
			}
			callback(result);
		}
	});
}

function handle_users(needed_projectIds, result, callback, user_id_list) {
	Models.User.find({_id: {$in : user_id_list }}, '_id name username projectIds', function(err, all_users) {
		if(err) return handleError(err);
		else {
			console.log(all_users);
			for(var i = 0; i < all_users.length; ++i) {
				for(var j = 0; j < all_users[i].projectIds.length; ++j) {
					var found = false;
					for(var k = 0; k < needed_projectIds.length; ++k) {
						if(String(needed_projectIds[k]) === String(all_users[i].projectIds[j])){
							found = true;
						}
					}
					if(!found) {
						needed_projectIds.push(all_users[i].projectIds[j]);
					}
				}
			}

			//Have all the necessary project Ids, query them
			get_projectIds(needed_projectIds, function(project_dict) {
				//Take care of the rest of the users
				for(var i = 0; i < all_users.length; ++i) {
					var current_user = {};
					current_user._id = String(all_users[i]._id);
					current_user.name = all_users[i].name;
					current_user.username = all_users[i].username
					current_user.projects = [];
					for(var j = 0; j < all_users[i].projectIds.length; ++j) {
						current_user.projects.push({_id: String(all_users[i].projectIds[j]), name: project_dict[String(all_users[i].projectIds[j])]});
					}
					result.users.push(current_user);
				}
				//done, now return
				callback(result);
			});
		}
	});
}

function handle_homepage(user_in, callback) {
	var user_id = user_in._id;

	if(!mongoose.Types.ObjectId.isValid(user_id)) {
		callback({success: false, message: "Invalid user id"});
	}
	else {
		Models.User.findOne({_id: user_id}, function(err, user) {
			if(err) return handleError(err);
			else if(user == null) {
				callback({success: false, message: "Invalid user id"});
			}
			else {
				var result = {};
				result.success = true;
				Models.Global.findOne({}, function(err, global) {
					if(err) return handleError(err);
					else {
						result.currentMonthEnd = global.currentMonthEnd;
						result.availableMonths = global.availableMonths;
						result.accountType = user.accessType;
						result.accountUsername = user.username
						result.users = [];
						var needed_projectIds = user.projectIds;
						//Get the project Ids for all the needed projects later

						if(result.accountType === 2) {
							//They're the admin, get list of all u_ids
							Models.User.find({}, '_id', function(err, user_id_list) {
								if(err) return handleError(err);
								else {
									handle_users(needed_projectIds, result, callback, user_id_list);
								}
							});
						}
						else if(result.accountType === 1) {
							//They're the owner of their company
							Models.User.find({companyId : user.companyId}, '_id', function(err, user_id_list) {
								if(err) return handleError(err);
								else {
									handle_users(needed_projectIds, result, callback, user_id_list);
								}
							});
						}
						else {
							//They're standard employee
							var user_id_list = [user_id];
							handle_users(needed_projectIds, result, callback, user_id_list);
						}
					}
				});
			}
		});
	}
}

/* GET home page. */
router.get('/', requireLogin, function(req, res) {
	res.render('index');
	// console.log(req.user);
	// handle_homepage(req.user, function(result) {
	// 	res.render('index');
	// });
});

/* GET home page. */
router.get('/data', requireLogin, function(req, res) {
	handle_homepage(req.user, function(result) {
		res.json(result);
	});
});

router.post('/test', function(req, res) {
	handle_homepage(req.body.user, function(result) {
		res.json(result);
	});
});

router.get('/testconnection', function(req, res) {
	res.send("hello world");
});


module.exports = router;
