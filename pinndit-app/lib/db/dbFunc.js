/*
 Functions to access the database (see team-pinndit/database/setup to setup your db)
 */

var pg = require('pg');
var conString = 'postgres://postgres:pass@localhost/pinndit';

function addPinn(pinn, callback){
    var err = null;
    if(pinn.Latitude === null){err = "null latt"}
    else if(pinn.Longitude === null){err = "null long"}
    else if(pinn.Latitude === null){err = "null latt"}
    else if(pinn.EventName === null || pinn.EventName.length > 25){err =
        "Need EventName length more than 0, less than 25"}
    else if(pinn.SessionID === null){err = "null sessionID"}
    else if(pinn.Time === null){err = "null time"}
    else if(pinn.Description !== null && pinn.Description.length > 25){err = "Description too long"}

    if(err){callback(err); return;}

    var pinnArr = [pinn.Latitude, pinn.Longitude, pinn.EventName, pinn.SessionID, pinn.Time];

    var query = 'INSERT into "Pinns" values (DEFAULT , 1, $1, $2, $3, ';
    if(pinn.Description){query+= '$6, $4, 0, 0, $5);'; pinnArr.push(pinn.Description);}
    else{query+='NULL, $4, 0, 0, $5);';}

    pg.connect(conString,function(err, client, done){
        if(err){
            console.log(err);
            callback(err, error);
            return console.error('err',err);
        }
        client.query(query, pinnArr, function(err, results){
            done();
            if(err){
                callback(err);
                return;
            }
            pinn.PinnID = results.rows[0];
            callback(err, pinn);
        });
    });
    pg.end();
}

function addComment(comment, callback){
    var err = null;
    if(comment.PinnID === null){ err = "null PinnID"}
    else if(comment.Comment === null || comment.Comment.length > 25){err = "Comment length needs to be more than 0 and less than 25"}
    else if(comment.SessionID === null){err = "null sessionID"}
    else if(comment.Time === null){err = "null time"}

    if(err){callback(error); return;}

    var comArr = [comment.PinnID, comment.Comment, comment.SessionID, comment.Time];
    var query = "INSERT into Comments values (DEFAULT, $1, $2, 0, 0, $3, $4);";
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
            callback(err, results);
        });
    });
    pg.end();
}

function getComments(PinnID, callback){
    var comArr = [PinnID];
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

//given sessionId returns pinns dropped
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

//given area returns list of pinns
function getVisiblePinns(minLat, maxLat, minLong, maxLong, callback){
    var pinnArr = [minLat, maxLat, minLong, maxLong];
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

function upvotePinn(PinnID, callback){
    var pinnArr = [PinnID];
    var query = "UPDATE Pinns P SET Up = Up + 1 WHERE P.PinnID = $1 AND P.Active=1;";
    pg.connect(conString, function(err, client, done){
        if(err) {console.log(err); return;}
        client.query(query, pinnArr, function(err, results){
            done();
            console.log(results);
            callback(err, results.rows[0]);
        });
    });
    pg.end();
}

function downvotePinn(PinnID, callback){
    var pinnArr = [PinnID];
    var query = "UPDATE Pinns P SET Down = Down + 1 WHERE P.PinnID = $1 AND P.Active=1;";
    pg.connect(conString, function(err, client, done){
        if(err) {console.log(err); return;}
        client.query(query, pinnArr, function(err, results){
            done();
            console.log(results);
            callback(err, results.rows[0]);
        });
    });
    pg.end();
}

function upvoteComment(commentID, callback){
    var commArr = [commentID];
    var query = "UPDATE Comments C SET Up = Up + 1 WHERE CommentID = $1";
    pg.connect(conString, function(err, client, done){
        if(err) {console.log(err); return;}
        client.query(query, commArr, function(err, results){
            done();
            console.log(results);
            callback(err, results.rows[0]);
        });
    });
    pg.end();
}

function downvoteComment(commentID, callback){
    var commArr = [commentID];
    var query = "UPDATE Comments C SET Down = Down + 1 WHERE C.CommentID = $1";
    pg.connect(conString, function(err, client, done){
        if(err) {console.log(err); return;}
        client.query(query, commArr, function(err, results){
            done();
            console.log(results);
            callback(err, results.rows[0]);
        });
    });
    pg.end();
}

//use to edit event names and/or descriptions
function editPinn(pinn, callback){
    var err = null;
    if(pinn.PinnID === null){err = "null PinnID"}
    else if(pinn.SessionID === null){err = "null sessionID"}
    else if(pinn.Description === null && pinn.EventName === null){err = "Need new event name or desc"}

    if(err){callback(err); return;}

    var pinnArr = [pinn.PinnID, pinn.SessionID];
    var query = "UPDATE Pinns P SET ";
    if (pinn.EventName !== null && pinn.Description !== null){
        query+= "P.EventName = $3, P.Description = $4 ";
        pinnArr.push(pinn.EventName);
        pinnArr.push(pinn.Description);
    }else if(pinn.EventName !== null){
        query+= "P.EventName = $3 ";
        pinnArr.push(pinn.EventName);
    }else if(pinn.Description !== null){
        query+= "P.Description = $3 ";
        pinnArr.push(pinn.Description);
    }
    query += "WHERE P.PinnID = $1 AND P.SessionID = $2 AND P.Active=1;";
    pg.connect(conString, function(err, client, done){
        if(err) {console.log(err); return;}
        client.query(query, pinnArr, function(err, results){
            done();
            console.log(results);
            callback(err, results.rows[0]);
        });
    });
    pg.end();
}

function markInactive(PinnID, callback){
    var pinnArr = [PinnID];
    var query = "UPDATE Pinns P SET Active = 0 WHERE P.PinnID = $1;";
    pg.connect(conString, function(err, client, done){
        if(err) {console.log(err); return;}
        client.query(query, pinnArr, function(err, results){
            done();
            console.log(results);
            callback(err, results.rows[0]);
        });
    });
    pg.end();
}

function getID(pinn, callback){ //not functioning (long and lat too precise)
    var err = null;
    if(pinn.Latitude === null){err = "null latt"}
    else if(pinn.Longitude === null){err = "null long"}

    if(err){callback(err); return;}

    var pinnArr = [pinn.Latitude, pinn.Longitude];
    var query = "Select PinnID FROM  Pinns P WHERE P.Longitude = $1 AND P.Latitude = $2 LIMIT 1;";
    pg.connect(conString, function(err, client, done){
        if(err) {console.log(err); return;}
        client.query(query, pinnArr, function(err, results){
            done();
            console.log("got ID: " + results);
            callback(err, results.rows[0]);
        });
    });
    pg.end();
}

exports.getID = getID;
exports.markInactive = markInactive;
exports.getVisiblePinns = getVisiblePinns;
exports.addPinn = addPinn;
exports.getMyPinns = getMyPinns;
exports.getComments = getComments;
exports.addComment = addComment;
exports.addPinn = addPinn;
exports.upvotePinn = upvotePinn;
exports.downvotePinn = downvotePinn;
exports.upvoteComment = upvoteComment;
exports.downvoteComment = downvoteComment;
exports.editPinn = editPinn;