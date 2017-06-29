var mongoose = require('mongoose');
var Models = require("../../models");
var assert = require("assert");

function handleError(err) {
	console.log(err.stack);
}


Models.Company.find({name: { $in : ["Test Company 1", "Test Company 2"]}}, function(err, companies) {
	if(err) return handleError(err);
	else if(companies.length > 2) {
		//Dulicate companies added, remove all and try again
		Models.Company.remove({name: { $in : ["Test Company 1", "Test Company 2"]}}, function(err) {
			console.log("Removed duplicate companies, try again");
			process.exit(1);
		});
	}
	else {
		assert(companies.length == 2, "Didn't get all companies");
		//Update all test users in company 1
		var company1;
		var company2;
		if(companies[0].name === "Test Company 1") {
			company1 = companies[0];
			company2 = companies[1];
		}
		else {
			company1 = companies[1];
			company2 = companies[0];
		}
		Models.User.update({username: {$in : ["test_admin", "test_owner_1", "test_employee_1_1", "test_employee_1_2"]}}, {$set : {"companyId" : company1._id }}, {multi: true}, function(err, n) {
			if(err) return handleError(err);
			else {
				//Do same for company 2
				Models.User.update({username: {$in : ["test_owner_2", "test_employee_2_1"]}}, {$set : {"companyId" : company2._id }}, {multi: true} , function(err, n) {
					if(err) return handleError(err);
					else {
						console.log("Company ids of test users updated");
						process.exit(0);
					}
				});
			}
		});
	}
});