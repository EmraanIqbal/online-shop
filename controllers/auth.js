const bcrypt = require('bcryptjs')

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  //   const isLoggedIn = req
  //     .get('Cookie')
  //     .split(';')[1]
  //     .trim()
  //     .split('=')[1] === 'true';
  console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  user.findById('6427c08e2b1dccb541b3b6e8')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      // next();
      // res.session?.save((err) => {
      //   console.log(err)
      res.redirect('/');
      // })

    })
    .catch(err => console.log(err));

};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Sign Up',
    isAuthenticated: false
  });
}

exports.postSignup = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  User.findOne({ email }).then((userDoc) => {
    if (userDoc) {
      return res.redirect('/signup')
    }
    return bcrypt.hash(password, 12).then((hashPassword) => {
      const user = new User({
        email, password: hashPassword, cart: { items: [] }
      })

      return user.save()
    }).then(() => {
      res.redirect('/login');
    })
  })
    .catch(err => console.log(err))
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  })
};