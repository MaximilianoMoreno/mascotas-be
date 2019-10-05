'use strict';

module.exports = {
	"hostname":  process.env.HOST,
	"port": process.env.PORT,
	'socketPort': 8000,

	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
				'public/lib/angular-material/angular-material.min.css',
				'public/lib/font-awesome/css/font-awesome.min.css',
				'public/lib/font-awesome-animation/dist/font-awesome-animation.min.css'
			],
			js: [
				'public/lib/angular/angular.min.js',
				'public/lib/angular-resource/angular-resource.min.js',
				'public/lib/angular-cookies/angular-cookies.min.js',
				'public/lib/angular-animate/angular-animate.min.js',
				'public/lib/angular-sanitize/angular-sanitize.min.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap.min.js',
				'public/lib/lodash/dist/lodash.min.js',
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/bootstrap/dist/js/bootstrap.min.js',
				'public/lib/angular-material/angular-material.min.js',
				'public/lib/angular-aria/angular-aria.min.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.js'
	}
};
