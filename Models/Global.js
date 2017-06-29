var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var globalSchema = new Schema ({
	currentMonthEnd: Date
});

module.exports.globalSchema = globalSchema;