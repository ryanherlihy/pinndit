var overlay;
var map;
// made pinn icon and its div global Ariel
var pinnDiv = document.createElement('div');
var controlPinn;
//inactivePinn is undraggable pinn in top right corner when in the middle of creating new events Ariel
var inActivePinn;
var pinnformString = '<head> <link rel="stylesheet" href="/stylesheets/infoWindowStyle.css"/> </head>' +
    '<div id = "iw"><p id="pinntitle">New Pinn Information</p>' +
    '<input id = "event-name" type="text" name="event-name" placeholder="Event Name"> <br>' +
    '<input id="event-description" type="text" name="event-description" placeholder="Event Description"> <br>' +
    '<button name="create-event" id= "create-event" class="create-event">Create Event</button>' +
    '<br></div>';
var pinnInfoString = '<head> <link rel="stylesheet" href="/stylesheets/infoWindowStyle.css"/> </head>' +
    '<div id="iw-event"><p id="pinntitle">Pinn Information</p>' +
    '<input id="event-name" type="text" name="event-name" readonly> <br>' +
    '<input id="event-description" type="text" name="event-description" readonly> <br>' +
    '</div> <br>'+
    '<div> <div id="comment"> <div id="ctext"> <input id= "submit" type="text" size="15" placeholder="Comments"> </div>' +
    '<div id="cbutton"> <button name="send" id= "send" class="send">Submit</button> </div> </div>'  +
    '<div id="clist"> <ul style="list-style: none" id="chat">' +
    '</ul> </div> </div>';
var openPin = 'undefined';

//never used?
//var PinndItPin = {
//    url: '/images/PinndItPin.png',
//    size: new google.maps.Size(100, 100),
//    origin: new google.maps.Point(0,0),
//    anchor: new google.maps.Point(0, 32)
//};

function PinnClient(config){
    for (var prop in config) {
        if(config.hasOwnProperty(prop)){
            this[prop] = config[prop];
        }
    }
}

PinnClient.prototype = {
    pinnData : [],

    // Post text to the server.
    post : function (name, desc, k, B, posted) {
        $.ajax({
            type : 'POST',
            url  : '/postpinn',
            data : { 'name' : name, 'desc' : desc, 'k' : k, 'B' : B, 'posted' : parseInt(new Date() / 1000,10)},
            dataType : 'json'
        }).done(function (data) {
            console.log('Post status: ' + data.status);
        });
    },

    remove : function (k, B) {
        $.ajax({
            type : 'POST',
            url  : '/removepinn',
            data : { 'k' : k, 'B' : B},
            dataType : 'json'
        }).done(function (data) {
            console.log('Post status: ' + data.status);
            that.pinnData = that.pinnData.concat(data);
        });
    },


    // Check for more messages on the server
    // given the last index we have for the
    // current posts.
    check : function (type, pinn) {
        var that = this;
        $.ajax({
            type : 'POST',
            url  : '/checkpinns',
            data : { last : that.pinnData.length },
            dataType : 'json'
        }).done(function (data) {
            console.log('Check rcvd pinns: ' + JSON.stringify(data));

            // Append the posts to the current posts:
            that.pinnData = that.pinnData.concat(data);

            if(type === 'done'){
                for(var i =0; i<that.pinnData.length;i++){
                    if(pinn.position.lat() == that.pinnData[i].eventk && pinn.position.lng() == that.pinnData[i].eventB){
                        that.view.val(that.pinnData[i].eventname);
                        that.view2.val(that.pinnData[i].eventdesc);
                    }
                }
            }
            if(type === 'refresh'){
                for(var i =0; i<that.pinnData.length;i++){
                    var LatLng = new google.maps.LatLng(that.pinnData[i].eventk, that.pinnData[i].eventB);
                    addOldPinn(LatLng);
                }
            }
        });
    }
};

function CommentClient(config) {
    for (var prop in config) {
        if(config.hasOwnProperty(prop)){
            this[prop] = config[prop];
        }
    }
}

function addOldPinn(location){
    console.log(location.toString());

    var pinnImage = '/images/PinndItPin50x50.png';

    var pinn = new google.maps.Marker({
        position: location,
        map: map,
        icon: pinnImage,
        created: 1 //NEW ATTRIBUTE should be 1 AFTER it's created
    });

    var donepinnwindow = new InfoBox({
        content: pinnInfoString,
        pixelOffset: new google.maps.Size(-380, -150),
        closeBoxMargin: "10px 155px 0px 0px",
        maxWidth: 500
    });

    google.maps.event.addListener(pinn, 'click', function() {
        if(this.created === 1) {
            donepinnwindow.open(map, pinn);
            if(openPin !== 'undefined' && openPin !== this){
                google.maps.event.trigger(openPin, 'rightclick');
            }
            openPin = pinn;
        }
    });

    google.maps.event.addListener(pinn, 'rightclick', function(){
        donepinnwindow.close();
    });

    google.maps.event.addListener(donepinnwindow, 'domready', function() {
        //pinnc.poll();
        var commentc = new CommentClient({ view : $('ul#chat') });

        commentc.check(pinn);
        var createComment = new PostButton({
            view   : $('#send'),
            input  : $('#submit')
        });
        var eventName = $('#event-name');              //repeated lookups are slow
        var eventDescription = $('#event-description');

        var pinnc = new PinnClient({
            view  : eventName,
            view2 : eventDescription

        });
        pinnc.check('done', pinn);
        // Bind a click event:
        createComment.bind('click', function (event) {
            console.log(this);
            var text = this.input.val();
            commentc.post(text, location.lat(), location.lng());
            $('#chat').append('<li>' + text + '</li>');
            // clear input text:
            this.input.val('');
            return false;
        });
    });

    google.maps.event.addListener(donepinnwindow, 'closeclick', function(){
        donepinnwindow.close();
        openPin = 'undefined';
    });
}

CommentClient.prototype = {
    // An cache of posts received from server.
    comments : [],

    // Post text to the server.
    post : function (text, k, B) {
        $.ajax({
            type : 'POST',
            url  : '/postcomment',
            data : { 'text' : text, 'k' : k, 'B' : B},
            dataType : 'json'
        }).done(function (data) {
            console.log('Post status: ' + data.status);
        });
    },

    // Check for more messages on the server
    // given the last index we have for the
    // current posts.
    check : function (pinn) {
        var that = this;
        $.ajax({
            type : 'POST',
            url  : '/checkcomments',
            data : { last : that.comments.length },
            dataType : 'json'
        }).done(function (data) {
            console.log('Check rcvd comments: ' + JSON.stringify(data));

            // Append the posts to the current posts:
            that.comments = that.comments.concat(data);

            // Rewrite to the view:
            that.view.empty();
            for (var i = 0; i < that.comments.length; i++) {
                if(pinn.position.lat() == that.comments[i].eventk && pinn.position.lng() == that.comments[i].eventB){
                    var li   = $('<li>');   //had to have lookup in loop to create new <li>
                    li.html(that.comments[i].text);
                    that.view.append(li);
                }
            }
        });
    }
};

function PostButton(config) {
    for (var prop in config) {
        if(config.hasOwnProperty(prop)){
            this[prop] = config[prop];
        }
    }
}

PostButton.prototype = {
    bind : function (type, cb) {
        var that = this;
        this.view.bind(type, function (event) {
            cb.call(that, event);
        });
    }
};


function addNewPinn(location) {

    console.log(location.toString());

    var pinnImage = '/images/PinndItPin50x50.png';

    var pinn = new google.maps.Marker({
        position: location,
        map: map,
        icon: pinnImage,
        created: 0 //NEW ATTRIBUTE should be 1 AFTER it's created
    });

    map.panTo(location);
    map.setZoom(15);


    var infowindow = new InfoBox({
        content: pinnformString,
        pixelOffset: new google.maps.Size(-380, -150),
        closeBoxMargin: "10px 155px 0px 0px",
        maxWidth: 500
    });

    var donepinnwindow = new InfoBox({
        content: pinnInfoString,
        pixelOffset: new google.maps.Size(-380, -185),
        closeBoxMargin: "10px 155px 0px 0px",
        maxWidth: 500
    });

    // var infowindow = new google.maps.InfoWindow({
    //     content: pinnformString,

    //     maxWidth: 500
    // });

    // var donepinnwindow = new google.maps.InfoWindow({
    //     content: pinnInfoString,

    //     maxWidth: 500

    // });



    infowindow.open(map, pinn);

    google.maps.event.addListener(infowindow, 'domready', function() {

        //creatingpinn toggles the visibility of the controlpinn and the inactive pinn Ariel Reches
        $(controlPinn).trigger("creatingpinn");
        $(inActivePinn).trigger("creatingpinn");

        var eventName = $('#event-name');              //repeated lookups are slow
        var eventDescription = $('#event-description');
        var pinnc = new PinnClient({
            view  : eventName,
            view2 : eventDescription

        });
        var createEvent = new PostButton({
            view    : $('#create-event'),
            input   : eventName,
            input2  : eventDescription
        });

        createEvent.bind('click', function (event) {
            console.log(this);
            var text = this.input.val();
            //$('#event-name').prop('readonly', true);
            var text2 = this.input2.val();
            //$('#event-description').prop('readonly', true);
            //$('#create-event').remove();
            pinnc.post(text, text2, location.lat(), location.lng());
            infowindow.close();
            pinn.created = 1;
            return false;
        });
    });

    google.maps.event.addListener(pinn, 'click', function() {
        if(this.created === 1) {
            donepinnwindow.open(map, pinn);
            map.panTo(location);
            map.setZoom(15);
            if(openPin !== 'undefined' && openPin !== this){
                google.maps.event.trigger(openPin, 'rightclick'); 
            }
           openPin = pinn;
        }
    });

    google.maps.event.addListener(pinn, 'rightclick', function(){
        donepinnwindow.close();
    });

    google.maps.event.addListener(pinn, 'dblclick', function(){
        if(this.created === 1){
            this.setMap(null);
            openPin = 'undefined';
            $(controlPinn).trigger("creatingpinn");
            $(inActivePinn).trigger("creatingpinn");
        }

    });

    google.maps.event.addListener(donepinnwindow, 'domready', function() {
        //pinnc.poll();
        var commentc = new CommentClient({ view : $('ul#chat') });

        commentc.check(pinn);
        var createComment = new PostButton({
            view   : $('#send'),
            input  : $('#submit')
        });
        var eventName = $('#event-name');              //repeated lookups are slow
        var eventDescription = $('#event-description');

        var pinnc = new PinnClient({
            view  : eventName,
            view2 : eventDescription

        });
        pinnc.check('done', pinn);
        // Bind a click event:
        createComment.bind('click', function (event) {
            console.log(this);
            var text = this.input.val();
            commentc.post(text, location.lat(), location.lng());
            $('#chat').append('<li>' + text + '</li>');
            // clear input text:
            this.input.val('');
            return false;
        });
    });

    google.maps.event.addListener(donepinnwindow, 'closeclick', function(){
        donepinnwindow.close();
        openPin = 'undefined';
    });

    google.maps.event.addListener(infowindow, 'closeclick', function() {
        //creatingpinn toggles the visibility of the controlpinn and the inactive pinn
        $(controlPinn).trigger("creatingpinn");
        $(inActivePinn).trigger("creatingpinn");
        pinn.setMap(null);
    });
}

// INACTIVE PINN IN TOP RIGHT CORNER WHEN CREATING NEW EVENT  Ariel Recges
function AddInactivePinn(controlDiv, map){
    inActivePinn = document.createElement('div');
    controlDiv.style.padding = '15px';

    inActivePinn.innerHTML = "<img src='/images/PinndItPin.png' width='50' height='50'  style='opacity: .4' >";
    inActivePinn.style.display = 'none';
    controlDiv.appendChild(inActivePinn);
    $(inActivePinn).on("creatingpinn", function(){
        $(this).toggle();
    });



}

function AddControlPinn(controlDiv, map) {

    controlDiv.style.padding = '15px';


    controlPinn = document.createElement('div');

    controlPinn.style.cursor = 'pointer';
    controlPinn.innerHTML = "<img src='/images/PinndItPin.png' width='50' height='50'>";
    controlDiv.appendChild(controlPinn);
    var contPinn = $(controlPinn);      //repeated lookups are slow
    contPinn.draggable({helper: 'clone',
        stop: function(e, ui) {
            var mOffset = $(map.getDiv()).offset();
            var point = new google.maps.Point(
                    ui.offset.left-mOffset.left+(ui.helper.width()/2),
                    ui.offset.top-mOffset.top+(ui.helper.height())
            );
            var ll = overlay.getProjection().fromContainerPixelToLatLng(point);
            addNewPinn(ll);
        }
    });

    contPinn.on("creatingpinn", function(){
        $(this).toggle();

    });
}

function success(position) {

    var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var options = {
        zoom: 15,
        center: coords,
        mapTypeControl: false,
        navigationControlOptions: {
            style: google.maps.NavigationControlStyle.SMALL
        },
        streetViewControl: false,
        panControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map-canvas"), options);
    overlay = new google.maps.OverlayView();
    overlay.draw = function(){};
    overlay.onAdd = function(){};
    overlay.setMap(map);



    //unused?

    AddControlPinn(pinnDiv, map);
    AddInactivePinn(pinnDiv, map);

    var pinnc = new PinnClient({});
    pinnc.check('refresh', null);


    //addNewPinn(coords);

    pinnDiv.index = 1;

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(pinnDiv);

    /* var marker = new google.maps.Marker({
     position: coords,
     map: map,
     //icon : PinndItPin,
     draggable: true,
     animation: google.maps.Animation.DROP,
     title:"tittie sprinkles!" //<--agreed
     });
     */
    /*
     var infowindow = new google.maps.InfoWindow({
     content: '<div id="content"><p>Computer Science BBQ</p></div>',
     maxWidth: 500
     });
     google.maps.event.addListener(marker, 'click', function() {
     infowindow.open(map,marker);
     });
     */
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success);
} else {
    error('Geo Location is not supported');

}

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