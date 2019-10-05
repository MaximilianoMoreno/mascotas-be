'use strict';

module.exports = {
    folderImagesPath: 'temp',
    app: {
        title: 'GMG',
        description: 'Web server for GMG',
        keywords: ''
    },
    db: 'mongodb://admin:gmgadmin@ds119456-a0.mlab.com:19456,ds119456-a1.mlab.com:19456/gmg-db?replicaSet=rs-ds119456',
    templateEngine: 'swig',

    assets: {
        lib: {
            css: [
                'public/lib/bootstrap/dist/css/bootstrap.css',
                'public/lib/bootstrap/dist/css/bootstrap-theme.css',
                'public/lib/angular-material/angular-material.css',
                'public/lib/font-awesome/css/font-awesome.css',
                'public/lib/font-awesome-animation/dist/font-awesome-animation.css'

            ],
            js: [
                'public/lib/angular/angular.js',
                'public/lib/angular-resource/angular-resource.js',
                'public/lib/angular-cookies/angular-cookies.js',
                'public/lib/angular-animate/angular-animate.js',
                'public/lib/angular-sanitize/angular-sanitize.js',
                'public/lib/angular-ui-router/release/angular-ui-router.js',
                'public/lib/angular-bootstrap/ui-bootstrap.js',
                'public/lib/lodash/dist/lodash.js',
                'public/lib/jquery/dist/jquery.js',
                'public/lib/bootstrap/dist/js/bootstrap.js',
                'public/lib/angular-material/angular-material.js',
                'public/lib/angular-aria/angular-aria.js'
            ]
        },
        css: [
            'public/modules/**/css/*.css'
        ],
        js: [
            'public/config.js',
            'public/application.js',
            'public/modules/*/*.js',
            'public/modules/*/*[!tests]*/*.js'
        ],
        tests: [
            'public/lib/angular-mocks/angular-mocks.js',
            'public/modules/*/tests/*.js'
        ]
    }
};
