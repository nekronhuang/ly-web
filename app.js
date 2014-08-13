var express = require('express'),
    path = require('path'),
    app = express(),
    logger = require('morgan'),
    jade = require('jade'),
    favicon = require('serve-favicon'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    compress = require('compression'),
    errorHandler = require('errorhandler'),
    csurf = require('csurf'),
    bodyParser = require('body-parser'),
    multipart = require('connect-multiparty'),
    methodOverride = require('method-override'),
    MongoStore = require('connect-mongo')(session),
    routes = require('./routes'),
    config = require('./config');

app.use(logger('dev'));
app.use(compress());
app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(express.static(__dirname + '/public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.engine('jade', jade.__express);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(multipart({
    uploadDir: path.join(__dirname, 'tmp')
}));
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
    key: 'sid',
    cookie: {
        maxAge: config.maxAge
    },
    secret: config.secret,
    store: new MongoStore({
        db: 'lianyun'
    }),
    saveUninitialized: true,
    resave: true
}));

if (config.debug) {
    app.use(errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
} else {
    app.use(csurf());
    app.set('view cache', true);
}

require('./models');
routes(app);

app.listen(config.port, function () {
    console.log('listening on port %d in %s mode', config.port, app.settings.env);
});