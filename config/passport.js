import passport from 'passport';
import { Strategy } from 'passport-local';
import mongoose from 'mongoose';

const User = mongoose.model('User');

const verifyUser = (username, password, done) => {
	User.findOne({ email: username })
		.then(user => {
			if (!user) {
				done(null, false, { message: 'User not found' });
			}
			else {
				user.checkPassword(password)
					.then(isCorrect => {
						if (isCorrect) {
							done(null, user);
						}
						else {
							done(null, false, { message: 'wrong password' });
						}
					})
					.catch(err => done(err));
			}
		})
		.catch(err => done(err));
};

const localStrategy = new Strategy({
	usernameField: 'email',
	passwordField: 'password'
}, verifyUser);

passport.use(localStrategy);