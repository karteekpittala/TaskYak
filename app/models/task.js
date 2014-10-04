var mongoose = require('mongoose');
var hash = require('../util/hash');


TaskSchema = mongoose.Schema({
	taskName:  String,
	taskOwner:   String
});


TaskSchema.statics.addtask = function(taskName, taskOwner, done){
	var Task = this;
	//var taskDoer = JSON.stringify(taskOwner)
	Task.create({
		taskName : taskName,
		taskOwner : taskOwner
	}, function(err, user){
		if(err) throw err;
		// if (err) return done(err);
		done(null, user);
	});	
}






var Task = mongoose.model("Task", TaskSchema);
module.exports = Task;