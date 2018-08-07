const express = require( 'express' );
const bcrypt = require( 'bcrypt' );
const User = require( '../models/user' );
const mdAuthentication = require( '../middlewares/authentication');

var router = express.Router();
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
router.post( '/', mdAuthentication.verifyToken , ( req, res ) => {

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
                message: 'Error when creating user',
                errors: err
            });
        }

        res.status( 201 ).json({
            ok: true,
            user: userDB
        });
    });
});

// ==========================================================
//    UPDATE USER
// ==========================================================
router.put( '/:id', ( req, res ) => {

    var id = req.params.id;
    var body = req.body;

    User.findById( id, ( err, user ) => {

        if( err ) {
            return res.status( 500 ).json({
                ok: false,
                message: 'Error when searching user',
                errors: err
            });

        }
        if ( !user ) {
            return res.status( 400 ).json({
                ok: false,
                message: 'The user with the id ' + id + ' does not exist',
                errors: err
            });
        }
        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save(( err, userDB ) => {
            if( err ) {
                return res.status( 400 ).json({
                    ok: false,
                    message: 'Error when updating user',
                    errors: err
                });
            }
            res.status( 201 ).json({
                ok: true,
                user: userDB
            });
        });
    });
});

// ==========================================================
//    DELETE USER
// ==========================================================
router.delete( '/:id', ( req, res ) => {

    var id = req.params.id;

    User.findByIdAndRemove( id, ( err, userDB ) => {

        if( err ) {
            return res.status( 500 ).json({
                ok: false,
                message: 'Error when deleting user',
                errors: err
            });
        }
        if ( !userDB ) {
            return res.status( 400 ).json({
                ok: false,
                message: 'The user with the id ' + id + ' does not exist',
                errors: { message: 'the user does not exist' }
            });
        }
        res.status( 200 ).json({
            ok: true,
            user: userDB
        });
    });

});

module.exports = router;
