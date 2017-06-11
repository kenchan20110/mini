var express = require('express');
var router = express.Router();

// home page
/*router.get('/', function(req, res, next) {

    var db = req.con;
    var data = "";

    db.query('SELECT * FROM Route,RStop WHERE ROUTE_ID = Route_ROUTE_ID', function(err, rows) {
        if (err) {
            console.log(err);
        }
        var data = rows;

        // use index.ejs
        res.render('index', { title: 'Let\'s Mini', data: data});
    });

});

router.get('/', function(req, res) {
    res.render('search', {title:'Route Information'});
});*/

router.get('/', function(req, res) {
    res.render('index', {title:'Let\'s Mini'});
});


router.post('/', function(req, res) {
    var userFrom = req.body['txtFrom'],
        userEnd = req.body['txtEnd'];

        var db = req.con;
        var data = "";
        var cmd = "SELECT * FROM Route WHERE LOC_START_NAMEC like '%" + userFrom + "%'";
        
        db.query(cmd, function (err, rows) {
            if (err) {
                console.log(err);
            }
            var data = rows;
            res.render('search', { title: 'Route Information', data: data});
        });   
});
module.exports = router;