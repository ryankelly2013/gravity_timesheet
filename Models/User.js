var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema ({
	username: String,
	name: String,
	password: String,
	projectIds: [Schema.Types.ObjectId],
	companyId: Schema.Types.ObjectId,
	accessType: Number //0 = default, 1 = company owner, 2 = admin
});

module.exports.userSchema = userSchema;