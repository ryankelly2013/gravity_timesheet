var Models = require("../models");

function handleError(err) {
	console.log(err.stack);
}

Models.Global.findOne({}, function(err, global_current) {
	if(err) return handle(err);
	else {
		var current_month = new Date(global_current.currentMonthEnd);
		var next_month;
		var next_year;
		if(current_month.getMonth() == 11) {
			next_year = current_month.getFullYear() + 1;
			next_month = 0;
		}
		else {
			next_month = current_month.getMonth() + 1;
			next_year = current_month.getFullYear();
		}


		Models.Global.update({}, {$set : {'currentMonthEnd' : new Date(next_year, next_month + 1, 0) }, $push: {'availableMonths': new Date(next_year, next_month + 1, 0)}}, function(err, n) {
			if(err) return handleError(err);
			else {
				process.exit(0);
			}
		});
	}
});