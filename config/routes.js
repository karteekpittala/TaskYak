var User = require('../app/models/user');
var Task = require('../app/models/task');
var Group = require('../app/models/group');
var UserPoints = require('../app/models/userPoints');
var Auth = require('./middlewares/authorization.js');
var growl = require('growl');

module.exports = function(app, passport){
	app.get("/", function(req, res){ 
		if(req.isAuthenticated()){
		  res.render("login", { user : req.user, message: req.flash('error') }); 
		}else{
			res.render("login", { user : null, message: req.flash('error') });
		}
	});


	//functionality to implement for load list of all users
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
	});

	/* GET Add Task page. */
	app.get('/addtask', Auth.isAuthenticated, function(req, res){
		var user = req.user
		var name = user.firstName+" "+user.lastName
		Group.find({groupMembers: name}, function (err, docs) {
			console.log(docs);
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
		var recurScore = Number(req.body.recurScore);
		var frequency = Number(req.body.frequency);
		var numMonth = 1;
		var numDate = 7;

		Task.addtask(req.body.taskName, taskCreator, req.body.taskPriority, dueDate, isComplete, recurScore, frequency, function(err, user){
					if(err) throw err;				
				});


		// var dateList = []
		// dateList.push(new Date(req.body.dueDate));

		// for (var i=0;i<recurScore-1;i++){

		// 	if (frequency==0) break;
			
		// 	var nextDate = new Date();
	
			// if(frequency==2)
			// 	{
			// 		nextDate.setMonth(dueDate.getMonth()+numMonth);
			// 		dateList.push(nextDate);
			// 		numMonth +=numMonth
			// 	}

			// else if(frequency==1)
			// {
			// 	nextDate.setDate(dueDate.getDate()+numDate);
			// 	dateList.push(nextDate);
			// 	numDate+=numDate
			// }
		
		// }

		// for (var j in dateList){
		// 	console.log(new Date(dateList[j]));
			// Task.addtask(req.body.taskName, taskCreator, req.body.taskPriority, dateList[j], req.body.list, isComplete, function(err, user){
			// 		if(err) throw err;				
			// 	});
		// }

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
   				recurTask(req.body['primary_'+i]);

   			}
   			growl('Task Status Saved',{ title: 'Tasks'},{ image: 'png' });
   			
			res.redirect("tasklist");
		}
	});

	function recurTask(taskId){
		console.log("Inside recurTask")
		var ObjectID = require('mongodb').ObjectID;
		var mongoose = require('mongoose');
		var id = mongoose.Types.ObjectId(taskId);
		var frequency;
		var recurScore;
		var dueDate;
		var nextDate = new Date();
		var numMonth = 1;
		var numDate = 7;
		Task.find({_id: id}, function(err, docs){

			recurScore = docs[0].recurScore;
			frequency = docs[0].frequency;
			dueDate= docs[0].dueDate;

			if(frequency==2)
				{
					if (recurScore>1)
					{
						nextDate.setMonth(dueDate.getMonth()+numMonth);
						recurScore -= 1;
						update();
					}
				}

			else if(frequency==1)
			{
				if (recurScore>1)
				{
					nextDate.setDate(dueDate.getDate()+numDate);
					recurScore -= 1;
					update();
				}
			}

			});
		
		function update()
		{

		Task.update({_id: id},{$set:{recurScore: recurScore, dueDate: nextDate}, isComplete: false}, function(err, updated) {
					if( err || !updated ) console.log("Task updated");
					else console.log("Task updated");
			});
		}
	} 

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

		for(var i = 0; i < doer.length; i++){	
			UserPoints.update({user: doer[i]}, {$inc: {points: taskPoints}}, function(err, updated) {
					if( err || !updated ) console.log("User not updated");
					else console.log("User updated");
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


	/*Code to render the page for incomplete tasks*/
	app.get('/choosetask', Auth.isAuthenticated, function(req, res) {
		
		var user = req.user
		var name = user.firstName+" "+user.lastName;
		Task.find({$or:[ {'taskDoer': name}, {'taskCreator': name}]} ,function (err, docs) {
			
			res.render('choosetask',{
				tasks: docs
			});
  		// docs is an array
		});
	});


	app.post('/choosetask', Auth.isAuthenticated, function(req, res) {
		var user = req.user
		var name = user.firstName+" "+user.lastName;

    	var tasks = req.tasks;
    	console.log("Welcome");
    	var taskId = req.body.taskid;
		growl('Task Assigned',{ title: 'Tasks'},{ image: 'png' });

		Task.pickTask(taskId, name, function(err, user){
					if(err) throw err;
				});
   	
   		//todo: Use this id to update the task information
   			res.redirect("/tasklist");
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
	
		
			if(group!=null){
			console.log("GroupName: "+group.groupName);
			UserPoints.find({groupName: group.groupName}, function(err, userpointsDocs){
				console.log("userpoints docs: "+userpointsDocs);
				var totalPoints = 0;
				var avgPoints = 0;
				var userDataSet = [];
				var userData = [];
				var myPoints = 0;
				//for computing scores
				for(var i = 0; i < userpointsDocs.length; i++){
					totalPoints = totalPoints + userpointsDocs[i].points;
				}
				avgPoints = totalPoints/userpointsDocs.length;
				for(var j=0; j< userpointsDocs.length; j++)
				{
					var percentScore = ((userpointsDocs[j].points/totalPoints)*100);
					percentScore = parseInt(percentScore, 10);
					if(name == userpointsDocs[j].user)
						myPoints = userpointsDocs[j].points;
					userData = [userpointsDocs[j].user, userpointsDocs[j].points, percentScore];
					userDataSet.push(userData);
				}
				console.log(myPoints);
			
				res.render("profile",{ user : req.user, userDataSet: userDataSet, groupName: group.groupName, avgPoints: avgPoints, myPoints: myPoints});
			
			});
		}
		else{
			res.render("profile",{ user : req.user, userDataSet: null, groupName: null});	
		}
		
		});
	});

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/login');
	});
}









