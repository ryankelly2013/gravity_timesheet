var mongoose = require("mongoose");
var fs = require("fs");

var User = require("./Models/User");
var Company = require("./Models/Company");
var Global = require("./Models/Global");
var Project = require("./Models/Project");
var Timesheet = require("./Models/Timesheet");

var dbPath = ""

if(process.env.NODE_ENV === 'development') {
  var text = fs.readFileSync("config/dbconnection_dev.json");
  var config = JSON.parse(text);
  dbPath  = "mongodb://" +
    config.HOST + ":"+
    config.PORT + "/"+
    config.DATABASE;
}
else {
  var text = fs.readFileSync("config/dbconnection_prod.json");
  var config = JSON.parse(text);
  dbPath  = "mongodb://" +
    config.USER + ":" +
    config.PASS + "@" +
    config.HOST + ":"+
    config.PORT + "/"+
    config.DATABASE;
}

mongoose.connect(dbPath);

var db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", function(callback){
 console.log("Connection Succeeded."); /* Once the database connection has succeeded, the code in db.once is executed. */
});

var User = mongoose.model("User", User.userSchema);
var Company = mongoose.model("Company", Company.companySchema);
var Global = mongoose.model("Global", Global.globalSchema);
var Project = mongoose.model("Project", Project.projectSchema);
var Timesheet = mongoose.model("Timesheet", Timesheet.timesheetSchema);

module.exports.User = User;
module.exports.Company = Company;
module.exports.Global = Global;
module.exports.Project = Project;
module.exports.Timesheet = Timesheet;








