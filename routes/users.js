// Requires
const express = require( 'express' );
const bcrypt = require( 'bcrypt' );
const User = require( '../models/user' );
const _ = require( 'underscore' );
const { verifyToken, verifyAdminRole } = require( '../middlewares/authentication');

const router = express.Router();
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';



// ==========================================================
//    LIST OF USERS
// ==========================================================
router.get( '/', verifyToken, ( req, res, next ) => {


    const from = Number( req.query.from ) || 0;
    const limit = Number( req.query.limit ) || 5;

    User.find({ status: true }, 'name email img role status' )
        .skip(from)
        .limit(limit)
        .exec(
            ( err, users ) => {

              if( err ) {
                return res.status( 500 ).json({
                    ok: false,
                    message: 'Error load users of the data base',
                    errors: err
                });
              }
              User.count({ status: true }, ( err, total ) => {
                  res.json({
                      ok: true,
                      users,
                      total
              });
          });
     });
});


// ==========================================================
//    CREATE USER
// ==========================================================
router.post( '/', verifyToken , ( req, res ) => {

    const body = req.body;

    const user = new User({
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
                message: 'Error when creating users',
                errors: err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });
});

// ==========================================================
//    UPDATE USER
// ==========================================================
router.put( '/:id', verifyToken, ( req, res ) => {

    const id = req.params.id;
    const body = _.pick( req.body, ['name', 'email', 'role', 'img']) ;

    User.findByIdAndUpdate( id, body,  { new: true, runValidators: true },
        ( err, userDB ) => {

            if( err ) {
                return res.status( 400 ).json({
                    ok: false,
                    message: 'Error when updating users',
                    errors: err
                });
            }
            res.json({
                ok: true,
                user: userDB
            });

    });
});

// ==========================================================
//    DELETE USER
// ==========================================================
router.delete( '/:id', verifyToken, ( req, res ) => {

    var id = req.params.id;

    User.findByIdAndRemove( id, ( err, userDB ) => {

        if( err ) {
            return res.status( 500 ).json({
                ok: false,
                message: 'Error when deleting users',
                errors: err
            });
        }
        if ( !userDB ) {
            return res.status( 400 ).json({
                ok: false,
                message: 'The users with the id ' + id + ' does not exist',
                errors: { message: 'the users does not exist' }
            });
        }
        res.status( 200 ).json({
            ok: true,
            user: userDB
        });
    });

});

module.exports = router;
