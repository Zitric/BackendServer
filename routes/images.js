const express = require( 'express' );
const router = express.Router();
const path = require( 'path' );
const fs = require( 'fs' );

// ==========================================================
//    GET IMAGE PAGE
// ==========================================================
router.get( '/:table/:img', (req, res, next ) => {

    const table = req.params.table;
    const img = req.params.img;

    const imagePath = path.resolve( __dirname, `../uploads/${ table }/${ img }`);
    const noImagePath = path.resolve( __dirname, '../assets/no-image.jpg');

    fs.existsSync( imagePath ) ?
        res.sendFile( imagePath )
        :
        res.sendFile( noImagePath );

});

module.exports = router;
