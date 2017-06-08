import express         from 'express';
import mongoose        from 'mongoose';
import Settings        from './settings';
import { Log as log }  from './log';
import UserAccess      from './dataAccess/user';
import UserModel       from './dataAccess/models/User';
import flash           from 'connect-flash';
import passport        from 'passport';
import queryParser     from 'query-parser';
import bodyParser      from 'body-parser';
import passportInit    from './init/passport';
import adminInit       from './init/admin';
import { Strategy as LocalStrategy } from 'passport-local';
import session        from 'express-session';
import routes          from './routes';
import authRoutes      from './routes/auth';

const settings = Settings(process.env);

export const app = {
    init: (log, adminInit, passportInit, settings, passport, UserAccess, UserModel, LocalStrategy) => {
        log('log', 'info', 'initialized logging');
        const User = new UserAccess(UserModel);

        adminInit(User, {
          user: settings.adminUser,
          pass: settings.adminPass,
        }, log);
        passportInit.configure(passport, User, LocalStrategy);

    },
    configureServer: (restify, sessions, settings, flash, passport) => {
        const server = express();

        //server.use(queryParser());
        server.use(bodyParser());
        server.use(flash());

        server.use(session({
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
    configureRoutes: (Router, routes, authRoutes, server, passport, log) => {
        const router = Router();
        router.use(routes(Router, authRoutes, passport, log));

        server.use('/', router);
        //router.applyRoutes(server, '/');
    },
    configureDB: (mongoose, settings, promise, log) => {
        const mongooseConnectionString = "mongodb://" + settings.mongoIP + ":" + settings.mongoPort + "/" + settings.mongoDatabase;
        mongoose.Promise = promise;
        mongoose.connect(mongooseConnectionString);
        log('db', 'info', "Connected to db @ " + mongooseConnectionString);
    },
    startServer: (server, settings, log) => {
        server.listen(settings.port, function() {
          log('server', 'info', `${settings.appName} listening at http://localhost:${settings.port}`);
        });
    },
    run: (log, adminInit, passportInit, settings, passport, LocalStrategy, UserAccess, UserModel, express, sessions, flash, mongoose, routes, authRoutes) => {
        app.init(log, adminInit, passportInit, settings, passport, UserAccess, UserModel, LocalStrategy);
        const server = app.configureServer(express, sessions, settings, flash, passport);
        app.configureRoutes(express.Router, routes, authRoutes, server, passport, log)
        app.configureDB(mongoose, settings, global.Promise, log);
        app.startServer(server, settings, log);
    },
}

app.run(
    log,
    adminInit,
    passportInit,
    settings,
    passport,
    LocalStrategy,
    UserAccess,
    UserModel,
    express,
    session,
    flash,
    mongoose,
    routes,
    authRoutes
);
