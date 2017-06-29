var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Models = require("../models");

function handleError(err) {
	console.log(err.stack);
}

//Returns list of all companies as {companies: [{company}]}
router.get('/', function(req, res) {
	var companies = {companies: []}

	Models.Company.find({}, function(err, company_results) {
		if(err) return handleError(err);
		else {
			companies.companies = company_results;

			res.json(companies);
		}
	});
});


router.post('/', function(req, res) {
	//Test that the given lead_id is valid
	var lead_id = req.body.lead;
	var name_in = req.body.name;
	Models.User.findOne({_id: lead_id}, function(err, user) {
		if(err) return handleError(err);
		else if(user == null && lead_id != null) {
			res.json({ success : false, message: "User not found"});
		}
		else {
			//User valid, create company
			var company = new Models.Company({
				name: name_in,
				lead: lead_id
			});

			company.save(function(err) {
				if(err) return handleError(err);
				else {
					res.json({ success: true, message: "Company creation successful"});
				}
			});
		}
	})
});

router.put('/lead', function(req, res) {
	var company_id_in = req.body.company_id;
	var lead_id_in = req.body.lead_id;

	Models.Company.update({ _id: company_id_in}, {$set : {lead: lead_id_in}}, function(err, n) {
		if(err) return handleError(err);
		else {
			res.json({success: true, message: "Company update successful"});
		}
	});
});

module.exports = router;












