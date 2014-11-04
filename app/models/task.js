var mongoose = require('mongoose');

TaskSchema = mongoose.Schema({
	taskName:  String,
	taskCreator: String,
	taskPriority: Number,
	dueDate: Date,
	taskDoer:   Array,
	isComplete: Boolean,
	isRecurring: Boolean,
	
});


TaskSchema.statics.addtask = function(taskName, taskCreator, taskPriority, dueDate, taskDoer, isComplete, done){
	var Task = this;
	Task.create({
		taskName : taskName,
		taskCreator : taskCreator,
		taskPriority: taskPriority, 
		dueDate: dueDate,
		taskDoer : taskDoer,
		isComplete : isComplete
	}, function(err, user){
		if(err) throw err;
		// if (err) return done(err);
		done(null, user);
	});	
}



TaskSchema.statics.saveTask = function(_id, isComplete,  done){
	console.log("Welcome" + _id);
	var Task = this;
	var ObjectID = require('mongodb').ObjectID;
	var mongoose = require('mongoose');
	var id = mongoose.Types.ObjectId(_id);
	
	Task.update(
		{_id : id},
		{
			$set:
			{
				isComplete : isComplete
			}
		
		}, function(err, user){
		if(err) throw err;
		// if (err) return done(err);
		done(null, user);
	});	
}


var Task = mongoose.model("Task", TaskSchema);
module.exports = Task;