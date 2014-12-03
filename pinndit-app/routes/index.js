var express = require('express');
var router = express.Router();

// Records all the posts made to the server.
var comments = [];
var pinnData = [];

// Represents a post:
function Comment(text) {
  this.text = text;
  this.date = new Date();
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

function remove(arr, item) {
  for(var i = arr.length; i--;) {
          if(arr[i] === item) {
              arr.splice(i, 1);
          }
      }
  }

function isTimePostedPast_Seconds(seconds){
  var currentTime = parseInt(new Date() / 1000,10);
  for(var i = pinnData.length - 1; i >= 0; i--){
    var p = pinnData[i];
    if((currentTime - seconds) > p.timePosted){
      pinnData.splice(i, 1);
	}
  }
}

router.post('/postpinn', function (req, res) {
	var eventname = req.body.name;
	var descname = req.body.desc;
	var k = req.body.k;
	var B = req.body.B;
	var timePosted = req.body.posted;
	console.log('recieved post: ' + '(Name: ' + eventname + ') ' + '(Desc: ' + descname + ') ' + '(k: ' + k + ') ' + '(B: ' + B + ')' + '(timePosted: ' + timePosted + ')');
	pinnData.push(new Pinn(eventname, descname, k, B, timePosted));
	isTimePostedPast_Seconds(30);
	console.log('Active Number of Pinns: ' + pinnData.length);
	res.json({ status: 'OK'});
});

router.post('/postcomment', function (req, res) {
  var text = req.body.text;
  console.log('received post: ' + text);
  comments.push(new Comment(text));
  res.json({ status: 'OK'});
});

router.post('/checkcomments', function (req, res) {
  var last = parseInt(req.body.last, 10);
  var rest = comments.slice(last, comments.length);
  res.json(rest);
});

router.post('/checkpinns', function (req, res) {
  console.log("ENTERED CHECKPINNS\n");
  var last = parseInt(req.body.last, 10);
  var rest = pinnData.slice(last, pinnData.length);
  res.json(rest);
});

module.exports = router;
