var request = require('supertest');
var should = require('should'); 
var assert = require('assert'); 
var Models = require("../../models");
var mongoose = require("mongoose");
function handleError(err) {
  should.equal(1, 0, err.stack);
}

const url = 'http://gravitytimesheet.herokuapp.com';

//Projects Ids
var ifr_id;
var ccarDataRiskFin_id;
var ccarDataRiskRisk_id;
var y14_id;
var fr2_id;
var transFin_id;
var transRisk_id;


//Company ids
var gravity_id;
var optimus_id;
var meraki_id;
var traverse_id;
var defy_id;
var rfc_id;
var wkragh_id;
var ckragh_id;

function post_user(username, name, password, company_id, accessType, project_ids, callback) {
  var payload = {
    username: username,
    name: name,
    password: password,
    company_id: company_id,
    accessType: accessType,
    project_ids: project_ids
  }
  request(url)
  .post('/user')
  .send(payload)
  .set({'Content-Type': 'application/json'})
  .end(function(err, res) {
    if(err) return handleError(err);
    else { 
      res.body.should.have.property("success");
      res.body.success.should.equal(true);

      callback()
    }
  });

}


//Need to get list of all projects and all companies

Models.Project.find({}, function(err, projects) {
	if(err) return handleError(err);
	else {
		projects.length.should.equal(7, "Incorrect number of projects");
		for(var i = 0; i < projects.length; ++i) {
			switch(projects[i].name) {
				case "IFRS9":
					ifr_id = projects[i]._id;
					break;
				case "CCAR Data Risk - Finance":
					ccarDataRiskFin_id = projects[i]._id;
					break;
				case "CCAR Data Risk - Risk":
					ccarDataRiskRisk_id = projects[i]._id;
					break;
				case "Y14M&Q Efficiencies":
					y14_id = projects[i]._id;
					break;
				case "FR 2052a":
					fr2_id = projects[i]._id;
					break;
				case "Transportation Finance Data - Finance":
					transFin_id = projects[i]._id;
					break;
				case "Transportation Finance Data - Risk":
					transRisk_id = projects[i]._id;
					break;
				default:
					break;
			}
		}

		//Get company Ids
		Models.Company.find({}, function(err, companies) {
			if(err) return handleError(err);
			else {
				companies.length.should.equal(8, "Incorrect number of companies");
				for(var i = 0; i < companies.length; ++i) {
					switch(companies[i].name) {
						case "Gravity Associates Inc":
							gravity_id = companies[i]._id;
							break;
						case "Optimus Consulting Inc":
							optimus_id = companies[i]._id;
							break;
						case "Meraki Inc":
							meraki_id = companies[i]._id;
							break;
						case "Traverse Consulting Inc":
							traverse_id = companies[i]._id;
							break;
						case "Defy Advanced Corp":
							defy_id = companies[i]._id;
							break;
						case "RFC Consulting Inc":
							rfc_id = companies[i]._id;
							break;
						case "William Kragh":
							wkragh_id = companies[i]._id;
							break;
						case "Carolyn Kragh":
							ckragh_id = companies[i]._id;
							break;
						default:
							break;
					}
				}

				//Got all necessary data, start creating users
				post_user("kellyj", "John Kelly", "kellyj25", gravity_id, 2, [ifr_id, ccarDataRiskFin_id, ccarDataRiskRisk_id, transFin_id, transRisk_id], function() {
					post_user("kellyi", "Isabel Kelly", "kellyi12", gravity_id, 2, [], function() {
						post_user("singha", "Anjala Singh", "singha97", optimus_id, 1, [ifr_id, ccarDataRiskFin_id, ccarDataRiskRisk_id, transFin_id, transRisk_id], function() {
							post_user("roya", "Avishek Roy", "roya40", optimus_id, 0, [ifr_id, ccarDataRiskFin_id, ccarDataRiskRisk_id], function() {
								post_user("shankars", "Satyendra Shankar", "shankars19", optimus_id, 0, [ifr_id, ccarDataRiskFin_id, ccarDataRiskRisk_id, transFin_id, transRisk_id], function() {
									post_user("davisb", "Barbara Davis", "davisb76", optimus_id, 0, [], function() {
										post_user("bhavev", "Vikram	Bhave", "bhavev70", meraki_id, 1, [ifr_id, ccarDataRiskFin_id, ccarDataRiskRisk_id], function() {
											post_user("elangovank", "Keerthana Elangovan", "elangovank87", meraki_id, 0, [ifr_id], function() {
												post_user("gopalakrishnans", "Sangeetha Gopalakrishnan", "gopalakrishnans61", meraki_id, 0, [ifr_id], function() {
													post_user("radhakrishnanv", "Vivek Radhakrishnan", "radhakrishnanv81", meraki_id, 0, [ccarDataRiskFin_id, ccarDataRiskRisk_id], function() {
														post_user("luzadders", "Shane Luzadder", "luzadders75", traverse_id, 1, [y14_id, fr2_id], function() {
															post_user("natywad", "Dave Natywa", "natywad81", defy_id, 1, [ccarDataRiskFin_id, ccarDataRiskRisk_id], function() {
																post_user("cunninghamr", "Robert Cunningham", "cunninghamr63", rfc_id, 1, [ifr_id, ccarDataRiskFin_id, ccarDataRiskRisk_id, transFin_id, transRisk_id], function() {
																	post_user("kraghw", "William	Kragh", "kraghw56", wkragh_id, 1, [ccarDataRiskFin_id, ccarDataRiskRisk_id], function() {
																		post_user("kraghc", "Carolyn	Kragh", "kraghc94", ckragh_id, 1, [ccarDataRiskFin_id, ccarDataRiskRisk_id], function() {
																			process.exit(0);
																		});
																	});
																});
															});
														});
													});
												});
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
	}
});













