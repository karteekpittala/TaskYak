var mongoose = require('mongoose');

TaskSchema = mongoose.Schema({
	taskName:  String,
	taskCreator: String,
	taskPriority: Number,
	dueDate: Date,
	taskDoer:   Array
});


TaskSchema.statics.addtask = function(taskName, taskCreator, taskPriority, dueDate, taskDoer, done){
	var Task = this;
	Task.create({
		taskName : taskName,
		taskCreator : taskCreator,
		taskPriority: taskPriority, 
		dueDate: dueDate,
		taskDoer : taskDoer
	}, function(err, user){
		if(err) throw err;
		// if (err) return done(err);
		done(null, user);
	});	
}


var Task = mongoose.model("Task", TaskSchema);
module.exports = Task;