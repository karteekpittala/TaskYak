var User = require('../app/models/user');
var Task = require('../app/models/task');
var Group = require('../app/models/group');
var UserPoints = require('../app/models/userPoints');
var Auth = require('./middlewares/authorization.js');
var growl = require('growl');

module.exports = function(app, passport){
	app.get("/", function(req, res){ 
		if(req.isAuthenticated()){
		  res.render("home", { user : req.user}); 
		}else{
			res.render("home", { user : null});
		}
	});


	//functinality to implement for load list of all users
	app.get('/searchFriends', function(req, res){
		//console.log("in search friends");
		//Group.find({groupMembers:{$regex : ".*"+name+".*"}}, function (err, docs) 
		//User.find({firstName: regex});
		var regex = new RegExp(req.query["term"], 'i');
		var query = User.find({'firstName': regex});
		console.log("in searchFriends");
		//.sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
		
		// Execute query in a callback and return users list
  		query.exec(function(err, users) {
      		if (!err) {
         // Method to construct the json result set
         		var result = buildResultSet(users);
         		res.send(result, {
            	'Content-Type': 'application/json'
         		}, 200);
      		} else {
         		res.send(JSON.stringify(err), {
            	'Content-Type': 'application/json'
        		}, 404);
      		}
   		});
	});

	function buildResultSet(data){
		//console.log("in build Result set: Printing the data ", data);
		var result = [];
		for(var object in data){
			console.log(" get control please");
			result.push(data[object]);
		}
		//console.log("in buildResultSet func", result );
		return result;
	};

	/*Need to make changes and convert all the functionlity in one page-karteek*/
	/* Get Groups Page*/
	app.get('/groups', Auth.isAuthenticated, function(req, res){
		res.render('groups', { messages: 'Hello' });
	});


	app.get('/flash', function(req, res){
		console.log("Inside Flash");
	  // Set a flash message by passing the key, followed by the value, to req.flash().
	  req.flash('info', 'Welcome to TaskYak');
	  req.flash('loginMessage', 'Invalid Credentials')
	  res.redirect('/');
	});


	/*Creates New group*/
	app.post('/creategroup', Auth.isAuthenticated, function(req, res){


		//please do not delete this code
		/*var user = req.user;
		var name = user.firstName+" "+user.lastName;
		var groupOwner = name;
		var groupMembers = req.body.list;
		var start_score = 0;
		var userSet = [];
		var groupset = [];
		console.log(groupMember.length);
		for(var i = 0; i < groupMembers.length; i++){
			userSet = [groupMembers[i], start_score];
			groupset.push(userSet);
		}
		console.log(groupset);
		//groupMembers.push(groupOwner);
		Group.createGroup(req.body.groupName, groupOwner, groupMembers, function(err, user){
			if(err) throw err;
			res.redirect("profile");
		});*/
	});


	/*Get Create Group Page*/
	app.get('/creategroup', Auth.isAuthenticated, function(req, res){
	
		var user = req.user;
		var name = user.firstName+" "+user.lastName;
		var taskCreator = name;
		User.find({}, function (err, docs) {
			res.render('creategroup',{
				users: docs
			});
		});
	});

	/*Get group details for a user*/
	app.get('/groupDetails', Auth.isAuthenticated, function(req, res){
		var user = req.user;
		var name = user.firstName+" "+user.lastName;
		var GroupsetData = [];
		Group.find({groupMembers: name},function (err, docs) {			
			console.log(docs.length);
			console.log(docs[0].groupMembers);
			//updateUserScore(docs[0], name, 10);
			/*GroupSetData = buildGroupSet(docs);
			
			console.log(GroupSetData);
			*/
			res.render('groupdetails',{
			groups:docs,
			//GroupsetData: GroupsetData
			});
		});
		/*Group.find({groupMembers:{$regex : ".*"+name+".*"}}, function (err, docs) {
			res.render('groupdetails',{
				groups: docs
			});*/	
	});

	function updateUserScore(group, name, taskpoints){
		console.log("Group details"+group);
		console.log("Name to update"+name);
		console.log("taskpoints: "+taskpoints);
		console.log("Intial user points Set"+group.userpoints);
		userSet = [];
		var insertSet = [];
		var points = taskpoints;
		for(var i = 0; i < group.groupMembers.length; i++){
			if(group.groupMembers[i] == name){
				insertSet.push(group.groupMembers[i]);
				insertSet.push(group.userpoints[i][1] + points);
				userSet.push(insertSet);
				console.log("Name found"+insertSet);
			}
			else{
				console.log("Pushing set"+group.userpoints[i] );
				userSet.push(group.userpoints[i]);
				
			}
		}
		console.log(userSet);
		Group.update({groupName: group.groupName}, {$set: {userpoints: userSet}}, function(err, updated) {
  			if( err || !updated ) console.log("User not updated");
  			else console.log("User updated");
		});
	};

	function buildGroupSet(docs){
		//console.log("in build Result set: Printing the data ", data);
		var result = [];
		for(i = 0; i< docs.length; i++)
		{
			//console.log(docs[i].groupName);
			//console.log(docs[i].groupMembers);
			UserPoints.find({groupName: docs[i].groupName}, function(err, data){
				for(var object in data){
				userpointsData.push(data[object].points);
				console.log(userpointsData);
				return userpointsData;
				}
			});
		}
		//console.log("in buildResultSet func", result );
		return result;
	};
	/*Edit members*/
	//app.get('/editMembers', function(req, res){
	//	res.render('editMembers', {});
	//});



	/* GET Add Task page. */
	app.get('/addtask', Auth.isAuthenticated, function(req, res){
		var user = req.user
		var name = user.firstName+" "+user.lastName
		Group.find({groupMembers: name}, function (err, docs) {
			res.render('addtask',{
				groups: docs
			});

			});		
	  });


	app.post('/addtask', Auth.isAuthenticated, function(req, res) {
		var user = req.user;
		var name = user.firstName+" "+user.lastName;
		var taskCreator = name;
		var isComplete = 0;
		var dueDate = new Date(req.body.dueDate);
		var recurScore = req.body.recurScore;
		var frequency = req.body.frequency;
		var numMonth = 1;
		var numDate = 7;
		var dateList = []
		dateList.push(new Date(req.body.dueDate));

		for (var i=0;i<recurScore-1;i++){

			if (frequency==0) break;
			
			var nextDate = new Date();
	
			if(frequency==2)
				{
					nextDate.setMonth(dueDate.getMonth()+numMonth);
					dateList.push(nextDate);
					numMonth +=numMonth
				}

			else if(frequency==1)
			{
				nextDate.setDate(dueDate.getDate()+numDate);
				dateList.push(nextDate);
				numDate+=numDate
			}
		
		}

		for (var j in dateList){
			console.log(new Date(dateList[j]));
			Task.addtask(req.body.taskName, taskCreator, req.body.taskPriority, dateList[j], req.body.list, isComplete, function(err, user){
					if(err) throw err;				
				});
		}

		res.redirect("tasklist");	
		
	});


	app.post('/tasklist', Auth.isAuthenticated, function(req, res) {
    	var tasks = req.tasks;
    	console.log("Welcome");
    	var l = req.body.taskslength;
    	console.log("Length"+l);
   		
   		if(l > 0)
   		{
   			for(var i=1;i<=l;i++)
   			{
   				console.log("i"+i);
   				// console.log("Primary " + i + " is " + req.body['primary_' + i]);
   				// console.log("Complete " + i + " is " + req.body['isComplete_' + i]);

   				findTaskDetails(req.body['primary_'+i], req.body['isComplete_'+i]);
   			}
   			for(var i=1;i<=l;i++)
   			{
   				Task.saveTask(req.body['primary_' + i], req.body['isComplete_' + i], function(err, user){
					if(err) throw err;
					
				});
   			}
   			growl('Task Status Saved',{ title: 'Tasks'},{ image: 'png' })
		res.redirect("tasklist");	

		}
	}); 

	function findTaskDetails(taskId, status){
		console.log("==========Inside find task========");
		var ObjectID = require('mongodb').ObjectID;
		var mongoose = require('mongoose');
		var id = mongoose.Types.ObjectId(taskId);
		var newStatus = status;
		

		Task.find({_id: id}, function(err, docs){
			var taskName = docs[0].taskName;
			var taskDoer = docs[0].taskDoer;
			var taskPoints = docs[0].taskPriority;
			// var prevStatus = docs[0].isComplete;


			// console.log("***************");
			// console.log("Task Name: "+taskName);
			// console.log("Task Doer: "+taskDoer);
			// console.log("Task Points: "+taskPoints);
			  // console.log("New Status: "+newStatus);

			if((newStatus == "on")){
				console.log("User points will be added"+taskPoints);
				updateUserPoints(taskDoer, taskPoints);
			}
		
		});
	}	



	function updateUserPoints(doer, taskPoints){
		//var Task = this;
		for(var i = 0; i < doer.length; i++){
			// console.log("================"+doer[i]+"================");
			UserPoints.find({user: doer[i]}, function(err, docs){
				// console.log("Docs:"+docs);
				var userPoints = taskPoints + docs[0].points;
				console.log("New updated user points"+userPoints);
				UserPoints.update({user: docs[0].user}, {$set: {points: userPoints}}, function(err, updated) {
  					if( err || !updated ) console.log("User not updated");
  					else console.log("User updated");
				});
			});
		}

	}



 /* GET Task list page. */
	app.get('/tasklist', Auth.isAuthenticated, function(req, res) {
		var user = req.user;
		var name = user.firstName+" "+user.lastName;
		var start = new Date();
		var end = new Date();
		numMonths = 1;
		end.setMonth(start.getMonth() + numMonths);
		start.setMonth(start.getMonth() - numMonths);  

		Task.find({$or:[ {'taskDoer': name}, {'taskCreator': name}],"dueDate": {"$gte": start, "$lt": end}} ,function (err, docs) {
			
			res.render('tasklist',{
				tasks: docs
			});
  		// docs is an array
		});
	});
	
	app.get('/incomplete', Auth.isAuthenticated, function(req, res) {
		
		var user = req.user
		var name = user.firstName+" "+user.lastName;
		Task.find({$or:[ {'taskDoer': name}, {'taskCreator': name}]} ,function (err, docs) {
			
			res.render('incomplete',{
				tasks: docs
			});
  		// docs is an array
		});
	});

	app.post('/listroommates', Auth.isAuthenticated, function(req, res) {
		var user = req.user;
		var name = user.firstName+" "+user.lastName
		var groupCreator = name;
		var groupMembers = req.body.list;
		groupMembers.push(groupCreator);


		for(var i = 0; i < groupMembers.length; i++){
				UserPoints.createUserPoints(req.body.groupName, groupMembers[i], function(err, user){
					if(err) throw err;
				});
				console.log("GroupMember"+i+groupMembers[i]);
		}

		Group.createGroup(req.body.groupName, groupCreator, groupMembers, function(err, user){
			if(err) throw err;
			console.log("group Length: "+groupMembers.length);
			res.redirect("profile");
		});
	});


 /* GET Task list page. */
	app.get('/testlist', Auth.isAuthenticated, function(req, res) {
		
		var user = req.user
		var name = user.firstName+" "+user.lastName
		Group.find({groupMembers: name},function (err, docs) {			
			res.render('testlist',{
				groups: docs
			});
  		// docs is an array
		});
	});

	/*new group page. */
	app.get('/listroommates', function(req, res){
		User.find({}, function (err, docs) {
			res.render('listroommates',{
				users: docs
			});

		});	
	});
	  
	app.get("/login", function(req, res){ 
		res.render("login",{ message: req.flash('error') });
	});

	app.post("/login" 
		,passport.authenticate('local',{
			successRedirect : "/profile", 
			failureRedirect : "/login",
			failureFlash: true,
			successFlash: "Welcome"
		})
	);

	app.get("/signup", function (req, res) {
		res.render("signup");
	});

	app.post("/signup", Auth.userExist, function (req, res, next) {
		User.signup(req.body.firstName, req.body.lastName,req.body.email, req.body.password, function(err, user){
			if(err) throw err;
			req.login(user, function(err){
				if(err) return next(err);
				return res.redirect("profile");
			});
		});
	});

	app.get("/auth/facebook", passport.authenticate("facebook",{ scope : "email"}));
	app.get('/auth/facebook/callback',
			passport.authenticate('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	app.get('/auth/google',
	  passport.authenticate(
	  	'google',
		  {
		  	scope: [
		  	'https://www.googleapis.com/auth/userinfo.profile',
		  	'https://www.googleapis.com/auth/userinfo.email'
		  	]
		  })
	  );

	app.get('/auth/google/callback', 
	  passport.authenticate('google', { failureRedirect: '/login' }),
	  function(req, res) {
	    // Successful authentication, redirect home.
	    res.redirect('/');
	  });

	app.get("/profile", Auth.isAuthenticated , function(req, res){ 
		/*Group.find()*/
		res.render("profile",{ user : req.user});
	});

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/login');
	});
}









