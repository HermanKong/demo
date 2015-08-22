var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');
var crypto = require('crypto');

exports.index = function(req, res, next) {
  Post.find({}).exec(function(err, posts) {
    if (err) return next(err);
    posts = posts
    res.render('home', {
      title: 'Wellcome to Herman\'s Demo',
      posts: posts
    });
  })
}

exports.reg = function(req, res, next) {
  res.render('reg', {
    title: 'Registration'
  });
}

exports.doReg = function(req, res, next) {

  if (req.body.username == '') {
    req.flash('error', 'Please input the username');
    return res.redirect('reg')
  };

  if (req.body.password == '' || req.body.password == '') {
    req.flash('error', 'Please input the password');
    return res.redirect('reg')
  };

  if (req.body['password-repeat'] != req.body['password']) {
    req.flash('error', 'Password not match');
    return res.redirect('reg')
  }

  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');

  User.find({
      name: req.body.username
    })
    .exec(function(err, user) {
      console.log(user)
      if (err) return next(err);
      if (user.length != 0) {
        req.flash('error', 'User is already registered');
        return res.redirect('reg')
      } else {

        new User({
          name: req.body.username,
          password: password,
        }).save(function(err, user) {
          if (err) return next(err);
          req.flash('success', 'Register successfully');
          req.session.user = user.name;
          return res.redirect('/')
        });
      }
    })
}


exports.login = function(req, res, next) {
  res.render('login', {
    title: 'Login'
  });
}

exports.doLogin = function(req, res, next) {

  if (req.body.username == '') {
    req.flash('error', 'Please input the username');
    return res.redirect('login')
  };

  if (req.body.password == '' || req.body.password == '') {
    req.flash('error', 'Please input the password');
    return res.redirect('login')
  };

  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');

  User.find({
      name: req.body.username,
      password: password,
    })
    .exec(function(err, user) {
      if (err) return next(err);
      if (user.length > 0) {
        if (user[0].password != password) {
          req.flash('error', 'Incorrect Password');
          return res.redirect('/login');
        } else {
          req.session.user = user[0].name;
          req.flash('success', 'Login successfully');
          return res.redirect('/');
        }
      } else {
        req.flash('error', 'Username not found');
        return res.redirect('/login');
      }
    });
}

exports.post = function(req, res, next) {
  var currentUser = req.session.user;
  var timeInServer = new Date()
  if(timeInServer.getTimezoneOffset == 0){
    var time = new Date(timeInServer + (8*60*1000)); // convert to hong kong time
  } else {
    var time = new Date();
  }
  new Post({
    user: currentUser,
    post: req.body.post,
    time: time
  }).save(function(err) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    req.flash('success', 'Post successfully');
    return res.redirect('/');
  })
}

exports.logout = function(req, res, next) {
  req.session.destroy()
  return res.redirect('/');
}

exports.checkLogin = function(req, res, next) {
  if (!req.session.user) {
    req.flash('error', 'Please Login');
    return res.redirect('/login');
  }
  next();
}

exports.checkNotLogin = function(req, res, next) {
  if (req.session.user) {
    req.flash('error', 'Already login');
    return res.redirect('/');
  }
  next();
}