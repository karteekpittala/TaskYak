//test case to choose a tasks
//Testcase for user story "Login"
casper.test.begin('TaskYak-choose task', 1, function suite(test) {
    casper.start("http://localhost:3000", function() {
        
        test.assertExists('form[action="/login"]', "Login form is found");
        
        casper.waitForSelector("form[action='/login']", function() {
        this.fillSelectors('form#login-form', {
        'input[name = email ]' : 'karteekp1989@gmail.com',
        'input[name = password ]' : 'karteek',
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
    
    casper.thenOpen('http://localhost:3000/choosetask');
    
    
    /*casper.waitForSelector('nav li#newTask', function() {
        
        this.click('#');
    });
    */
    casper.then(function(){
        console.log(this.getCurrentUrl());
    });
    
    casper.then(function(){
        test.assertExists('#subtitle','Addtask page loaded properly');
    });

    casper.run(function() {
        test.done();
    });
});
