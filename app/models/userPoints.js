var mongoose = require('mongoose');
var start_score = 0;

UserPointsSchema = mongoose.Schema({
	groupName:  String,
	user: String,
	points: Number,
	initialPoints: Number,
	weeklyPoints: Number,
});


UserPointsSchema.statics.createUserPoints = function(groupName, user, done){
	var  UserPoints = this;
	UserPoints.create({
		groupName : groupName,
		user : user,
		points : start_score,
		initialPoints : start_score,
		weeklyPoints : start_score + 25,
	}, function(err, user){
		if(err) throw err;
		// if (err) return done(err);
		done(null, user);
	});	
}

var UserPoints = mongoose.model("UserPoints", UserPointsSchema);
module.exports = UserPoints;