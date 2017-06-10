var express = require('express');
var router = express.Router();

/* GET users searching. */
router.get('/', function(req, res, next) {
	//res.send('respond with a resource');
//});

//router.post('/', function(req, res, next) {
	var userFrom = req.body['txtFrom'];
	var userEnd = req.body['txtEnd'];
	var db = req.con;
	var data = "";
    console.log(userFrom);
    //db.query('SELECT * FROM Route WHERE (LOC_START_NAMEC like "%'+ userFrom +'%" or LOC_START_NAMEE like "%'+ userFrom +'%") and (LOC_END_NAMEC like "%'+ userEnd +'%" or LOC_END_NAMEE like "%'+ userEnd +'%")' , function(err, rows) {
    db.query('SELECT * FROM Route WHERE (LOC_START_NAMEC like "%%" or LOC_START_NAMEE like "%%") and (LOC_END_NAMEC like "%%" or LOC_END_NAMEE like "%%")' , function(err, rows) {

        if (err) {
            console.log(err);
        }
        var data = rows;

        // use search.ejs
        res.render('search', { title: 'Route Information', data: data});
    });
});
module.exports = router;
