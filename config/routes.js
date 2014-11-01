var User = require('../app/models/user');
var Task = require('../app/models/task');
var Group = require('../app/models/group');
var Auth = require('./middlewares/authorization.js');

module.exports = function(app, passport){
	app.get("/", function(req, res){ 
		if(req.isAuthenticated()){
		  res.render("home", { user : req.user}); 
		}else{
			res.render("home", { user : null});
		}
	});

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
		var user = req.user;
		var name = user.firstName+" "+user.lastName;
		var groupOwner = name;
		var groupMembers = req.body.list;
		//groupMembers.push(groupOwner);
		Group.createGroup(req.body.groupName, groupOwner, groupMembers, function(err, user){
			if(err) throw err;
			res.redirect("profile");
		});
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
		var user = req.user
		var name = user.firstName+" "+user.lastName
		Group.find(function (err, docs) {
			res.render('groupdetails',{
				groups:docs
			});
		});
		/*Group.find({groupMembers:{$regex : ".*"+name+".*"}}, function (err, docs) {
			res.render('groupdetails',{
				groups: docs
			});*/

		
	});

	/*Edit members*/
	//app.get('/editMembers', function(req, res){
	//	res.render('editMembers', {});
	//});

	/*Revision changes till here*/



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
		console.log(req.body.list);
		console.log(req.body.taskName);
		console.log(req.body.taskPriority);
		Task.addtask(req.body.taskName, taskCreator, req.body.taskPriority, req.body.dueDate, req.body.list, isComplete, function(err, user){
			if(err) throw err;
			res.redirect("tasklist");					
		});
	});


 /* GET Task list page. */
	app.get('/tasklist', Auth.isAuthenticated, function(req, res) {
		
		var user = req.user
		var name = user.firstName+" "+user.lastName;
		Task.find({$or:[ {'taskDoer': name}, {'taskCreator': name}]} ,function (err, docs) {
			
			res.render('tasklist',{
				tasks: docs
			});
  		// docs is an array
		});
	});

	app.post('/listroommates', Auth.isAuthenticated, function(req, res) {
		var user = req.user;
		var name = user.firstName+" "+user.lastName;
		var groupCreator = name;
		var groupMembers = req.body.list;
		groupMembers.push(groupCreator);
		Group.createGroup(req.body.groupName, groupCreator, req.body.list, function(err, user){
			if(err) throw err;
			res.redirect("testlist");					
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

	/* GET Add Task page. */
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
		res.render("profile",{ user : req.user});
	});

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/login');
	});
}