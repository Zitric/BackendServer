// Requires
const express = require( 'express' );
const Doctor = require( '../models/doctor');
const { verifyToken } = require( '../middlewares/authentication');

const router = express.Router();


// ==========================================================
//    LIST OF DOCTORS
// ==========================================================
router.get( '/', (req, res, next ) => {

    const from = Number( req.query.from ) || 0;
    const limit = Number( req.query.limit ) || 5;

    Doctor.find({ }, 'name img user hospital' )
        .skip(from)
        .limit(limit)
        .populate( 'user', 'name email' )
        .populate( 'hospital', 'name' )
        .exec(
            ( err, doctors ) => {

                if( err ) {
                    return res.status( 500 ).json({
                        ok: false,
                        message: 'Error load doctors of the data base',
                        errors: err
                    });
                }
                Doctor.count({ status: true }, ( err, total ) => {
                    res.json({
                        ok: true,
                        doctors,
                        total
                });
        });
    });
});


// ==========================================================
//    CREATE DOCTOR
// ==========================================================
router.post( '/', verifyToken, ( req, res ) => {

    const body = req.body;

    console.log('body', body );

    const doctor = new Doctor({
        name: body.name,
        user: req.user._id,
        hospital: body.hospital
    });

    doctor.save( ( err, doctorDB ) => {

        if( err ) {
            return res.status( 400 ).json({
                ok: false,
                message: 'Error when creating doctor',
                errors: err
            });
        }

        res.json({
            ok: true,
            doctor: doctorDB
        });
    });
});


// ==========================================================
//    UPDATE DOCTOR
// ==========================================================
router.put( '/:id', verifyToken, ( req, res ) => {

    const id = req.params.id;
    const body = req.body ;

    Doctor.findByIdAndUpdate( id, body,  { new: true },
        ( err, doctorDB ) => {

            if( err ) {
                return res.status( 400 ).json({
                    ok: false,
                    message: 'Error when updating doctor',
                    errors: err
                });
            }
            res.json({
                ok: true,
                doctor: doctorDB
            });

        });
});


// ==========================================================
//    DELETE DOCTOR
// ==========================================================
router.delete( '/:id', verifyToken, ( req, res ) => {

    var id = req.params.id;

    Doctor.findByIdAndRemove( id, ( err, doctorDB ) => {

        if( err ) {
            return res.status( 500 ).json({
                ok: false,
                message: 'Error when deleting hospital',
                errors: err
            });
        }
        if ( !doctorDB ) {
            return res.status( 400 ).json({
                ok: false,
                message: 'The doctor with the id ' + id + ' does not exist',
                errors: { message: 'the doctor does not exist' }
            });
        }
        res.status( 200 ).json({
            ok: true,
            doctor: doctorDB
        });
    });

});




module.exports = router;
