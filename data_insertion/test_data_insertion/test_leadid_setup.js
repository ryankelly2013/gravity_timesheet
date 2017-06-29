var mongoose = require('mongoose');
var Models = require("../../models");
var assert = require("assert");

function handleError(err) {
	console.log(err.stack);
}

Models.User.find({username: {$in : ["test_owner_1", "test_owner_2"]}}, function(err, users) {
	if(err) return handleError(err);
	else {
		assert(users.length === 2, "Incorrect number of users");
		var owner1_id;
		var owner2_id;
		if(users[0].username === "test_owner_1") {
			owner1_id = users[0]._id;
			owner2_id = users[1]._id;
		}
		else {
			owner1_id = users[1]._id;
			owner2_id = users[0]._id;
		}
		Models.Company.update({name: "Test Company 1"}, {$set : {"lead" : owner1_id}}, function(err, n) {
			if(err) return handleError(err);
			else {
				Models.Company.update({name: "Test Company 2"}, {$set : {"lead": owner2_id}}, function(err, n) {
					if(err) return handleError(err);
					else {
						console.log("Lead ids of companies updated");
						process.exit(0);
					}
				});
			}
		});
	}
});