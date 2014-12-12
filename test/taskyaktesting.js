// googletesting.js

var mouse = require("mouse").create(casper);

//Testcase for user story "Login"
casper.test.begin('TaskYak Login', 1, function suite(test) {
    casper.start("http://localhost:3000", function() {
        
        test.assertExists('form[action="/login"]', "Login form is found");
		
		casper.waitForSelector("form[action='/login']", function() {
		this.fillSelectors('form#login-form', {
        'input[name = email ]' : 'sudhakar553@gmail.com',
        'input[name = password ]' : 'sudhakar',
    });
}, true);
		
 
    });
	
	casper.then(function(){
        this.evaluate(function() {
			document.getElementById("login").click();
		});
    });
	
	casper.then(function(){
		
		test.assertTitle("TaskYak", "Profile page found");    
	});
	
	casper.then(function(){
		console.log(this.getCurrentUrl());
	});
	
	casper.thenOpen('http://localhost:3000/addtask');
	
	
	/*casper.waitForSelector('nav li#newTask', function() {
		
        this.click('#new-Task');
    });*/
	
	casper.then(function(){
		console.log(this.getCurrentUrl());
	});
	
	casper.then(function(){
		test.assertExists('#subtitle','Addtask page loaded properly');
	});
	
	casper.waitForSelector("form[action='/addtask']", function() {
		this.fillSelectors('form#addtask', {
        'input[name = taskName ]' : 'fill addtask',
        'input[name = taskPriority ]' : '75',
		'input[name = dueDays ]' : 3,
		'input[name = recurScore ]' : 3,
    });
}, true);

	casper.then(function(){
        this.evaluate(function() {
			document.getElementById("btnsubmit").click();
		});
    });
	
	casper.then(function(){
		test.assertExists('#subtitle','task submitted successfully and redirected to choose task');
	});
	
	casper.waitForSelector("li[id='stickytask']", function() {
		this.mouseEvent('mouseover','li');
		this.click('button');
    
}, true);
	
	
	
	casper.then(function(){
		test.assertExists('#stickytask', 'task chosen successfully and redirected to All Tasks page');
	});
	
	
	casper.thenOpen('http://localhost:3000/testDate');
		
	casper.then(function(){
		test.assertTextExists('Due Date', 'Test date page loaded');
	});
	
	

    casper.run(function() {
        test.done();
    });
});

/*
//Testcase for user story "Add Task"
casper.test.begin('TaskYak Add Task', 1, function suite(test) {
    casper.start("http://localhost:3000/login", function() {
        
		casper.waitForSelector("form[action='/login']", function() {
		this.fillSelectors('form#login-form', {
        'input[name = email ]' : 'sudhakar553@gmail.com',
        'input[name = password ]' : 'sudhakar',
    });
}, true);
        			
        this.fill('form[action="/login"]', {
            email: "maulikkothari92@gmail.com"
        }, true);
        this.fill('form[action="/login"]', {
            password: "maulik"
        }, true);
        this.click('#login');
        this.evaluate(function() {
            $('.newTask a')[0].click();     
        });
        test.assertTitle("TaskYak", "Add task page title is the one expected");       
    });

    casper.run(function() {
        test.done();
    });
});


//Test case for User-Story "Incomplete tasks "
casper.test.begin('TaskYak Incomplete Task List', 1, function suite(test) {
    casper.start("http://localhost:3000/login", function() {
        
        
        this.fill('form[action="/login"]', {
            email: "maulikkothari92@gmail.com"
        }, true);
        this.fill('form[action="/login"]', {
            password: "maulik"
        }, true);
        this.click('#login');
		this.evaluate(function() {
            $('.tasklist a')[0].click();     
        });
        test.assertTitle("TaskYak", "Incomplete tasks found");
    });
	
	

    casper.run(function() {
        test.done();
    });
});

//Test case for user story "List of all Tasks"
casper.test.begin('TaskYak Task List', 1, function suite(test) {
    casper.start("http://localhost:3000/login", function() {
        
        
        this.fill('form[action="/login"]', {
            email: "maulikkothari92@gmail.com"
        }, true);
        this.fill('form[action="/login"]', {
            password: "maulik"
        }, true);
        this.click('#login');
		this.evaluate(function() {
            $('.tasklist a')[0].click();     
        });
		test.assertTitle("TaskYak", "Task List found");       
    });

    casper.run(function() {
        test.done();
    });
});

//Test case for user story "User points and minimum user points"
casper.test.begin('TaskYak user points', 1, function suite(test) {
    casper.start("http://localhost:3000/login", function() {
        
        
        this.fill('form[action="/login"]', {
            email: "maulikkothari92@gmail.com"
        }, true);
        this.fill('form[action="/login"]', {
            password: "maulik"
        }, true);
        this.click('#login');
		this.evaluate(function() {
            $('.home a')[0].click();     
			Console.log('found user points table');
        });
		test.assertTitle("TaskYak", "User points and minimum user points found");    
		
    });
	
    casper.run(function() {
        test.done();
    });
});

//Test case for user story "Mark a task as Complete"

casper.test.begin('TaskYak mark a task as Complete', 1, function suite(test) {
    casper.start("http://localhost:3000/login", function() {
        
        
        this.fill('form[action="/login"]', {
            email: "maulikkothari92@gmail.com"
        }, true);
        this.fill('form[action="/login"]', {
            password: "maulik"
        }, true);
        this.click('#login');
		this.evaluate(function() {
            $('.tasklist a')[0].click();     
        });
		test.assertTitle("TaskYak", "Mark a task as complete checkbox found");    
		
    });
	
		
    casper.run(function() {
        test.done();
    });
});

//Test case for user story "recurring tasks" 
casper.test.begin('TaskYak recurring tasks', 1, function suite(test) {
    casper.start("http://localhost:3000/login", function() {
        
        
        this.fill('form[action="/login"]', {
            email: "maulikkothari92@gmail.com"
        }, true);
        this.fill('form[action="/login"]', {
            password: "maulik"
        }, true);
        this.click('#login');
		this.evaluate(function() {
            $('.newTask a')[0].click();     
        });
		test.assertTitle("TaskYak", "Recurring tasks dropdown found");    
    });
	
	
    casper.run(function() {
        test.done();
    });
});


casper.test.begin('TaskYak Login', 1, function suite(test) {
    casper.start("http://localhost:3000/profile", function() {
        
        test.assertExists('form[action="/login"]', "Redirected to the login page");

    });

    casper.run(function() {
        test.done();
    });
});

*/
