/**
 * Module dependencies.
 */
var db = require('./models/db');
var mongoose = require('mongoose');
var express = require('express');
var http = require('http');
var routes = require('./routes');
var settings = require('./settings');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var engine = require('ejs-locals');
var partials = require('express-partials')

var app = express();
var routes = require('./routes');

// Configuration
app.engine('ejs', engine);
app.set('views', __dirname + '/views');
app.set('view options', { layout:'layout.ejs' });
app.set('view engine', 'ejs');
app.use(partials())
app.use(methodOverride());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/public'));
app.use(flash());

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'herman',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 60
  })
}))

app.use(function(req, res, next) {
  res.locals.user = req.session.user;

  var err = req.flash('error');
  var success = req.flash('success');

  res.locals.error = err.length ? err : null;
  res.locals.success = success.length ? success : null;

  next();
});


// Routes
app.get('/', routes.index);
app.get('/reg', routes.reg);
app.post('/reg', routes.doReg);
app.get('/login', routes.checkNotLogin, routes.login);
app.post('/login', routes.doLogin);
app.post('/post', routes.post);
app.get('/u/:user', routes.u);


// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

http.createServer(app).listen(3000, function() {
  console.log('Express server listening on port 3000');
});