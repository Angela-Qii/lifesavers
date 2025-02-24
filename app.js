import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session';
//import msIdExpress from 'microsoft-identity-express'

// COMMENT: Azure database stuff. Need to replace

// To install msal-node-wrapper, run:
//     npm install https://gitpkg.now.sh/kylethayer/ms-identity-javascript-nodejs-tutorial-msal-node-v2-/Common/msal-node-wrapper?main
import WebAppAuthProvider from 'msal-node-wrapper'
// original msal-node-wrapper code is here (https://github.com/Azure-Samples/ms-identity-javascript-nodejs-tutorial/tree/main/Common/msal-node-wrapper),
//  but at the time of making this, the original code depends on outdated version of @azure/msal-node

const authConfig = {
	auth: {
			clientId: "45ea8f42-240e-4b13-afec-c7cd9953ba03",
			authority: "https://login.microsoftonline.com/f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
			clientSecret: "0xv8Q~B_KnLVqUtHuSdk6dQZpNoMbObfmg_QWbUw",
			redirectUri: "http://localhost:3000/redirect", //note: you can explicitly make this "localhost:3000/redirect" or "examplesite.me/redirect"
	}, //https://websharer-cdong03-a6.onrender.com/redirect
	system: {
			loggerOptions: {
					loggerCallback(loglevel, message, containsPii) {
							console.log(message);
					},
					piiLoggingEnabled: false,
					logLevel: 3,
			}
	}
};

import models from './models.js'
import apiv1Router from './routes/api/v1/apiv1.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: "this is some secret key I am making up v45v;lkjgdsal;nwqt49asglkn",
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}))

const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
app.use(authProvider.authenticate());

app.use((req, res, next) => {
	req.models = models;
	next();
});

app.use((req, res, next) =>{
	console.log("session info:", req.session)
	next();
})

// COMMENT: Need to change a lot of this

app.get(
	'/signin',
	(req, res, next) => {
		return req.authContext.login({
			postLoginRedirectUri: "/", // redirect here after login
		})(req, res, next);
	}
);

app.get(
	'/signout',
	(req, res, next) => {
		return req.authContext.logout({
			postLogoutRedirectUri: "/", // redirect here after logout
		})(req, res, next);
	}
);

app.use((req, res, next) => {
    req.models = models
    next()
})

/**
 * This error handler is needed to catch interaction_required errors thrown by MSAL.
 * Make sure to add it to your middleware chain after all your routers, but before any other
 * error handlers.
 */
app.use(authProvider.interactionErrorHandler());

app.use('/api/v1', apiv1Router);

export default app;