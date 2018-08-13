const express = require( 'express' );
const router = express.Router();
const Hospital = require( '../models/hospital' );
const Doctor = require( '../models/doctor' );

// ==========================================================
//    GET SEARCH PAGE
// ==========================================================
router.get( '/all/:search', (req, res, next ) => {

    // pattern of search
    const search = req.params.search;
    const regularExpression = new RegExp( search, 'i' );

    searchHospitals( search, regularExpression )
        .then( hospitals => {

            res.status( 200 ).json({
                ok: true,
                hospitals
            });
        });
});



function searchHospitals( search, regularExpression ) {

    return new Promise( ( resolve, reject ) => {

        Hospital.find({ name: regularExpression }, ( err, hospitals ) => {
            if( err ) {
                reject( 'Error loading hospitals', err );
            } else {
                resolve( hospitals );
            }
        });
    });

}

module.exports = router;
