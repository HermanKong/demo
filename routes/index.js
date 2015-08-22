// var crypto = require('crypto');
// // var User = require('../models/user.js');
// // var Post = require('../models/post.js');

// module.exports = function(app) {

//   app.get('/',function(req,res){
//     res.render('indes',{
//       title: 'Home'
//     });
//   });

//   // app.get('/', function(req, res) {
//   //   console.log(" / ")
//   //   Post.get(null, function(err, posts) {
//   //     if (err) {
//   //       posts = [];
//   //     }
//   //     res.render('index', {
//   //       title: '首頁',
//   //       posts: posts,
//   //     });
//   //   });
//   // });

//   // app.get('/reg', checkNotLogin);
//   // app.get('/reg', function(req, res) {
//   //   res.render('reg', {
//   //     title: '用戶註冊',
//   //   });
//   // });

//   // app.post('/reg', checkNotLogin);
//   // app.post('/reg', function(req, res) {
//   //   //檢驗用戶兩次輸入的口令是否一致
//   //   if (req.body['password-repeat'] != req.body['password']) {
//   //     req.flash('error', '兩次輸入的口令不一致');
//   //     return res.redirect('/reg');
//   //   }

//   //   //生成口令的散列值
//   //   var md5 = crypto.createHash('md5');
//   //   var password = md5.update(req.body.password).digest('base64');

//   //   var newUser = new User({
//   //     name: req.body.username,
//   //     password: password,
//   //   });

//   //   //檢查用戶名是否已經存在
//   //   User.get(newUser.name, function(err, user) {
//   //     if (user)
//   //       err = 'Username already exists.';
//   //     if (err) {
//   //       req.flash('error', err);
//   //       return res.redirect('/reg');
//   //     }
//   //     //如果不存在則新增用戶
//   //     newUser.save(function(err) {
//   //       if (err) {
//   //         req.flash('error', err);
//   //         return res.redirect('/reg');
//   //       }
//   //       req.session.user = newUser;
//   //       req.flash('success', '註冊成功');
//   //       res.redirect('/');
//   //     });
//   //   });
//   // });

//   // app.get('/login', checkNotLogin);
//   // app.get('/login', function(req, res) {
//   //   res.render('login', {
//   //     title: '用戶登入',
//   //   });
//   // });

//   // app.post('/login', checkNotLogin);
//   // app.post('/login', function(req, res) {
//   //   //生成口令的散列值
//   //   var md5 = crypto.createHash('md5');
//   //   var password = md5.update(req.body.password).digest('base64');

//   //   User.get(req.body.username, function(err, user) {
//   //     if (!user) {
//   //       req.flash('error', '用戶不存在');
//   //       return res.redirect('/login');
//   //     }
//   //     if (user.password != password) {
//   //       req.flash('error', '用戶口令錯誤');
//   //       return res.redirect('/login');
//   //     }
//   //     req.session.user = user;
//   //     req.flash('success', '登入成功');
//   //     res.redirect('/');
//   //   });
//   // });

//   // app.get('/logout', checkLogin);
//   // app.get('/logout', function(req, res) {
//   //   req.session.user = null;
//   //   req.flash('success', '登出成功');
//   //   res.redirect('/');
//   // });

//   // app.get('/u/:user', function(req, res) {
//   //   User.get(req.params.user, function(err, user) {
//   //     if (!user) {
//   //       req.flash('error', '用戶不存在');
//   //       return res.redirect('/');
//   //     }
//   //     Post.get(user.name, function(err, posts) {
//   //       if (err) {
//   //         req.flash('error', err);
//   //         return res.redirect('/');
//   //       }
//   //       res.render('user', {
//   //         title: user.name,
//   //         posts: posts,
//   //       });
//   //     });
//   //   });
//   // });

//   // app.post('/post', checkLogin);
//   // app.post('/post', function(req, res) {
//   //   var currentUser = req.session.user;
//   //   var post = new Post(currentUser.name, req.body.post);
//   //   post.save(function(err) {
//   //     if (err) {
//   //       req.flash('error', err);
//   //       return res.redirect('/');
//   //     }
//   //     req.flash('success', '發表成功');
//   //     res.redirect('/u/' + currentUser.name);
//   //   });
//   // });
// };

// // function checkLogin(req, res, next) {
// //   if (!req.session.user) {
// //     req.flash('error', '未登入');
// //     return res.redirect('/login');
// //   }
// //   next();
// // }

// // function checkNotLogin(req, res, next) {
// //   if (req.session.user) {
// //     req.flash('error', '已登入');
// //     return res.redirect('/');
// //   }
// //   next();
// // }
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
    title: 'Registration',
  });
}

exports.doReg = function(req, res, next) {

  if (req.body.username == '') {
    req.flash('error', 'Please input the user name');
    res.render('reg', {
      title: 'Registration'
    });
  };

  if (req.body.password == '' || req.body.password == '') {
    req.flash('error', 'Please input the password');
    res.render('reg', {
      title: 'Registration'
    });
  };

  User.find({
      name: req.body.username
    })
    .exec(function(err, user) {
      if (err) return next(err);
      if (user.length != undefined) {
        if (user.length > 0) {
          req.flash('error', 'User is already registered');
          res.render('reg', {
            title: 'Registration'
          });
        }
      }
    })

  if (req.body['password-repeat'] != req.body['password']) {
    req.flash('error', 'Password not match');
    res.render('reg', {
      title: 'Registration'
    })
  }

  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');

  new User({
    name: req.body.username,
    password: password,
  }).save(function(err, user) {
    if (err) return next(err);
    req.flash('success', 'Register successfully');
    req.session.user = user.name;
    res.redirect('/')
  });
}


exports.login = function(req, res, next) {
  res.render('login', {
    title: 'Login'
  });
}

exports.doLogin = function(req, res, next) {
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');

  User.find({
      name: req.body.username,
      password: password,
    })
    .exec(function(err, user) {
      if (err) return next(err);
      if (user.length != undefined) {
        if (user.length > 0) {
          if (user[0].password != password) {
            req.flash('error', 'Incorrect Password');
            res.redirect('/login');
          } else {
            req.session.user = user[0].name;
            req.flash('success', 'Login successfully');
            res.redirect('/');
          }
        }
      } else {
        req.flash('error', 'Username not found');
        res.redirect('/login');
      }
    });
}

exports.post = function(req, res, next) {
  var currentUser = req.session.user;
  var time = new Date()
  new Post({
    user: currentUser,
    post: req.body.post,
    time: time
  }).save(function(err) {
    if (err) {
      req.flash('error', err);
      res.redirect('/');
    }
    req.flash('success', 'Post successfully');
    res.redirect('/u/' + currentUser);
  })
}

exports.u = function(req, res, next) {
  User.find({
    name: req.params.user
  }).exec(function(err, user) {
    if (!user) {
      req.flash('error', 'Username not found');
      res.redirect('/');
    }
    Post.find({}).exec(function(err, posts) {
      if (err) return next(err);
      posts = posts
      res.render('user', {
        title: user.name,
        posts: posts
      });
    })
  })
}

exports.logout = function(req, res, next) {
  app.get('/logout', function(req, res) {
    req.session.user = null;
    req.flash('success', 'Logout successfully');
    res.redirect('/');
  });
}

exports.checkLogin = function(req, res, next) {
  if (req.session.user) {
    req.flash('error', 'Please Login');
    res.redirect('/login');
  }
  next();
}

exports.checkNotLogin = function(req, res, next) {
  if (req.session.user) {
    req.flash('error', 'Already login');
    res.redirect('/');
  }
  next();
}