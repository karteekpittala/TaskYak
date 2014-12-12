//test case to choose a tasks
//Testcase for user story "Login"
casper.test.begin('TaskYak Login', 1, function suite(test) {
    casper.start("http://localhost:3000/login", function() {
        
        test.assertExists('form[action="/login"]', "Login form is found");
        this.fill('form[action="/login"]', {
            email: "karteekp1989@gmail.com"
        }, true);
        this.fill('form[action="/login"]', {
            password: "karteek"
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
