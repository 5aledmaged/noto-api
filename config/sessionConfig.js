import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';

const MongoStore = connectMongo(session);

const sessionConfig = {
	cookie: {
		sameSite: false,
		maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
	},
	name: 'session-id',
	resave: true,
	saveUninitialized: false,
	secret: process.env.NOTO_EXPRESS_SESSION_SECRET,
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
		secret: process.env.NOTO_MONGO_SESSION_SECRET,
		collection: process.env.NOTO_SESSION_COLLECTION
	})
};

export default session(sessionConfig);
