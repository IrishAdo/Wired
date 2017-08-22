/**
 * Wired Server.js
 * 
 * This is the main file of the server and is used to launch the service.
 * 
 * @class server
 * @module server
 */

/*
 * Load get the packages we need to start with.
 */
// Note: using staging server url, remove .testing() for production
var ssl = false;
const LEX = require('letsencrypt-express')
const fs = require('fs')
const config = require('./source/config');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const cons = require('consolidate');
// const ClientAPI = require('node-rest-client').Client;
const uuid = require('node-uuid');
const app = express();
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
// console.log(numCPUs);
if (false && cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
    console.log('-- Initialising fork of Server');

  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server

  // =======================
  // configuration =========
  // =======================
  app.engine('html', cons.swig);
  app.set('superSecret', config.secret); // secret variable
  app.set('view engine', 'html');
  app.set('views', __dirname + "/source/theme/templates");
  app.use(express.static(__dirname + '/resources'));
  app.set('getModel', function(key) {
    if (app.get('models')[key]) {
      return app.get('models')[key];
    } else {
      console.log(key + ' doesn\'t exist');
    }
  }); // secret variable

  console.log('-- connecting to database');
  var dbConnection = config.database;
  var serverPort = config.port;


  if (process.env.NODE_ENV == 'production') {
    dbConnection = process.env.MONGO_URL;
    serverPort = process.env.PORT;
  }


  if (process.env.NODE_ENV == 'staging') {
    dbConnection = process.env.MONGO_URL;
    serverPort = process.env.PORT;
  }


  // console.log(dbConnection);
  mongoose.connect(dbConnection); // connect to database
  console.log('-- setup base routes');

  // use body parser so we can get info from POST and/or URL parameters
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  // use morgan to log requests to the console
  app.use(morgan('dev'));
  console.log('Define Session handling routine');
  app.use(session({
    genid: function(req) {
      return uuid.v4(); // use UUIDs for session IDs
    },
    store: new MongoStore({
      url: dbConnection
    }),
    secret: "a68b3092-e639-455e-a865-2624d16c800f",
    cookie: {
      maxAge: 86400000, // 1 day in milliseconds
      // secure: true,
      // httpOnly: true
    },
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
  }));


  console.log('Loading Middleware');

  app.use(function(req, res, next) {
    console.log('check path ' + req.url);
    if (req.url.indexOf('/admin/') !== -1) {
      console.log("Admin - folder");
      next();
    } else {
      var sites = app.get('getModel')('sites');
      sites.findOne({
        domains: {
          $in: [req.headers.host]
        }
      }, function(err, doc) {
        if (doc === null) {
          console.log('redirect to Register New Site ' + req.headers.host);
          res.redirect("/admin/registerNewSite?domain=" + req.headers.host);
        } else {
          req.session.site = doc;
          next();
        }
      });
    }
  });


  console.log('-- Loading classes');

  var classes = fs.readdirSync(config.paths.classes);
  for (var index = 0; index < classes.length; index++) {
    var className = classes[index].replace('.js', '');
    app.set(className, require(config.paths.classes + className)());
  }

  console.log('-- Loading models');
  var modelList = fs.readdirSync(config.paths.models);
  var models = {};
  for (var index = 0; index < modelList.length; index++) {
    var modelName = modelList[index].replace('.js', '');
    models[modelName] = require(config.paths.models + modelName);
    console.log(modelName);
  }
  app.set('models', models);
  console.log('-- Loading routes');
  var routes = fs.readdirSync(config.paths.routes);
  for (var index = 0; index < routes.length; index++) {
    var routeName = routes[index].replace('.js', '');
    require(config.paths.routes + routeName)(app);
  }


  // -------------------------------------------------------------------------------------------------
  // FUNCTION: wildcard route for all undefined routes
  // Type Route
  // Desc: Handle all 404
  // -------------------------------------------------------------------------------------------------
  app.get('*', function(req, res) {
    console.log('url ' + req.url);
    var paths = app.get('getModel')('paths');
      paths.findOne({
        $and:[
          {clientId: req.session.site.uuid},
          {
            $or :[
              { path : {$in :[req.url]} },
              { redirection_paths : {$in :[req.url]} }
            ]
          }
        ]
        
      }, function(err, doc) {
        if (doc === null) {
          res.status(404);
          // respond with html page
          if (req.accepts('html')) {
            // load the 404 template 'templates/404.html'
            res.render('404', {
              session: req.session,
              url: req.url
            });
            return;
          }

          // respond with json
          if (req.accepts('json')) {
            res.send({
              error: 'Not found'
            });
            return;
          }

          // default to plain-text. send()
          res.type('txt').send('Not found');
        } else {
          // instead of returning the information we will redirect to the url.
          res.json({
            success: true,
            data: doc
          });
        }
      });
  });


  if (ssl) {
    LEX.create({
      server: 'staging',
      email: 'john.doe@irishado.com',
      agreeTos: true,
      approveDomains: [
        config.domain
      ],
      app: app
    }).listen(8001, 4433);
  } else {

    console.log('-- Starting Server');
    app.listen(serverPort);
  }
}