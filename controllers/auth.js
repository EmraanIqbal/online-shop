const crypto = require('crypto')
const bcrypt = require("bcryptjs");
const nodeMailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const User = require("../models/user");

const transporter = nodeMailer.createTransport(sendgridTransport({
  auth: {
    api_key: "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"
  }
}))

exports.getLogin = (req, res, next) => {
  //   const isLoggedIn = req
  //     .get('Cookie')
  //     .split(';')[1]
  //     .trim()
  //     .split('=')[1] === 'true';
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: req.flash('error')
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid Email or Password')
        return res.redirect("/login");
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          console.log(doMatch)
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return res.redirect("/");
          }
          req.flash('error', 'Invalid Email or Password')
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });

      // next();
      // res.session?.save((err) => {
      //   console.log(err)
      // res.redirect('/');
      // })
    })
    .catch((err) => console.log(err));
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Sign Up",
    errorMessage: req.flash('error')
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash('error', 'Email exists already, please pick a different one')
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashPassword) => {
          const user = new User({
            email,
            password: hashPassword,
            cart: { items: [] },
          });

          return user.save();
        })
        .then(() => {
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: "emi@test.com",
            subject: "Sign up succeeded!",
            html: '<h1>You successfully signed up!</h1>'
          })
        }).catch(err => {
          console.log(err)
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: req.flash('error')
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset')
    } else {
      const token = buffer.toString('hex');
      User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
          req.flash('error', 'With that email no Account found');
          return res.redirect('/reset')
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save()
      }).then(result => {
        res.redirect('/')
        console.log(result)
        transporter.sendMail({
          to: req.body?.email,
          from: "emi@test.com",
          subject: "Password Reset",
          html: `
            <p>You Request a Password Reset!</p>
            <p>Click this  <a href='http://localhost:3000/reset/${token}'>link</a> to set a new password</p>
          `
        })
      }).catch(err => console.log(err))
    }
  })
}