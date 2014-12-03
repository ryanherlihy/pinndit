var pg = require('pg');
var conString = 'postgres://'+process.env.USER+':pass@localhost/pinndit';

function addPinn(pinn, callback){
	var err = null;
	if(pinn.pinnID === null){ err = "null pinnID"}
	else if(pinn.Lattitude === null){err = "null latt"}
	else if(pinn.Longitude === null){err = "null long"}
	else if(pinn.Lattitude === null){err = "null latt"}
	else if(pinn.EventName === null || pinn.EventName.length > 25){err = "Need Event Name Length more than 0, less than 25"}
	else if(pinn.SessionID === null){err = "null sessionID"}
	else if(pinn.Time === null){err = "null time"}
	
	if(err){callback(error); return;}
	
	var pinnArr = [pinn.pinnID, pinn.Lattitude, pinn.Longitude, pinn.EventName, pinn.SessionID, pinn.Time];
	
	var query = "INSERT into Pinns values ($1, 1, $2, $3, $4, ";
	if(pinn.Description){query+= "$7, $5, 0, 0, $6);"; pinnArr.push(pinn.Description);}
	else{query+="NULL, $5, 0, 0, $6);";}
	
	console.log(query);
	pg.connect(conString,function(err, client, done){
		if(err){
			console.log(err);
			callback(err, error);
			return console.error('err',err);
		}
		client.query(query, pinnArr, function(err, results){
			done();
			if(err){
				callback(error);
				return;
			}
		});
	});
	pg.end();
}

function addComment(comment, callback){
	var err = null;
	if(comment.pinnID === null){ err = "null pinnID"}
	else if(comment.Comment === null || comment.Comment.length > 25){err = "Comment length needs to be more than 0 and less than 25"}
	else if(comment.SessionID === null){err = "null sessionID"}
	else if(comment.Time === null){err = "null time"}
	
	if(err){callback(error); return;}
	
	var comArr = [comment.pinnID, comment.Comment, comment.SessionID, comment.Time];
	var query = "INSERT into Comments values ($1, $2, 0, 0, $3, $4);";
	console.log(query);
	
	pg.connect(conString,function(err, client, done){
		if(err){
			console.log(err);
			callback(err, error);
			return console.error('err',err);
		}
		client.query(query, comArr, function(err, results){
			done();
			if(err){
				callback(error);
				return;
			}
		});
	});
	pg.end();
}

function getComments(pinnID, callback){
	var comArr = [pinnID];
	var query = "SELECT * FROM Comments C WHERE C.PinnID = $1;";
	pg.connect(conString, function(err, client, done){
		if(err) {console.log(err); return;}
		client.query(query, comArr, function(err, results){
			done();
			console.log(results);
			callback(err, results.rows);
		});
	});
	pg.end();
}

function getMyPinns(sessionID, callback){
	var pinnArr = [sessionID];
	var query = "SELECT * FROM Pinns P WHERE P.SessionID = $1 AND P.Active=1;";
	pg.connect(conString, function(err, client, done){
		if(err) {console.log(err); return;}
		client.query(query, pinnArr, function(err, results){
			done();
			console.log(results);
			callback(err, results.rows);
		});
	});
	pg.end();
}

function getVisiblePinns(minLat, maxLat, minLong, maxLong, callback){
	var pinnArr = [minLat, maxLat, minLong, maxLong]
	var query = "SELECT * FROM Pinns P WHERE P.Latitude > $1 AND P.Latitude < $2 AND P.Longitude > $3 AND P.Longitude < $4 AND P.Active = 1";
	pg.connect(conString, function(err, client, done){
		if(err) {console.log(err); return;}
		client.query(query, pinnArr, function(err, results){
			done();
			console.log(results);
			callback(err, results.rows);
		});
	});
	pg.end();
}

exports.getVisiblePinns = getVisiblePinns;
exports.addPinn = addPinn;
exports.getMyPinns = getMyPinns;
exports.getComments = getComments;
exports.addComment = addComment;
exports.addPinn = addPinn;