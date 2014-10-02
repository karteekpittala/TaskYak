module.exports = {
	development: {
		db: 'mongodb://admin:password@ds043170.mongolab.com:43170/taskyak',
		app: {
			name: 'TaskYak'
		},
		facebook: {
			clientID: "297391533797903",
			clientSecret: "c0aa925fda2790bacc61b6ef15879441",
			callbackURL: "http://localhost:3000/auth/facebook/callback"
		},

		google: {
			clientID: "{{PLACEHOLDER}}",
			clientSecret: "{{PLACEHOLDER}}",
			callbackURL: "{{PLACEHOLDER}}"
		}
	},
  	production: {
    	db: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL,
		app: {
			name: 'Passport Authentication Tutorial'
		},
		facebook: {
			clientID: "",
			clientSecret: "",
			callbackURL: ""
		},
		google: {
			clientID: '',
			clientSecret: '',
			callbackURL: ''
		}
 	}
}
