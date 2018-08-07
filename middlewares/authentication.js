const jwt = require( 'jsonwebtoken' );
const SEED = require( '../config/config').SEED;

// ==========================================================
//    VERIFY TOKEN
// ==========================================================
exports.verifyToken( ( req, res, next ) => {

    const token = req.query.token;

    jwt.verify( token, SEED, ( err, decoded ) => {

        if( err ) {
            return res.status( 401 ).json({
                ok: false,
                message: 'Incorrect token',
                errors: err
            });
        }
        // next();
        return res.status( 200 ).json({
            ok: true,
            decoded

        });
    });

});

