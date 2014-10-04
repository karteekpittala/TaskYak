var mongoose = require('mongoose');

TaskSchema = mongoose.Schema({
	taskName:  String,
	taskCreator: String,
	taskPriority: Number,
	taskDoer:   String
});


TaskSchema.statics.addtask = function(taskName, taskCreator, taskPriority, taskDoer, done){
	var Task = this;
	
	Task.create({
		taskName : taskName,
		taskCreator : taskCreator,
		taskPriority: taskPriority,
		taskDoer : taskDoer
	}, function(err, user){
		if(err) throw err;
		// if (err) return done(err);
		done(null, user);
	});	
}


var Task = mongoose.model("Task", TaskSchema);
module.exports = Task;