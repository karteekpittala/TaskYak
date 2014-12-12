// googletesting.js



//Testcase for user story "Login"
casper.test.begin('TaskYak_User_Login', 2, function suite(test) {
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
        console.log(this.getCurrentUrl());
    });

    casper.then(function(){
        test.assertTextExists('Hi','Login successful');
    });
    

    casper.run(function() {
        test.done();
    });
});
