import express         from 'express';
import mongoose        from 'mongoose';
import Settings        from './settings';
import log             from './log';
import flash           from 'connect-flash';
import passport        from 'passport';
import bodyParser      from 'body-parser';
import passportInit    from './init/passport';
import adminInit       from './init/admin';
import session         from 'express-session';
import routes          from './routes';

export default function run() {
    const settings = Settings(process.env);
    log('log', 'info', 'initialized logging');

    adminInit({
      user: settings.adminUser,
      pass: settings.adminPass,
    });

    passportInit.configure(passport);

    const server = express();
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

    // Initialize passport and passport sessions
    server.use(passport.initialize());
    server.use(passport.session());

    // Initialize routes
    log('routes', 'info', 'initializing routes');
    const router = express.Router();
    router.use(routes(passport));
    server.use('/', router);

    const mongooseConnectionString = "mongodb://" + settings.mongoIP + ":" + settings.mongoPort + "/" + settings.mongoDatabase;
    mongoose.Promise = global.Promise;
    mongoose.connect(mongooseConnectionString);
    log('db', 'info', "Connected to db @ " + mongooseConnectionString);

    server.listen(settings.port, function() {
      log('server', 'info', `${settings.appName} listening at http://localhost:${settings.port}`);
    });
}

if(module.id === '.') {
    run();
}
