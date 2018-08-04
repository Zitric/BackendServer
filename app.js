// Requires
var createError = require( 'http-errors' );
var express = require( 'express' );
var path = require( 'path' );
var cookieParser = require( 'cookie-parser' );
var logger = require( 'morgan' );
var mongoose = require( 'mongoose' );
var bodyParser = require( 'body-parser' );


// Routes imports
var indexRouter = require( './routes/index' );
var usersRouter = require( './routes/users' );

// Variables
var app = express(  );

// view engine setup
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'hbs' );

app.use( logger( 'dev' ) );
app.use( express.json(  ) );
app.use( express.urlencoded( { extended: false } ) );
app.use( cookieParser(  ) );
app.use( express.static( path.join( __dirname, 'public' ) ) );

// Middlewares
app.use( '/', indexRouter );
app.use( '/users', usersRouter );

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




// =================================================================
//                            CODE
// =================================================================

app.listen(  3000, (  ) => {
    console.log( 'The port is ', 3000  );
}  );

// Connection to database
mongoose.connection.openUri( 'mongodb://localhost:27017/hospitalDB', ( err, res ) => {
    if ( err ) {
        throw err;
    } else {
        console.log( 'Data base ONLINE' );
    }
} );

// =================================================================
//                            CODE
// =================================================================



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
