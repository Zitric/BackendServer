const express = require( 'express' );
const User = require( '../models/user' );
const router = express.Router();

const bcrypt = require( 'bcrypt' );
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

router.post( '/', ( req, res ) => {

    const body = req.body;

    User.findOne({ email: body.email }, ( err, userDB ) => {

        if( err ) {
            return res.status( 500 ).json({
                ok: false,
                message: 'Error when searching user',
                errors: err
            });
        }
        if ( !userDB ) {
            return res.status( 400 ).json({
                ok: false,
                message: 'Incorrect credentials - email',
                errors: err
            });
        }
        if ( bcrypt.compareSync( body.password, userDB.password )) {
            return res.status( 400 ).json({
                ok: false,
                message: 'Incorrect credentials - password',
                errors: err
            });
        }
        res.status( 200 ).json({
            ok: true,
            message: 'Login works!',
            user: userDB,
            id: userDB.id
        });
    });
});

module.exports = router;