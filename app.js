
require('./config/config');

// Requires
const createError = require( 'http-errors' );
const express = require( 'express' );
const path = require( 'path' );
const cookieParser = require( 'cookie-parser' );
const logger = require( 'morgan' );
const mongoose = require( 'mongoose' );
const bodyParser = require( 'body-parser' );


// Routes imports
const indexRouter = require( './routes/index' );
const usersRouter = require( './routes/users' );
const loginRouter = require( './routes/login' );
const hospitalsRouter = require( './routes/hospitals' );
const doctorsRouter = require( './routes/doctors' );
const searchRouter = require( './routes/search' );
const uploadRouter = require( './routes/upload' );
const imagesRouter = require( './routes/images' );

const app = express(  );

// Cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Token");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});


// view engine setup
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'hbs' );

app.use( logger( 'dev' ) );
app.use( express.json(  ) );
app.use( express.urlencoded( { extended: false } ) );
app.use( cookieParser(  ) );
app.use( express.static( path.join( __dirname, 'public' ) ) );

// middlewares
app.use( '/', indexRouter );
app.use( '/users', usersRouter );
app.use( '/login', loginRouter );
app.use( '/hospitals', hospitalsRouter );
app.use( '/doctors', doctorsRouter );
app.use( '/search', searchRouter );
app.use( '/upload', uploadRouter );
app.use( '/img', imagesRouter );

// parse application/x-www-form-urlencoded
app.use( bodyParser.urlencoded({ extended: false }) );
app.use( bodyParser.json() );


// Connection to database
mongoose.connection.openUri( process.env.URLDB, ( err, res ) => {
    if ( err ) throw err;
    console.log( 'Data base \x1b[32m%s\x1b[0m', 'ONLINE' );
});

// Server index config
// const serveIndex = require( 'serve-index' );
// app.use( express.static(__dirname + '/' ))
// app.use( '/uploads', serveIndex( __dirname + '/uploads' ));


// catch 404 and forward to error handler
app.use( function( req, res, next ) {
  next( createError( 404 ) );
} );

// error handler
app.use( function( err, req, res, next ) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get( 'env' ) === 'development' ? err : {};

  // render the error page
  res.status( err.status || 500 );
  res.render( 'error' );
} );

module.exports = app;
