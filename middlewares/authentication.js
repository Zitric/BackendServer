const jwt = require( 'jsonwebtoken' );

// ==========================================================
//    VERIFY TOKEN
// ==========================================================
const verifyToken = ( ( req, res, next ) => {

    const token = req.get( 'token' );

    console.log('token: ', token );

    jwt.verify( token, process.env.SEED, ( err, decoded ) => {

        if( err ) {
            return res.status( 401 ).json({
                ok: false,
                err: { message: 'Incorrect token' }
            });
        }
        next();
        req.user = decoded.user;
        // return res.status( 200 ).json({
        //     ok: true,
        //     decoded
        //
        // });
    });

});

// ==========================================================
//    VERIFY ADMIN ROLE
// ==========================================================
const verifyAdminRole = ( req, res, next ) => {

    const user = req.user;

    if ( user.role !== 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            err: { message: 'the user is not administrator' }
        });
    }
    next();
};

module.exports = {
    verifyToken,
    verifyAdminRole
};