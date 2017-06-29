var mongoose = require('mongoose');
var Models = require("../../models");
var assert = require("assert");

function handleError(err) {
	console.log(err.stack);
}

var gravity_id;
var optimus_id;
var meraki_id;
var traverse_id;
var defy_id;
var rfc_id;
var wkragh_id;
var ckragh_id;

function update_lead_id(user_id, company_name, callback) {
	Models.Company.update({name: company_name}, {$set : {lead : user_id}}, function(err, n) {
		if(err) return handleError(err);
		else {
			callback();
		}
	});
}

Models.User.find({}, function(err, users) {
	if(err) return handleError(err);
	else {
		for(var i = 0; i < users.length; ++i) {
			switch(users[i].username) {
				case "kellyj":
					gravity_id = users[i]._id;
					break;
				case "singha":
					optimus_id = users[i]._id;
					break;
				case "bhavev":
					meraki_id = users[i]._id;
					break;
				case "luzadders":
					traverse_id = users[i]._id;
					break;
				case "natywad":
					defy_id = users[i]._id;
					break;
				case "cunninghamr":
					rfc_id = users[i]._id;
					break;
				case "kraghw":
					wkragh_id = users[i]._id;
					break;
				case "kraghc":
					ckragh_id = users[i]._id;
					break;
				default:
					break;
			}
		}

		//Got all the ids, now update the company lead ids
		update_lead_id(gravity_id, "Gravity Associates Inc", function() {
			update_lead_id(optimus_id, "Optimus Consulting Inc", function() {
				update_lead_id(meraki_id, "Meraki Inc", function() {
					update_lead_id(traverse_id, "Traverse Consulting Inc", function() {
						update_lead_id(defy_id, "Defy Advanced Corp", function() {
							update_lead_id(rfc_id, "RFC Consulting Inc", function() {
								update_lead_id(wkragh_id, "William Kragh", function() {
									update_lead_id(ckragh_id, "Carolyn Kragh", function() {
										process.exit(0);
									});
								});
							});
						});
					});
				});
			});
		});
	}
});