var mongoose = require('mongoose');
var hash = require('../util/hash');


TaskSchema = mongoose.Schema({
	taskName:  String,
	taskDoer: String,
	taskOwner:   String
});


TaskSchema.statics.addtask = function(taskName, taskDoer, taskOwner, done){
	var Task = this;
	
	Task.create({
		taskName : taskName,
		taskDoer : taskDoer,
		taskOwner : taskOwner
	}, function(err, user){
		if(err) throw err;
		// if (err) return done(err);
		done(null, user);
	});	
}


var Task = mongoose.model("Task", TaskSchema);
module.exports = Task;