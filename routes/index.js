var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
	//For Angular code , uncomment below.
	// res.render('index-angular', {
	// 	title: 'User Cards'
	// });
	//to Run Normal code without Angular , uncomment below.
	res.render('index-normal', {
		title: 'User Cards'
	});
});
module.exports = router;