const express = require( 'express' );
const User = require( '../models/user' );
const bcrypt = require( 'bcrypt' );
const jwt = require( 'jsonwebtoken' );

const router = express.Router();

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

const { OAuth2Client } = require( 'google-auth-library' );
const client = new OAuth2Client( process.env.CLIENT_ID );

// ==========================================================
//    POST LOGIN COMMUN
// ==========================================================
router.post( '/', ( req, res ) => {

    const body = req.body;

    User.findOne({ email: body.email }, ( err, userDB ) => {

        if( err ) {
            return res.status( 500 ).json({
                ok: false,
                message: 'Error when searching users',
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
        if ( !bcrypt.compareSync( body.password, userDB.password )) {
            return res.status( 400 ).json({
                ok: false,
                message: 'Incorrect credentials - password',
                errors: err
            });
        }

        // create a token
        const token =  jwt.sign(
            { user: userDB },
            process.env.SEED,
            { expiresIn: process.env.EXPIRATION_TOKEN }
        );


        res.status( 200 ).json({
            ok: true,
            message: 'Login works!',
            user: userDB,
            id: userDB.id,
            token
        });
    });
});

// ==========================================================
//    GOOGLE CONFIGURATIONS
// ==========================================================
// ==========================================================
//    VERIFING TOKEN AND RETURN THE DATA
// ==========================================================
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];


    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

// ==========================================================
//    POST LOGIN GOOGLE
// ==========================================================
router.post( '/google', async ( req, res ) => {
    
    const token = req.body.token;

    const googleUser = await verify( token )
        .catch( e => {
            return res.status( 403 ).json({
               ok: false,
               message: 'Invalid token'
            });
        });

    User.findOne({ email: googleUser.email }, ( err, userDB ) => {

        if( err ) {
            return res.status( 500 ).json({
                ok: false,
                message: 'Error when searching users',
                errors: err
            });
        }
        if ( userDB ) {

            if( userDB.google === false ) {
                return res.status( 400 ).json({
                    ok: false,
                    message: 'Must use common authentication'
                });
            } else {
                const token =  jwt.sign(
                    { user: userDB },
                    process.env.SEED,
                    { expiresIn: process.env.EXPIRATION_TOKEN }
                );

                return res.status( 200 ).json({
                    ok: true,
                    user: userDB,
                    id: userDB.id,
                    token
                });
            }

        } else {

            const user = new User();

            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';

            user.save(( err, userDB ) => {

                const token =  jwt.sign(
                    { user: userDB },
                    process.env.SEED,
                    { expiresIn: process.env.EXPIRATION_TOKEN }
                );

                return res.status( 200 ).json({
                    ok: true,
                    user: userDB,
                    id: userDB.id,
                    token
                });
            });

        }
    });
});



module.exports = router;