var mongoose = require('mongoose');

TaskSchema = mongoose.Schema({
	taskName:  String,
	groupName: String,
	taskCreator: String,
	taskPriority: Number,
	dueDate: Date,
	taskDoer:   Array,
	isComplete: Boolean,
	recurScore: Number,
	frequency: Number,
	
});


TaskSchema.statics.addtask = function(taskName, groupName, taskCreator, taskPriority, dueDate, isComplete, recurScore, frequency, done){
	var Task = this;
	Task.create({
		taskName : taskName,
		groupName: groupName,
		taskCreator : taskCreator,
		taskPriority: taskPriority, 
		dueDate: dueDate,
		taskDoer : null,
		isComplete : isComplete,
		recurScore: recurScore,
		frequency: frequency
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
	var status=false;
	
	if(isComplete == "on"){
		status = true;
	}
	Task.update(
		{_id : id},
		{
			$set:
			{
				isComplete : status
			}
		
		}, function(err, user){
		if(err) throw err;
		// if (err) return done(err);
		done(null, user);
	});	
}

var Task = mongoose.model("Task", TaskSchema);
module.exports = Task;