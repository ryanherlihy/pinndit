var express = require('express');
var router = express.Router();

// Records all the posts made to the server.
var posts = [];

// Represents a post:
function Post(text) {
  this.text = text;
  this.date = new Date();
}
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Pinndit' });
});

router.post('/post', function (req, res) {
  var text = req.body.text;
  console.log('received post: ' + text);
  posts.push(new Post(text));
  res.json({ status: 'OK'});
});

router.post('/check', function (req, res) {
  var last = parseInt(req.body.last, 10);
  var rest = posts.slice(last, posts.length);
  res.json(rest);
});

module.exports = router;
