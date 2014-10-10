// googletesting.js
casper.test.begin('TaskYak Login', 2, function suite(test) {
    casper.start("http://localhost:3000/login", function() {
        test.assertTitle("TaskYak", "TaskYak login page title is the one expected");
        test.assertExists('form[action="/login"]', "Login form is found");
        this.fill('form[action="/login"]', {
            email: "maulikkothari92@gmail.com"
        }, true);
        this.fill('form[action="/login"]', {
            password: "maulik"
        }, true);
 
    });

    casper.run(function() {
        test.done();
    });
});


casper.test.begin('TaskYak Login', 2, function suite(test) {
    casper.start("http://localhost:3000/profile", function() {
        test.assertTitle("TaskYak", "Trying to hit the profile page without logging in.");
        test.assertExists('form[action="/login"]', "Redirected to the login page");

    });

    casper.run(function() {
        test.done();
    });
});

casper.test.begin('TaskYak Login', 2, function suite(test) {
    casper.start("http://localhost:3000/login", function() {
        test.assertTitle("TaskYak", "TaskYak login page title is the one expected");
        test.assertExists('form[action="/login"]', "Login form is found");
        this.fill('form[action="/login"]', {
            email: "maulikkothari92@gmail.com"
        }, true);
        this.fill('form[action="/login"]', {
            password: "maulik"
        }, true);
        this.click('button[type="submit"]')
        this.click('.newTask')
 
    });

    casper.run(function() {
        test.done();
    });
});



