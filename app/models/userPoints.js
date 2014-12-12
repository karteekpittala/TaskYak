var mongoose = require('mongoose');
var start_score = 0;
var ObjectID = require('mongodb').ObjectID;

UserPointsSchema = mongoose.Schema({
	groupName:  String,
	user: String,
	points: Number,
	initialPoints: Number,
	weeklyPoints: Number,
	lastUpdate: Date,
});


UserPointsSchema.statics.createUserPoints = function(groupName, user, done){
	var  UserPoints = this;
	var today = new Date();
	UserPoints.create({
		groupName : groupName,
		user : user,
		points : start_score,
		initialPoints : start_score,
		weeklyPoints : start_score + 25,
		lastUpdate : today,
	}, function(err, user){
		if(err) throw err;
		// if (err) return done(err);
		done(null, user);
	});	
}



UserPointsSchema.statics.resetPoints = function(_id, points){
	var UserPoints = this;
	console.log("Welcome " + _id);
	
	var id = mongoose.Types.ObjectId(_id);
	
	console.log(id);
	
	UserPoints.update(
		{_id : id},
		{
			$set:
			{
				weeklyPoints : points
			}
		
		}, function(err, user){
		if(err) throw err;
		// if (err) return done(err);
		//done(null, user);
	});	
}


var UserPoints = mongoose.model("UserPoints", UserPointsSchema);
module.exports = UserPoints;