// Requires
const express = require( 'express' );
const Hospital = require( '../models/hospital');
const { verifyToken } = require( '../middlewares/authentication');

const router = express.Router();


// ==========================================================
//    LIST OF HOSPITALS
// ==========================================================
router.get( '/', (req, res, next ) => {

    const from = Number( req.query.from ) || 0;
    const limit = Number( req.query.limit ) || 5;

    Hospital.find({})
        .skip(from)
        .limit(limit)
        .populate('user', 'name email')
        .exec(
            ( err, hospitals ) => {

                if( err ) {
                    return res.status( 500 ).json({
                        ok: false,
                        message: 'Error load hospitals of the data base',
                        errors: err
                    });
                }
                Hospital.count({ status: true }, ( err, total ) => {
                    res.json({
                        ok: true,
                        hospitals,
                        total
                });
        });
    });
});


// ==========================================================
//    CREATE HOSPITAL
// ==========================================================
router.post( '/', verifyToken, ( req, res ) => {

    const body = req.body;

    const hospital = new Hospital({
        name: body.name,
        user: req.user._id
    });

    hospital.save( ( err, hospitalDB ) => {

        if( err ) {
            return res.status( 400 ).json({
                ok: false,
                message: 'Error when creating hospital',
                errors: err
            });
        }

        res.json({
            ok: true,
            hospital: hospitalDB
        });
    });
});

// ==========================================================
//    UPDATE HOSPITAL
// ==========================================================
router.put( '/:id', verifyToken, ( req, res ) => {

    const id = req.params.id;
    const body = req.body ;

    Hospital.findByIdAndUpdate( id, body,  { new: true },
        ( err, hospitalDB ) => {

            if( err ) {
                return res.status( 400 ).json({
                    ok: false,
                    message: 'Error when updating hospital',
                    errors: err
                });
            }
            res.json({
                ok: true,
                hospital: hospitalDB
            });

        });
});


// ==========================================================
//    DELETE HOSPITAL
// ==========================================================
router.delete( '/:id', verifyToken, ( req, res ) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove( id, ( err, hospitalDB ) => {

        if( err ) {
            return res.status( 500 ).json({
                ok: false,
                message: 'Error when deleting hospital',
                errors: err
            });
        }
        if ( !hospitalDB ) {
            return res.status( 400 ).json({
                ok: false,
                message: 'The hospital with the id ' + id + ' does not exist',
                errors: { message: 'the hospital does not exist' }
            });
        }
        res.status( 200 ).json({
            ok: true,
            hospital: hospitalDB
        });
    });

});


module.exports = router;

