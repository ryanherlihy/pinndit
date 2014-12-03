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

function isTimePostedPastThirtySeconds(){
  var currentTime = parseInt(new Date() / 1000,10);
  for(var i = pinnData.length - 1; i >= 0; i--){
    var p = pinnData[i];
    if((currentTime - 30) > p.timePosted){  //return true because it's past 30 seconds since the post
      pinnData.splice(i, 1);
	}
  }
  return true;
}

router.post('/postpinn', function (req, res) {
	var eventname = req.body.name;
	var descname = req.body.desc;
	var k = req.body.k;
	var B = req.body.B;
	var timePosted = req.body.posted;
	console.log('recieved post: ' + '(Name: ' + eventname + ') ' + '(Desc: ' + descname + ') ' + '(k: ' + k + ') ' + '(B: ' + B + ')' + '(timePosted: ' + timePosted + ')');
	pinnData.push(new Pinn(eventname, descname, k, B, timePosted));
	isTimePostedPastThirtySeconds();
	console.log('Expired Pinns: ' + pinnData);
	res.json({ status: 'OK'});
});

router.post('/postcomment', function (req, res) {
  var text = req.body.text;
  var epoch  = new Date(1970, 1, 1);
  var start = new Date();
  var elapsed = start.getTime() - epoch.getTime();
  var secondsSinceEpoch = parseInt(elapsed / 1000,10); //Seconds since epoch
  var tenSecondsAfter = secondsSinceEpoch + 10

  console.log('received post: ' + text);
  comments.push(new Comment(text));
  res.json({ status: 'OK'});
});

router.post('/check', function (req, res) {
  var last = parseInt(req.body.last, 10);
  var rest = comments.slice(last, comments.length);
  res.json(rest);
});

module.exports = router;
