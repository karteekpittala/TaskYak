// googletesting.js



//Testcase for user story "Login"
casper.test.begin('TaskYak Login', 1, function suite(test) {
    casper.start("http://localhost:3000/login", function() {
        
        test.assertExists('form[action="/login"]', "Login form is found");
        this.fill('form[action="/login"]', {
            email: "maulikkothari92@gmail.com"
        }, true);
        this.fill('form[action="/login"]', {
            password: "maulik"
        }, true);
		
		this.click('#login');
 
    });
	casper.then(function(){
		
		test.assertTitle("TaskYak", "Profile page found");    
	});

    casper.run(function() {
        test.done();
    });
});


//Testcase for user story "Add Task"
casper.test.begin('TaskYak Add Task', 3, function suite(test) {
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
        test.assertTitle("TaskYak", "Add task page title is the one expected");       
    });

    casper.run(function() {
        test.done();
    });
});


//Test case for User-Story "Incomplete tasks "
casper.test.begin('TaskYak Incomplete Task List', 4, function suite(test) {
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
casper.test.begin('TaskYak Task List', 5, function suite(test) {
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
casper.test.begin('TaskYak user points', 6, function suite(test) {
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

casper.test.begin('TaskYak mark a task as Complete', 7, function suite(test) {
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
casper.test.begin('TaskYak recurring tasks', 8, function suite(test) {
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
		test.assertTitle("TaskYak", "Task List page title is the one expected");    
    });
	
	
    casper.run(function() {
        test.done();
    });
});


casper.test.begin('TaskYak Login', 2, function suite(test) {
    casper.start("http://localhost:3000/profile", function() {
        
        test.assertExists('form[action="/login"]', "Redirected to the login page");

    });

    casper.run(function() {
        test.done();
    });
});