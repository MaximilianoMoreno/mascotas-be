'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    consolidate = require('consolidate'),
    compress = require('compression'),
    path = require('path'),
    mongoose = require('mongoose'),
    chalk = require('chalk'),
      User = require('./app/models/usuarioMascota.server.model'),
      jsonwebtoken = require("jsonwebtoken"),
      allowCrossDomain = function(req, res, next) {
          res.header('Access-Control-Allow-Origin', '*');
          res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
          res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
          // intercept OPTIONS method
          if ('OPTIONS' === req.method) {
              res.sendStatus(200);
          }
          else {
              next();
          }
      };

require('./config/initEnv')();
var config = require('./config/config');
var routes = require('./config/initRoutes');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */
// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
    if (err) {
        console.error(chalk.red('Could not connect to MongoDB!'));
        console.log(chalk.red(err));
    } else {
        console.log(chalk.red('MongoDB started at: ' + config.db));
        console.log(chalk.red('Local Time: ' + Date(Date.now() )));
    }
});

var App = function() {
    //  Scope.
    var self = this;

    self.terminator = terminator;
    self.setupTerminationHandlers = setupTerminationHandlers;

    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */
    self.start = start;
    self.initialize = initialize;
    self.initializeServer = initializeServer;
    self.initializeModels = initializeModels;
};

/**
 *  main():  Main code.
 */
var zapp = new App();
zapp.initialize();
zapp.start();

/**
 *  Start the server (starts up the sample application).
 */
function start() {
    //  Start the app on the specific interface (and port).
    /*zapp.app.listen(config.port, config.hostname, function() {
     console.log('%s: Node server started on %s:%d ...',
     Date(Date.now() ), config.hostname, config.port);
     });*/
}

/**
 *  Initializes the sample application.
 */
function initialize() {
    zapp.setupTerminationHandlers();

    // Create the express server and routes.
    zapp.initializeModels();
    zapp.initializeServer();
}

/**
 *  Initialize the server (express) and create the routes and register
 *  the handlers.
 */
function initializeServer() {
    zapp.app.use(allowCrossDomain);
    zapp.app.use(bodyParser.json({limit: '50mb'}));
    //zapp.app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    var ioObject = createSocket();

    routes.init(zapp.app, ioObject);

    // Setting application local variables
    zapp.app.locals.title = config.app.title;
    zapp.app.locals.jsFiles = config.getJavaScriptAssets();
    zapp.app.locals.cssFiles = config.getCSSAssets();

    // Passing the request url to environment locals
    /*zapp.app.use(function(req, res, next) {
     res.locals.url = req.protocol + '://' + req.headers.host + req.url;
     next();
     });*/

    // Should be placed before express.static
    zapp.app.use(compress({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    // Showing stack errors
    zapp.app.set('showStackError', true);

    // Set swig as the template engine
    zapp.app.engine('server.view.html', consolidate[config.templateEngine]);

    // Set views path and view engine
    zapp.app.set('view engine', 'server.view.html');
    zapp.app.set('views', 'app/views');

    // Setting the app router and static folder
    zapp.app.use(express.static(path.resolve('./public')));
    //zapp.app.use('public/assets', express.static(path.resolve('./public/assets')));
}

function initializeModels() {
    zapp.app = express();

    // Globbing model files
    zapp.app.use(function(req,res,next){
        if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT'){
            jsonwebtoken.verify(req.headers.authorization && req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode){
                if (err) req.user = undefined;
                req.user = decode;
                next();
            });
        } else if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'gmgAuth'){
            jsonwebtoken.verify(req.headers.authorization && req.headers.authorization.split(' ')[1], 'SuperAdm1n!', function(err, decode){
                if (err) req.sUser = undefined;
                req.sUser = decode;
                next();
            });
        }else {
            req.user = undefined;
            next();
        }
    });

    // Globbing model files
    config.getGlobbedFiles('./app/models/**/*.js', true).forEach(function(modelPath) {
        require(path.resolve(modelPath));
    });
}

/**
 *  terminator === the termination handler
 *  Terminate server on receipt of the specified signal.
 *  @param {string} sig  Signal to terminate on.
 */
function terminator(sig){
    if (typeof sig === 'string') {
        console.log('%s: Received %s - terminating sample app ...',
          Date(Date.now()), sig);
        process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()) );
}

/**
 *  Setup termination handlers (for exit and a list of signals).
 */
function setupTerminationHandlers(){
    //  Process on exit and signals.
    process.on('exit', function() { zapp.terminator(); });

    // Removed 'SIGPIPE' from the list - bugz 852598.
    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
        'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    ].forEach(function(element, index, array) {
          process.on(element, function() { zapp.terminator(element); });
      });
}

function createSocket() {
    var server = require('http').Server(zapp.app);
    var io = require('socket.io')(server);

    console.log('Server running on port ' + config.port);
    server.listen(config.port, config.hostname);

    return io;
}
