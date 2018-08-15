const express = require( 'express' );
const router = express.Router();
const Hospital = require( '../models/hospital' );
const Doctor = require( '../models/doctor' );
const User = require( '../models/user' );


// ==========================================================
//    SEARCH BY COLLECTION
// ==========================================================
router.get( '/collection/:table/:search', ( req, res ) => {

    // pattern of search
    const search = req.params.search;
    const table = req.params.table;
    const regularExpression = new RegExp( search, 'i' );
    var promise;

    switch ( table ) {
        case 'hospitals':
            promise = searchHospitals( search, regularExpression );
            break;

        case 'doctors':
            promise = searchDoctors( search, regularExpression );
            break;

        case 'users':
            promise = searchUsers( search, regularExpression );
            break;

        default:
            return res.status( 400 ).json({
                ok: false,
                message: 'The types of search are: users, hospitals and doctors',
                err: { message: 'kind of table is not valid'}
            });
    }

    promise.then( data => {
        res.status( 200 ).json({
            ok: true,
            [table]: data
        });
    });
});

// ==========================================================
//    SEARCH BY ALL
// ==========================================================
router.get( '/all/:search', ( req, res ) => {

    // pattern of search
    const search = req.params.search;
    const regularExpression = new RegExp( search, 'i' );

    Promise.all([
        searchHospitals( search, regularExpression ),
        searchDoctors( search, regularExpression),
        searchUsers( search, regularExpression)])
        .then( responses => {

            res.status( 200 ).json({
                ok: true,
                hospitals: responses[0],
                doctors: responses[1],
                users: responses[2]
            });
        });
});


// ==========================================================
//    SEARCH IN HOSPITALS
// ==========================================================
function searchHospitals( search, regularExpression ) {

    return new Promise( ( resolve, reject ) => {

        Hospital.find({ name: regularExpression, status: true })
            .populate( 'user', 'name email' )
            .exec (( err, hospitals ) => {

            err ?
                reject( 'Error loading hospitals', err )
                :
                resolve( hospitals )
        });
    });
}


// ==========================================================
//    SEARCH IN DOCTORS
// ==========================================================
function searchDoctors( search, regularExpression ) {

    return new Promise( ( resolve, reject ) => {

        Doctor.find({ name: regularExpression, status: true })
            .populate( 'user', 'name email' )
            .populate( 'hospital' )
            .exec(( err, doctors ) => {

            err ?
                reject( 'Error loading doctors', err )
                :
                resolve( doctors )
        });
    });
}


// ==========================================================
//    SEARCH IN USER
// ==========================================================
function searchUsers( search, regularExpression ) {

    return new Promise( ( resolve, reject ) => {

        User.find({ status: true }, 'name email role status')
            .or([{ 'name': regularExpression }, { 'email': regularExpression }])
            .exec(( err, users ) => {

                err ?
                    reject( 'Error loading users' )
                    :
                    resolve( users )
            });
    });
}


module.exports = router;
