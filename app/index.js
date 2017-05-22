const Router          = require('restify-router').Router;
const restify         = require('restify');
const mongoose        = require('mongoose');
const settings        = require('./settings')(process.env);
const log             = require('./log').Log;
const User            = require('./user/user');
const flash           = require('connect-flash');
const passport        = require('passport-restify');
const passportInit    = require('./init/passport');
const adminInit       = require('./init/admin');
const LocalStrategy   = require('passport-local').Strategy;
const sessions        = require("client-sessions");

log('log', 'info', 'initialized logging');

mongoose.Promise = global.Promise;

adminInit(User, {
  user: settings.adminUser,
  pass: settings.adminPass,
}, log);
passportInit(passport, User);

const server = restify.createServer({
  name: 'Thunderhunt-API',
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

const router = new Router();
router.add('/', require('./routes')(passport, log));

router.applyRoutes(server, '/');

var mongooseConnectionString = "mongodb://" + settings.mongoIP + ":" + settings.mongoPort + "/" + settings.mongoDatabase;
mongoose.connect(mongooseConnectionString);
log('db', 'info', "Connected to db @ " + mongooseConnectionString);

server.listen(settings.port, function() {
  log('server', 'info', `${server.name} listening at ${server.url}`);
});
