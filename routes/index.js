const express = require( 'express' );
const router = express.Router();

// ==========================================================
//    GET HOME PAGE
// ==========================================================
router.get( '/', ( req, res, next ) => {

  res.status( 200 ).json({
      ok: true,
      message: 'Request done right'
  });

});

module.exports = router;
