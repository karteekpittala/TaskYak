var User = require('../app/models/user');
var Task = require('../app/models/task');
var Auth = require('./middlewares/authorization.js');

module.exports = function(app, passport){
	app.get("/", function(req, res){ 
		if(req.isAuthenticated()){
		  res.render("home", { user : req.user}); 
		}else{
			res.render("home", { user : null});
		}
	});

	app.post('/addtask', Auth.isAuthenticated, function(req, res) {
		var user = req.user;
		var name = user.firstName+" "+user.lastName;
		var taskCreator = name;
		Task.addtask(req.body.taskName, taskCreator, req.body.taskPriority, req.body.dueDate, req.body.taskDoer, function(err, user){
			if(err) throw err;
			res.redirect("profile");					
		});
	});


 /* GET Task list page. */
	app.get('/tasklist', Auth.isAuthenticated, function(req, res) {
		//console.log(req.user);
		var user = req.user
		var name = user.firstName+" "+user.lastName
		Task.find({taskDoer:{$regex : ".*"+name+".*"}}, function (err, docs) {
			console.log(docs);
			res.render('tasklist',{
				tasks: docs
			});
  		// docs is an array
		});
	});

	/* GET Add Task page. */
	app.get('/addtask', function(req, res){
		User.find({}, function (err, docs) {
			res.render('addtask',{
				users: docs
			});

			});		
	  });


	app.get("/login", function(req, res){ 
		res.render("login");
	});

	app.post("/login" 
		,passport.authenticate('local',{
			successRedirect : "/profile",
			failureRedirect : "/login",
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
		res.render("profile", { user : req.user});
	});

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/login');
	});
}