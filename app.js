var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');
var Models = require("./models");

var index = require('./routes/index');
var login = require('./routes/login');
var company = require('./routes/company');
var user_file = require('./routes/user');
var project = require('./routes/project');
var timesheet = require('./routes/timesheet');
var pdf = require('./routes/pdf');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Set up session configurations
var fs = require("fs");

var config = {};
var cookieName_in = "";
var secret_in = "";
var duration_in = 0;
var activeDuration_in = 0;

if(process.env.NODE_ENV === 'development') {
  var text = fs.readFileSync("config/session_config_dev.json");
  config = JSON.parse(text);
}
else {
  var text = fs.readFileSync("config/session_config_dev.json");
  config = JSON.parse(text);
}

cookieName_in = config.cookieName;
secret_in = config.secret;
duration_in = config.duration;
activeDuration_in = config.activeDuration;

app.use(session({
  cookieName: cookieName_in,
  secret: secret_in,
  duration: duration_in,
  activeDuration: activeDuration_in,
}));

//Session middleware

app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    Models.User.findOne({ _id: req.session.user._id }, function(err, user) {
      if (user) {
        req.user = user;
        delete req.user.password; // delete the password from the session
        req.session.user = user;  //refresh the session value
        res.locals.user = user;
      }
      // finishing processing the middleware and run the route
      next();
    });
  } else {
    next();
  }
});

app.use('/', index);
app.use('/', login);
app.use('/company', company);
app.use('/user', user_file);
app.use('/project', project);
app.use('/timesheet', timesheet);
app.use('/pdf', pdf);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
