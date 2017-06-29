var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var timesheetSchema = new Schema ({
	userId: Schema.Types.ObjectId,
	projectId: Schema.Types.ObjectId,
	monthEnd: Date,
	data: [{
		day: Date,
		time: Number,
		description: String
	}]
});

module.exports.timesheetSchema = timesheetSchema;