const express = require('express'),
	router = express.Router();
(passport = require('passport')),
	(User = require('../models/user')),
	(Campground = require('../models/campground')),
	(async = require('async')),
	(nodemailer = require('nodemailer')),
	(crypto = require('crypto'));

// Landing Route //
router.get('/', (req, res) => {
	res.render('landing');
});

//Forgot Pass Route
router.get('/forgot', (req, res) => {
	res.render('forgot');
});

//Reset Pass Route
router.post('/forgot', (req, res, next) => {
	async.waterfall(
		[
			function(done) {
				crypto.randomBytes(20, function(err, buf) {
					var token = buf.toString('hex');
					done(err, token);
				});
			},
			function(token, done) {
				User.findOne({ email: req.body.email }, function(err, user) {
					if (!user) {
						req.flash('error', 'No account with that email exists');
						return res.redirect('/forgot');
					}

					user.resetPasswordToken = token;
					user.resetPasswordExpires = Date.now() + 3600000;

					user.save(function(err) {
						done(err, token, user);
					});
				});
			},
			function(token, user, done) {
				var smtpTransport = nodemailer.createTransport({
					host: 'smtp.gmail.com',
					auth: {
						type: 'login',
						user: 'camppassresetinfo@gmail.com',
						pass: process.env.GMAILPW
					}
				});
				var mailOptions = {
					to: user.email,
					from: 'camppassresetinfo@gmail.com',
					subject: 'YelpCamp Password Reset',
					text:
						'You are receiving this because you (or someone else) have requested a password reset for YelpCamp.' +
						'  Please click on the following link to complete the reset.' +
						'  http://' +
						req.headers.host +
						'/reset/' +
						token +
						'\n\n' +
						'If you did not request this, please ignore this email and your password will remain unchanged.'
				};
				smtpTransport.sendMail(mailOptions, function(err) {
					req.flash(
						'success',
						'An email has been sent to ' +
							user.email +
							' with further instructions'
					);
					done(err, 'done');
				});
			}
		],
		function(err) {
			if (err) {
				return next(err);
			}
			res.redirect('/forgot');
		}
	);
});

router.get('/reset/:token', (req, res) => {
	User.findOne(
		{
			resetPasswordToken: req.params.token,
			resetPasswordExpires: { $gt: Date.now() }
		},
		(err, user) => {
			if (!user) {
				req.flash('error', 'Password reset token is invalid or has expired');
				return res.redirect('/forgot');
			}
			res.render('reset', { token: req.params.token });
		}
	);
});

router.post('/reset/:token', (req, res) => {
	async.waterfall(
		[
			function(done) {
				User.findOne(
					{
						resetPasswordToken: req.params.token,
						resetPasswordExpires: { $gt: Date.now() }
					},
					function(err, user) {
						if (!user) {
							req.flash(
								'error',
								'Password reset token is invalid or has expired'
							);
							return res.redirect('back');
						}
						if (req.body.password === req.body.confirm) {
							user.setPassword(req.body.password, function(err) {
								user.resetPasswordToken = undefined;
								user.resetPasswordExpires = undefined;

								user.save(function(err) {
									req.logIn(user, function(err) {
										done(err, user);
									});
								});
							});
						} else {
							req.flash('error', 'Passwords do not match');
							return res.redirect('back');
						}
					}
				);
			},
			function(user, done) {
				var smtpTransport = nodemailer.createTransport({
					service: 'Gmail',
					auth: {
						user: 'camppassresetinfo@gmail.com',
						pass: process.env.GMAILPW
					}
				});
				var mailOptions = {
					to: user.email,
					from: 'camppassresetinfo@gmail.com',
					subject: 'Your password has been successfully changed',
					text:
						'This is a confirmation that the password for your account ' +
						user.email +
						' has just been updated.'
				};
				smtpTransport.sendMail(mailOptions, function(err) {
					req.flash('success', 'All done! Your password has been changed');
					done(err);
				});
			}
		],
		function(err) {
			res.redirect('/campgrounds');
		}
	);
});

module.exports = router;
