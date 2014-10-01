// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '297391533797903', // your App ID
		'clientSecret' 	: 'c0aa925fda2790bacc61b6ef15879441', // your App Secret
		'callbackURL' 	: 'http://localhost:8080/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'Os0gvjt1zC8yRTEE0BDM4uzW4',
		'consumerSecret' 	: 'CBIMpbGsfRsj6y7BxyzbfLWU96WQ2IZveyB1dapGNxCRXmOvmB',
		'callbackURL' 		: 'http://localhost:8080/auth/twitter/callback'
	},
};