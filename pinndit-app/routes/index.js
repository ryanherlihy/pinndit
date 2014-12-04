var express = require('express');
var db = require('../lib/db');
var router = express.Router();

// Records all the posts made to the server.
var comments = [];
var pinnData = [];

// Represents a post:
function Comment(text, eventk, eventB) {
  this.text = text;
  this.date = new Date();2
  this.eventk = eventk;
  this.eventB = eventB;
}

function Pinn(eventname, eventdesc, eventk, eventB, timePosted){
	this.eventname = eventname;
	this.eventdesc = eventdesc;
	this.eventk = eventk;
	this.eventB = eventB;
	this.timePosted = timePosted;
}
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Pinndit' });
});

function isTimePostedPast_Seconds(seconds){
  var currentTime = parseInt(new Date() / 1000,10);
  for(var i = pinnData.length - 1; i >= 0; i--){
    var p = pinnData[i];
    if((currentTime - seconds) > p.timePosted){
      pinnData.splice(i, 1);
	  }
  }
}

//Will work once up/down is implemented

// function timeRemaining(initialTimeSeconds, updownScoreTimeSeconds){
//   var currentTime = parseInt(new Date() / 1000,10);
//   for(var i = pinnData.length - 1; i>= 0; i--){
//     var p = pinnData[i];
//     var score = p.ups - p.downs;
//     if(score < -4){
//       pinnData.splice(i, 1);
//     }
//     else if((currentTime - initialTimeSeconds) > (p.timePosted + score*updownScoreTimeSeconds)){
//       pinnData.splice(i, 1);
//     }
//   }
// }
// timeRemaining(18000,1800) // 18000 = 5 hours, 1800 = 30 minutes

router.post('/postpinn', function (req, res) {
	var eventname = req.body.name;

    if(req.body.desc!==null){
        var descname = req.body.desc;
    }

	var k = req.body.k;
	var B = req.body.B;
	var timePosted = req.body.posted;
	console.log('recieved post: ' + '(Name: ' + eventname + ') ' + '(Desc: ' + descname + ') ' + '(k: ' + k + ') ' + '(B: ' + B + ')' + '(timePosted: ' + timePosted + ')');
	//pinnData.push(new Pinn(eventname, descname, k, B, timePosted));
    var pinn = {
        Latitude: k,
        Longitude: B,
        EventName: eventname,
        SessionID:  Math.floor(Math.random()*1000), //integer
        Time:  timestamp()//timestamp function to get current time is in pinndit.js
    };
    if(descname!==null){
        pinn.push(descname);
    }
    db.addPinn(pinn, function(error, result){
        if(error) return console.log(error);
        console.log("Event Name: " + result.EventName + " added, ID: " + result.PinnID );
    });
	res.json({ status: 'OK'});
});

router.post('/removepinn', function (req, res) {
  var k = req.body.k;
  var B = req.body.B;
  console.log('removed post: ' + '(k: ' + k + ') ' + '(B: ' + B + ')');
  for(var i = pinnData.length - 1; i >= 0; i--){
    var p = pinnData[i];
    if(p.k === k){
      pinnData.splice(i, 1);
      console.log('removed post: ' + pinnData[i]);
    }
  }
  res.json({ status: 'OK'});
});

router.post('/postcomment', function (req, res) {
  var text = req.body.text;
  var k = req.body.k;
  var B = req.body.B;
  console.log('received post: ' + text + '(k: ' + k + ') ' + '(B: ' + B + ')');
  comments.push(new Comment(text, k, B));
  res.json({ status: 'OK'});
});

router.post('/checkcomments', function (req, res) {
  var last = parseInt(req.body.last, 10);
  var rest = comments.slice(last, comments.length);
  res.json(rest);
});

router.post('/checkpinns', function (req, res) {
  isTimePostedPast_Seconds(600);
  console.log('Active Number of Pinns: ' + pinnData.length);
  var last = parseInt(req.body.last, 10);
  var rest = pinnData.slice(last, pinnData.length);
  res.json(rest);
});

module.exports = router;
function timeStamp() {
    var now = new Date();

// Create an array with the current month, day and time
    var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];

// Create an array with the current hour, minute and second
    var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];

// If seconds and minutes are less than 10, add a zero
    for ( var i = 1; i < 3; i++ ) {
        if ( time[i] < 10 ) {
            time[i] = "0" + time[i];
        }
    }
// Return the formatted string
    return date.join("/") + " " + time.join(":");

}