var express = require('express');
var db = require('../lib/db');
var router = express.Router();

// Records all the posts made to the server.
var comments = [];
var pinnData = [];

// Represents a post:
function Comment(text, eventk, eventB) {
    this.text = text;
    this.date = new Date();
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

 // var getttt = getPinnID(p.k, p.B);
        // db.markInactive(getttt, function(error, result){
        //     if(error) return console.log(error);
        //     console.log("Event Name: " + result.EventName + " added");
        // });

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
    var descname = null;

    if(req.body.desc!==null){
        descname = req.body.desc;
    }

    var k = req.body.k;
    var B = req.body.B;
    var timePosted = req.body.posted;
    var timeSt = timeStamp(timePosted);

    console.log('recieved post: ' + '(Name: ' + eventname + ') ' + '(Desc: ' + descname + ') ' + '(k: ' + k + ') ' + '(B: ' + B + ')' + '(timePosted: ' + timePosted + ')');

    var pinn = {PinnId: 1, Latitude: k, Longitude: B, EventName: eventname, SessionID: 15,
        Time: timeSt //timestamp function to get current time is in pinndit.js
    };

    if(descname!==null){
        pinn.Description = descname;
    }
    db.addPinn(pinn, function(error, result){
        if(error) return console.log(error);
        console.log("Event Name: " + result.EventName + " added");
    });

    pinnData.push(new Pinn(eventname, descname, k, B, timePosted));
    res.json({ status: 'OK'});
});

router.post('/removepinn', function (req, res) {
  var k = req.body.k;
  var B = req.body.B;
  console.log('posts: ' + pinnData.length);
  console.log('comments: ' + comments.length);
  for(var i = pinnData.length - 1; i >= 0; i--){
    if(pinnData[i].eventk === k){
      console.log('removed post: ' + '(k: ' + k + ') ' + '(B: ' + B + ')');
      for(var j = comments.length - 1; j >= 0; j--){
        if(pinnData[i].eventk === comments[j].eventk){
          console.log('removed comment: ' + '(k: ' + k + ') ' + '(B: ' + B + ')');
          comments.splice(j, 1);
        }
      } 
      pinnData.splice(i, 1); 
    }
  }
  console.log('posts: ' + pinnData.length);
  console.log('comments: ' + comments.length);
  res.json({ status: 'OK'});
});

router.post('/postcomment', function (req, res) {
    var text = req.body.text;
    var k = req.body.k;
    var B = req.body.B;
   // var id = getPinnID(k, B);
    var timePosted = req.body.posted;
/*
    var timeSt = timeStamp(timePosted);
    var comment = {PinnID: id, Comment: text, SessionID: 15, Time: timeSt };
    db.addComment(comment, function(error, result){
        if(error) return console.log(error);
        console.log("Comment: " + result.Comment + " added");
    });
*/
    console.log('received post: ' + text + '(k: ' + k + ') ' + '(B: ' + B + ')');
    comments.push(new Comment(text, k, B));
    res.json({ status: 'OK'});
});

    router.post('/checkcomments', function (req, res) {
    var last = parseInt(req.body.last, 10);
    var rest = comments.slice(last, comments.length);
    res.json(rest);
});
/*
router.post('/checkcomments', function (req, res) {
    var k = req.body.k;
    var B = req.body.B;
    var id = getPinnID(k, B);
    db.getComments(id, function(error, result){
        if(error) return console.log(error);
        console.log("Comments found for PinnID: " + id);
        var retJson = JSON.stringify(result);
        res.json(retJson);
    });
});
*/

router.post('/checkpinns', function (req, res) {
    console.log('Active Number of Pinns: ' + pinnData.length);
    var last = parseInt(req.body.last, 10);
    var rest = pinnData.slice(last, pinnData.length);
    res.json(rest);
});

module.exports = router;
function timeStamp(seconds) {
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(seconds);

// Create an array with the current month, day and time
    var date = [ d.getMonth() + 1, d.getDate(), d.getFullYear() ];

// Create an array with the current hour, minute and second
    var time = [ d.getHours(), d.getMinutes(), d.getSeconds() ];

// If seconds and minutes are less than 10, add a zero
    for ( var i = 1; i < 3; i++ ) {
        if ( time[i] < 10 ) {
            time[i] = "0" + time[i];
        }
    }
// Return the formatted string
    return date.join("/") + " " + time.join(":");
}
/*
function getPinnID(k, B){
    var pinn = {
        Latitude: k,
        Longitude: B
    };
    db.getID(pinn, function(error, result){
        if(error) return console.log(error);
        console.log("Event Name: " + result.EventName + " added");
        return result.PinnID;
    });
}
*/