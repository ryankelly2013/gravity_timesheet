var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var companySchema = new Schema ({
	name: String,
	lead: Schema.Types.ObjectId
});

module.exports.companySchema = companySchema;