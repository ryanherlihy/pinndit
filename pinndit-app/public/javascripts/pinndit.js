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

var pinnInfoString = '<head> <link rel="stylesheet" href=/stylesheets/infoWindowStyle.css /> </head>' +
    '<body>'+
    '<div id="iw-event">'+
    '<p id="pinntitle">Pinn Information</p>' +
    '<div id="vote">'+
    '<iframe src="/updown.html" frameborder="0" width=75 height=85 scrolling=no></iframe>' +
    '</div>'+
    '<div id="input-boxes">' +
    '<input id="event-name" type="text" name="event-name" readonly> <br>' +
    '<input id="event-description" type="text" name="event-description" readonly> <br>' +
    '</div>' +
    '</div>'+
    '<div id="comment">' +
    '<div id="ctext">' +
    '<input id= "submit" type="text" size="15" placeholder="Comments"> </div>' +
    '<div id="cbutton">' +
    '<button name="send" id= "send" class="send">Submit</button> </div>' +
    '</div>' +
    '<div id="clist">' +
    '<ul style="list-style: none" id="chat">' +
    '</ul> </div> </body>';

var openPin = 'undefined';

var newPinnOpen = false;

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

    removePinn : function (k, B) {
        $.ajax({
            type : 'POST',
            url  : '/removepinn',
            data : { 'k' : k, 'B' : B},
            dataType : 'json'
        }).done(function (data) {
            console.log('Post status: ' + data.status);
            //that.pinnData = that.pinnData.concat(data);
        });
    },


    // Check for more messages on the server
    // given the last index we have for the
    // current posts.
    check : function (type, pinn, pinnk) {
        var that = this;
        $.ajax({
            type : 'POST',
            url  : '/checkpinns',
            data : { last : that.pinnData.length, minLat: pinnk.minLat, maxLat: pinnk.maxLat,
                minLong: pinnk.minLong, maxLong: pinnk.maxLong, selecting: pinnk.selecting, k: pinnk.k, B: pinnk.B},
            dataType : 'json'
        }).done(function (data) {
            console.log('Check rcvd pinns: ' + JSON.stringify(data));
            // Append the posts to the current posts:
            that.pinnData = (data);

            function isTimePostedPast_Seconds(seconds){
                var currentTime = parseInt(new Date() / 1000,10);
                for(var i = that.pinnData.length - 1; i >= 0; i--){
                    var p = that.pinnData[i];
                     if((currentTime - seconds) > p.timePosted){
                        var pinnc = new PinnClient({});
                        pinnc.removePinn(that.pinnData[i].eventk, that.pinnData[i].eventB);
                        that.pinnData.splice(i, 1);
                    }
                }
            }

            if(type === 'done'){
                that.view.val(data.EventName);
                that.view2.val(data.Description);
            }
            if(type === 'refresh'){
                isTimePostedPast_Seconds(600);
                for(var i =0; i<that.pinnData.length;i++){
                    var LatLng = new google.maps.LatLng(that.pinnData[i].Latitude, that.pinnData[i].Longitude);
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
        pixelOffset: new google.maps.Size(-450, -185),
        closeBoxMargin: "10px 155px 0px 0px",
        maxWidth: 500
    });

    google.maps.event.addListener(pinn, 'click', function() {
        if(this.created === 1 && newPinnOpen === false) {
            donepinnwindow.open(map, pinn);
            map.panTo(location);
            map.setZoom(15);
            if(openPin !== 'undefined' && openPin !== this){
                google.maps.event.trigger(openPin, 'closewindow');
            }
            openPin = pinn;
        }
    });

    google.maps.event.addListener(pinn, 'closewindow', function(){
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
        var EventName = $('#event-name');              //repeated lookups are slow
        var Description = $('#event-description');

        var pinnc = new PinnClient({
            view  : EventName,
            view2 : Description

        });
        var visLong = (map.width)/(overlay.getProjection().getWorldWidth())*360;
        var pinnk = {
            minLat: map.center.latitude - visLong,
            maxLat: map.center.latitude + visLong,
            minLong: map.center.longitude - visLong,
            maxLong: map.center.longitude + visLong,
            selecting: 1,
            k: pinn.position.lng(),
            B: pinn.position.lat()
        };
        console.log("done: 199");
        pinnc.check('done', pinn, pinnk);
        // Bind a click event:
        createComment.bind('click', function (event) {
            console.log(this);
            var text = this.input.val();
            var injectionProofText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            commentc.post(injectionProofText, location.lat(), location.lng());
            $('#chat').prepend('<li><div style="height: 90px;"><div style="float: left; width: 20%;"><iframe src="/updown.html" frameborder="0" width=75 height=85 scrolling=no></iframe></div><div style="margin-left:  20%;">' + injectionProofText + '</div></div></li>');
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
                    that.view.prepend(li);
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

    newPinnOpen = true;

    if(openPin !== 'undefined' && openPin !== this) {
        google.maps.event.trigger(openPin, 'closewindow');
    }
    openPin = 'undefined';

    var pinnImage = '/images/PinndItPin50x50.png';

    var pinn = new google.maps.Marker({
        position: location,
        map: map,
        icon: pinnImage,
        created: 0 //NEW ATTRIBUTE should be 1 AFTER it's created
    });

    openPin = pinn;

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
        pixelOffset: new google.maps.Size(-450, -185),
        closeBoxMargin: "10px 155px 0px 0px",
        maxWidth: 500
    });

    // google.maps.event.addListener(pinnDiv, 'onmouseover', function {
    //     //infowindow.close();
    //     donepinnwindow.close();
    // }); 



    infowindow.open(map, pinn);

    google.maps.event.addListener(infowindow, 'domready', function() {

        //creatingpinn toggles the visibility of the controlpinn and the inactive pinn Ariel Reches
        $(controlPinn).trigger("creatingpinn");
        $(inActivePinn).trigger("creatingpinn");

        var EventName = $('#event-name');              //repeated lookups are slow
        var Description = $('#event-description');
        var pinnc = new PinnClient({
            view  : EventName,
            view2 : Description

        });
        var createEvent = new PostButton({
            view    : $('#create-event'),
            input   : EventName,
            input2  : Description
        });

        createEvent.bind('click', function (event) {
            console.log(this);
            var text = this.input.val();
            var injectionProofText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            //$('#event-name').prop('readonly', true);
            var text2 = this.input2.val();
            var injectionProofText2 = text2.replace(/</g, "&lt;").replace(/>/g, "&gt;");

            //$('#event-description').prop('readonly', true);
            //$('#create-event').remove();
            pinnc.post(injectionProofText, injectionProofText2, location.lat(), location.lng());
            infowindow.close();
            pinn.created = 1;

            newPinnOpen = false;

            return false;
        });
    });

    google.maps.event.addListener(pinn, 'click', function() {
        if(this.created === 1 && newPinnOpen === false) {
            donepinnwindow.open(map, pinn);
            map.panTo(location);
            map.setZoom(15);
            if(openPin !== 'undefined' && openPin !== this){
                google.maps.event.trigger(openPin, 'closewindow');
            }
           openPin = pinn;
        }
    });

    google.maps.event.addListener(pinn, 'closewindow', function(){
        donepinnwindow.close();
    });

    google.maps.event.addListener(pinn, 'rightclick', function(){
        var pinnc = new PinnClient({});
        pinnc.removePinn(location.lat(), location.lng());
        donepinnwindow.close();
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
        var EventName = $('#event-name');              //repeated lookups are slow
        var Description = $('#event-description');

        var pinnc = new PinnClient({
            view  : EventName,
            view2 : Description

        });
        var visLong = (map.width)/(overlay.getProjection().getWorldWidth())*360;
        var pinnk = {
            minLat: map.center.latitude - visLong,
            maxLat: map.center.latitude + visLong,
            minLong: map.center.longitude - visLong,
            maxLong: map.center.longitude + visLong,
            selecting: 1,
            k: pinn.position.lng(),
            B: pinn.position.lat()
        };
        pinnc.check('done', pinn, pinnk);
        // Bind a click event:
        createComment.bind('click', function (event) {
            console.log(this);
            var text = this.input.val();
            var injectionProofText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            commentc.post(injectionProofText, location.lat(), location.lng());
            $('#chat').prepend('<li><div style="height: 90px;"><div style="float: left; width: 20%;"><iframe src="/updown.html" frameborder="0" width=75 height=85 scrolling=no></iframe></div><div style="margin-left:  20%;">' + injectionProofText + '</div></div></li>');
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
        newPinnOpen = false;
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
       // $(this).toggle();
    });



}

function AddControlPinn(controlDiv, map) {
    console.log("add control pinn");
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
       // $(this).toggle();

    });
}

function success(position) {
    console.log("success");
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

    console.log("pre-add control pinn");
    AddControlPinn(pinnDiv, map);
    AddInactivePinn(pinnDiv, map);


    google.maps.event.addListenerOnce(overlay,"projection_changed", function() {
        console.log("projection_changed");
        var pinnc = new PinnClient({});
        var cor1 = map.getBounds().getNorthEast();
        var cor2 = map.getBounds().getSouthWest();
        console.log(cor1.lng() + " " + cor2.lng());
        var pinnk = {
            minLat: cor2.lat(),
            maxLat: cor1.lat(),
            minLong: cor2.lng(),
            maxLong: cor1.lng(),
            selecting: 0,
            k: 0,
            B: 0
        };
        console.log(pinnk.minLat + " " + pinnk.maxLat + " " + pinnk.minLong + " " + pinnk.maxLong);
        pinnc.check('refresh', null, pinnk);
    });



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