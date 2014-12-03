var pg = require('pg');
var conString = 'postgres://'+process.env.USER+':pass@localhost/pinndit';

function addPinn(pinn, callback){
	var err = null;
	if(pinn.pinnID === null){ err = "null pinnID"}
	else if(pinn.Lattitude === null){err = "null latt"}
	else if(pinn.Longitude === null){err = "null long"}
	else if(pinn.Lattitude === null){err = "null latt"}
	else if(pinn.EventName === null || if pinn.EventName.length > 25){err = "Need Event Name Length more than 0, less than 25"}
	else if(pinn.SessionID === null){err = "null sessionID"}
	else if(pinn.Time === null){err = "null time"}
	
	if(err){callback(error); return;}
	
	var pinnArr = [pinn.pinnID, pinn.Lattitude, pinn.Longitude, pinn.EventName, pinn.SessionID, pinn.Time]
}

function getComments(pinnID, callback){
	var query = "";
	
}

function getMyPinns(sessionID, callback){
	var query = "";
	
}

function getNearbyPinns(lattitude, longitude, zoom, callback){
	var query = "";
	
}
