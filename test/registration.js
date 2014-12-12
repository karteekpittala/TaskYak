// googletesting.js



//Testcase for user story "Login"
casper.test.begin('TaskYak_New_User_Signup', 2, function suite(test) {
    casper.start("http://localhost:3000/signup", function() {
        
        //console.log(this.getCurrentUrl());


        test.assertExists('form[action="/signup"]', "SignUp form is found");
        
        casper.waitForSelector("form[action='/signup']", function() {
        this.fillSelectors('form#signup', {
        'input[name = firstName]': 'Rakesh',
        'input[name = lastName]': 'Menon',
        'input[name = email ]' : 'rakesh@gmail.com',
        'input[name = password ]' : 'rakesh',
        'input[name = confirm_password ]' : 'rakesh',
        
    });
}, true);

    });
       
       casper.then(function(){
        this.evaluate(function() {
            document.getElementById("SignUp").click();
        });
    });
    
    casper.then(function(){
        console.log(this.getCurrentUrl());
    });

    casper.then(function(){
        test.assertTextExists('Hi','New user profile created');
    });
    

    casper.run(function() {
        test.done();
    });
});
