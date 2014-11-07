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
		var regex = new RegExp(req.query["term"], 'i');
		var query = User.find({'firstName': regex});
		console.log("in searchFriends");
		// Execute query in a callback and return users list
  		query.exec(function(err, users) {
      		if (!err) {
         		// Method to construct the json result set
         		console.log("Error while performing search for users. Function: /searchFriends");
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

	/*function builds the result sets for all the users that match the requirement for query
	expression
	*/
	function buildResultSet(data){
		var result = [];
		for(var object in data){
			console.log(" get control please");
			result.push(data[object]);
		}
		//console.log("in buildResultSet func", result );
		return result;
	};

	//User login functionality
	app.get('/flash', function(req, res){
		console.log("Inside Flash");
	  // Set a flash message by passing the key, followed by the value, to req.flash().
	  req.flash('info', 'Welcome to TaskYak');
	  req.flash('loginMessage', 'Invalid Credentials')
	  res.redirect('/');
	});

	
	/*Get group details for a user*/
	app.get('/groupDetails', Auth.isAuthenticated, function(req, res){
		var user = req.user;
		var name = user.firstName+" "+user.lastName;
		var GroupsetData = [];
		Group.find({groupMembers: name},function (err, docs) {			
			res.render('groupdetails',{
			groups:docs,
			});
		});
		/*Group.find({groupMembers:{$regex : ".*"+name+".*"}}, function (err, docs) {
			res.render('groupdetails',{
				groups: docs
			});*/	
	});

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

	/*Functionality to post the task added*/
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

	/*Functionality to post the changes to the tasks*/
	app.post('/tasklist', Auth.isAuthenticated, function(req, res) {
    	var tasks = req.tasks;
    	console.log("Welcome");
    	var l = req.body.taskslength;
   		
   		if(l > 0)
   		{
   			for(var i=1;i<=l;i++)
   			{
   				findTaskDetails(req.body['primary_'+i], req.body['isComplete_'+i]);
   				console.log("=====Finding Task"+i); 				

   			}
   			growl('Task Status Saved',{ title: 'Tasks'},{ image: 'png' })
			res.redirect("tasklist");
		}
	}); 

	/*Code will update the userpoints for the tasks done*/
	function findTaskDetails(taskId, status){
		console.log("==========Inside find task========");
		var ObjectID = require('mongodb').ObjectID;
		var mongoose = require('mongoose');
		var id = mongoose.Types.ObjectId(taskId);
		var newStatus = status;
		var karstatus = true;
		console.log("Status type: of my var"+karstatus.type);
		

		Task.find({_id: id}, function(err, docs){
			//var taskId = id;
			var taskName = docs[0].taskName;
			var taskDoer = docs[0].taskDoer;
			var taskPoints = docs[0].taskPriority;
			var prevStatus = docs[0].isComplete;

			console.log("***************In Find Task Details*******************");
			console.log("Task Id: "+id);
			console.log("Task Name: "+taskName);
			console.log("Task Doer: "+taskDoer);
			console.log("Task Points: "+taskPoints);
			console.log("New Status: "+newStatus);

			if((prevStatus == true) && (newStatus == "on")){
				console.log("User points not updated, task complete before only");
			}
			if((prevStatus == true) && (newStatus == undefined)){
				console.log("User points will be reduced"+(taskPoints + (-2)* taskPoints));
				Task.saveTask(taskId, newStatus, function(err, user){
					updateUserPoints(taskDoer, (taskPoints + (-2)* taskPoints));
					if(err) throw err;
				});
			}
			if((prevStatus == false) && (newStatus == "on")){
				console.log("User points will be added"+taskPoints);
				Task.saveTask(taskId, newStatus, function(err, user){
					updateUserPoints(taskDoer, taskPoints);
					if(err) throw err;
				});
			}
			if((prevStatus == false) && (newStatus == undefined)){
				console.log("User points not updated, still incomplete");	
			}
		});
	}	


	/*Code perfomring the update the operation*/
	function updateUserPoints(doer, taskPoints){
		//var Task = this;
		for(var i = 0; i < doer.length; i++){
			// console.log("================"+doer[i]+"================");
			var userPoints;
			UserPoints.find({user: doer[i]}, function(err, docs){
				// console.log("Docs:"+docs);
				var userPoints = taskPoints + docs[0].points;
				console.log("Points in database"+docs[0].points)
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
	
	/*Code to render the page for incomplete tasks*/
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

	/*Code to post the new group*/
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

	/*code renders the page to create a new group page. */
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
		var user = req.user;
		var name = user.firstName+" "+user.lastName;
		Group.findOne({groupMembers: name}, function (err, group) {			
			console.log("GroupName: "+group.groupName);
			UserPoints.find({groupName: group.groupName}, function(err, userpointsDocs){
				console.log("userpoints docs: "+userpointsDocs);
				var totalPoints = 0;
				var avgPoints = 0;
				var userDataSet = [];
				var userData = [];
				//for commuting
				for(var i = 0; i < userpointsDocs.length; i++){
					totalPoints = totalPoints + userpointsDocs[i].points;
				}
				avgPoints = totalPoints/userpointsDocs.length;
				for(var j=0; j< userpointsDocs.length; j++)
				{
					var percentScore = ((userpointsDocs[j].points/totalPoints)*100);
					console.log("percentScore: "+percentScore);
					percentScore = parseInt(percentScore, 10);
					console.log("percentScore: "+percentScore);
					userData = [userpointsDocs[j].user, userpointsDocs[j].points, percentScore];
					userDataSet.push(userData);
				}
				console.log(userDataSet);
				res.render("profile",{ user : req.user, userDataSet: userDataSet, groupName: group.groupName, avgPoints: avgPoints});
			});
		});
	});

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/login');
	});
}









