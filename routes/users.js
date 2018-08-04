var express = require( 'express' );
var router = express.Router();
var User = require( '../models/user' );


const bcrypt = require( 'bcrypt' );

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

// ==========================================================
//    LIST OF USERS
// ==========================================================
router.get( '/', ( req, res, next ) => {

  User.find({ }, 'name email img role' )
      .exec(
        ( err, users ) => {

          if( err ) {
            return res.status( 500 ).json({
                ok: false,
                message: 'Error load users of the data base',
                errors: err
            });
          }
          res.status( 200 ).json({
              ok: true,
              users
          });

      });
});

// ==========================================================
//    CREATE USER
// ==========================================================
router.post( '/', ( req, res ) => {

    var body = req.body;

    var user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync ( body.password, saltRounds ),
        img: body.img,
        role: body.role
    });

    user.save( ( err, userDB ) => {
        if( err ) {
            return res.status( 400 ).json({
                ok: false,
                message: 'error when creating user',
                errors: err
            });
        }

        res.status( 201 ).json({
            ok: true,
            user: userDB
        });
    });
});


module.exports = router;
