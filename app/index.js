const Router          = require('restify-router').Router;
const restify         = require('restify');
const mongoose        = require('mongoose');
const settings        = require('./settings')(process.env);
const log             = require('./log').Log;
const User            = require('./dataAccess/models/User');
const flash           = require('connect-flash');
const passport        = require('passport-restify');
const passportInit    = require('./init/passport');
const adminInit       = require('./init/admin');
const LocalStrategy   = require('passport-local').Strategy;
const sessions        = require('client-sessions');
const routes           = require('./routes');

const isModule = require.main !== module

const app = {
    init: (log, adminInit, passportInit, settings, passport, User ) => {
        log('log', 'info', 'initialized logging');

        adminInit(User, {
          user: settings.adminUser,
          pass: settings.adminPass,
        }, log);
        passportInit.configure(passport, User);

    },
    configureServer: (restify, sessions, settings, flash, passport) => {
        const server = restify.createServer({
          name: settings.appName,
        });

        server.use(restify.queryParser());
        server.use(restify.bodyParser());
        server.use(flash());

        server.use(sessions({
            // cookie name dictates the key name added to the request object
            cookieName: 'session',
            // should be a large unguessable string
            secret: settings.sessionSecret,
            // how long the session will stay valid in ms
            duration: 90 * 24 * 60 * 60 * 1000, // 90 days
        }));

        // Initialize passport
        server.use(passport.initialize());
        // Set up the passport session
        server.use(passport.session());

        return server;
    },
    configureRoutes: (Router, routes, server, passport, log) => {
        const router = new Router();
        router.add('/', routes(router, passport, log));

        router.applyRoutes(server, '/');
    },
    configureDB: (mongoose, settings, promise, log) => {
        const mongooseConnectionString = "mongodb://" + settings.mongoIP + ":" + settings.mongoPort + "/" + settings.mongoDatabase;
        mongoose.Promise = promise;
        mongoose.connect(mongooseConnectionString);
        log('db', 'info', "Connected to db @ " + mongooseConnectionString);
    },
    startServer: (server, settings, log) => {
        server.listen(settings.port, function() {
          log('server', 'info', `${server.name} listening at ${server.url}`);
        });
    },
    run: (log, adminInit, passportInit, settings, passport, User, restify, sessions, flash, mongoose) => {

        app.init(log, adminInit, passportInit, settings, passport, User);
        const server = app.configureServer(restify, sessions, settings, flash, passport);
        app.configureRoutes(Router, routes, server, passport, log)
        app.configureDB(mongoose, settings, global.Promise, log);
        app.startServer(server, settings, log);
    },
}

/* istanbul ignore if  */
if (!isModule) {
    // for injectability during testing...
    app.run(
        log,
        adminInit,
        passportInit,
        settings,
        passport,
        User,
        restify,
        sessions,
        flash,
        mongoose
    );
} else {
    module.exports =  app;
}
