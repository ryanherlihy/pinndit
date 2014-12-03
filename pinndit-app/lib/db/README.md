dbFunc Usage Notes:

var db = require('../lib/db');

var Pinn = {
            Latitude: 101.21204,
            Longitude: 34.2234,
			EventName: 'Party!',
			Description: 'BYOB',  // description not required
			SessionID:  125098, //integer
			Time: '2014-12-03 04:05:06' //timestamp function to get current time is in pinndit.js
            }

db.addPinn(Pinn, function(error, result){
    if(error) return console.log(error);
    console.log("Event Name: " + result.EventName + " added, ID: " + result.PinnID );
});

see the js file for other functions including:

getVisiblePinns(minLat, maxLat, minLong, maxLong, callback)
addPinn (pinn, callback) //takes object
getMyPinns (sessionID, callback)
getComments (pinnID, callback)
addComment (comment, callback) // takes object
upvotePinn (pinnID, callback)
downvotePinn (pinnID, callback)
upvoteComment (commentID, callback)
downvoteComment (commentID, callback)
editPinn (pinn, callback) // takes object (edits event name or desc)