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

db.login(Pinn, function(error, result){
    if(error) return console.log(error);
    console.log("Event Name: " + result.EventName + " added, ID: " + result.PinnID );
});