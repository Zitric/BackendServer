const express = require( 'express' );
const router = express.Router();
const fileUpload = require( 'express-fileupload' );
const fs = require( 'fs' );

const User = require( '../models/user' );
const Doctor = require( '../models/doctor' );
const Hospital = require( '../models/hospital' );

router.use( fileUpload() );


// ==========================================================
//    UPLOADING THE IMG
// ==========================================================
router.put( '/:table/:id', (req, res, next ) => {

    const table = req.params.table;
    const id = req.params.id;

    // tables
    const enabledTables = [ 'hospitals', 'doctors', 'users' ];

    if( enabledTables.indexOf( table ) < 0 ) {
        return res.status( 400 ).json({
            ok: false,
            message: 'The table of collectios is not valid',
            err: { message: 'The table of collectios is not valid' }
        });
    }

    if( !req.files ) {
        return res.status( 400 ).json({
           ok: false,
           message: 'You select nothing',
           err: { message: 'Must select a image' }
        });
    }

    // Get file name
    const file = req.files.img;
    const arrayName = file.name.split('.');
    const extension = arrayName[ arrayName.length -1 ];

    // We accept only this extension
    const enabledExtensnions = [ 'png', 'jpg', 'gif', 'jpeg' ];

    if( enabledExtensnions.indexOf( extension ) < 0 ) {
        return res.status( 400 ).json({
            ok: false,
            message: 'Invalid extension',
            err: { message: 'The extension valid are ' +  enabledExtensnions.join(', ') }
        });
    }

    // Normalizing the name to the server
    const fileName = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    // the path of the folder
    const path = `./uploads/${ table }/${ fileName }`;

    // Move the file to a folder path
    file.mv( path, err => {

        if( err ) {
            return res.status( 400 ).json({
                ok: false,
                message: 'Error moving the file',
                errors: err
            });
        }
        uploadByTable( table, id, fileName, res );
    });
});

// ==========================================================
//    UPDATING THE TABLE WITH THE NEW IMG
// ==========================================================
function uploadByTable( table, id, fileName, res ) {

    switch ( table ) {
        case 'users':

            User.findById( id, ( err, user ) => {

                if( !user ) {
                    return res.status( 400 ).json({
                        ok: false,
                        message: 'The user dont exist',
                        errors: { message: 'The user dont exist' }

                    });
                }

                const oldPath = './uploads/users/' + user.img;

                // If exist, remove the prior img
                if( fs.existsSync( oldPath )) {
                    fs.unlink( oldPath );
                }

                user.img = fileName;

                user.save(( err, updatedUser ) => {

                    return res.status( 200 ).json({
                        ok: true,
                        message: 'Img of user updated',
                        user: updatedUser
                    });
                });
            });
            break;

        case 'doctors':

            Doctor.findById( id, ( err, doctor ) => {

                if( !doctor ) {
                    return res.status( 400 ).json({
                        ok: false,
                        message: 'The doctor dont exist',
                        errors: { message: 'The doctor dont exist' }

                    });
                }

                const oldPath = './uploads/doctors/' + doctor.img;

                if( fs.existsSync( oldPath )) {
                    fs.unlink( oldPath );
                }

                doctor.img = fileName;

                doctor.save(( err, updatedDoctor ) => {

                    return res.status( 200 ).json({
                        ok: true,
                        message: 'Img of doctor updated',
                        doctor: updatedDoctor
                    });
                });
            });
            break;

        case 'hospitals':

            Hospital.findById( id, ( err, hospital ) => {

                if( !hospital ) {
                    return res.status( 400 ).json({
                        ok: false,
                        message: 'The hospital dont exist',
                        errors: { message: 'The hospital dont exist' }

                    });
                }

                const oldPath = './uploads/hospitals/' + hospital.img;

                if( fs.existsSync( oldPath )) {
                    fs.unlink( oldPath );
                }

                hospital.img = fileName;

                hospital.save(( err, updatedHospital ) => {

                    return res.status( 200 ).json({
                        ok: true,
                        message: 'Img of doctor updated',
                        hospital: updatedHospital
                    });
                });
            });
            break;
    }

}


module.exports = router;
