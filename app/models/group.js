var mongoose = require('mongoose');

GroupSchema = mongoose.Schema({
	groupName:  String,
	groupOwner:   String,
	groupMembers: Array
});


GroupSchema.statics.createGroup = function(groupName, groupOwner, groupMembers, done){
	var Group = this;
	Group.create({
		groupName : groupName,
		groupOwner : groupOwner,
		groupMembers : groupMembers
	}, function(err, user){
		if(err) throw err;
		// if (err) return done(err);
		done(null, user);
	});	
}

var Group = mongoose.model("Group", GroupSchema);
module.exports = Group;