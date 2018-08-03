var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {

  res.render('index', { title: 'Express' });

  res.status(200).json({
      ok: true,
      message: 'Request done right'
  });

});

module.exports = router;
