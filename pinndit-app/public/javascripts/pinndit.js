var overlay;
var map;
// made pinn icon and its div global Ariel
var pinnDiv = document.createElement('div');
var controlPinn;
//inactivePinn is undraggable pinn in top right corner when in the middle of creating new events Ariel
var inActivePinn;
 var pinnformString = '<div><p>Pinn Information</p>' +
        'Event Name: <input id = "event-name" type="text" name="event-name"> <br>' +
        'Event Description:  <input id="event-description" type="text" name="event-description"> <br>' +
        '<button name="create-event" id= "create-event" class="create-event">Create Event</button>' +
        '<br></div>' +
        '<div>Comment: <input id= "submit" type="text" size="15">' +
        '<button name="send" id= "send" class="send">Submit</button>' +
        '<ul style="list-style: none" id="chat">' +
        '</ul></div>';
var pinnInfoString = '<h1> this is a template<h1>';



//never used?
var PinndItPin = {
    url: '/images/PinndItPin.png',
    size: new google.maps.Size(100, 100),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(0, 32)
};

function PinnClient(config){
    for (var prop in config) {
        if(config.hasOwnProperty(prop)){
            this[prop] = config[prop];
        }
  }
}

PinnClient.prototype = {
   pinnData : [],

  // Request info from server
  poll : function () {
    var that = this;
    this._stop = that.check();
  },

  // Stop requesting info
  pollStop : function () {
    clearInterval(this._stop);
  },

  // Post text to the server.
  post : function (name, desc, k, B) {
    $.ajax({
      type : 'POST',
      url  : '/postpinn',
      data : { 'name' : name, 'desc' : desc, 'k' : k, 'B' : B},
      dataType : 'json'
    }).done(function (data) {
      console.log('Post status: ' + data.status);
    });
  }//,

  // Check for more messages on the server
  // given the last index we have for the
  // current posts.
  // check : function () {
  //   var that = this;    
  //   $.ajax({
  //     type : 'POST',
  //     url  : '/check2',
  //     data : { last : that.posts.length },
  //     dataType : 'json'
  //   }).done(function (data) {
  //     console.log('Check rcvd: ' + JSON.stringify(data));

  //     // Append the posts to the current posts:
  //     that.posts = that.posts.concat(data);

  //     // Rewrite to the view:
  //     that.view.empty();
  //     for (var i = 0; i < that.posts.length; i++) {
  //       var li   = $('<li>');
  //       li.html(that.posts[i].text);
  //       that.view.append(li);
  //     }
  //   });
  //} 
};

function CommentClient(config) {
  for (var prop in config) {
      if(config.hasOwnProperty(prop)){
      this[prop] = config[prop];
  }
  }
}

CommentClient.prototype = {
  // An cache of posts received from server.
  comments : [],

  // Request info from server
  poll : function () {
    var that = this;
    this._stop = that.check();
  },

  // Stop requesting info
  pollStop : function () {
    clearInterval(this._stop);
  },

  // Post text to the server.
  post : function (text) {
    $.ajax({
      type : 'POST',
      url  : '/postcomment',
      data : { 'text' : text},
      dataType : 'json'
    }).done(function (data) {
      console.log('Post status: ' + data.status);
    });
  },

  // Check for more messages on the server
  // given the last index we have for the
  // current posts.
  check : function () {
    var that = this;    
    $.ajax({
      type : 'POST',
      url  : '/check',
      data : { last : that.comments.length },
      dataType : 'json'
    }).done(function (data) {
      console.log('Check rcvd: ' + JSON.stringify(data));

      // Append the posts to the current posts:
      that.comments = that.comments.concat(data);

      // Rewrite to the view:
      that.view.empty();
      for (var i = 0; i < that.comments.length; i++) {
        var li   = $('<li>');
        li.html(that.comments[i].text);
        that.view.append(li);
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
        icon: pinnImage
    });

    map.panTo(location);
    map.setZoom(15);

   
    var infowindow = new google.maps.InfoWindow({
        content: pinnformString,

        maxWidth: 500
    });

    infowindow.open(map, pinn);

    google.maps.event.addListener(infowindow, 'domready', function() {

       //creatingpinn toggles the visibility of the controlpinn and the inactive pinn Ariel Reches
        $(controlPinn).trigger("creatingpinn");
        $(inActivePinn).trigger("creatingpinn");
        


        var commentc = new CommentClient({ view : $('ul#chat') });

        commentc.poll();
        var createComment = new PostButton({
            view   : $('#send'),
            input  : $('#submit')
        });

        var pinnc = new PinnClient({
            view  : $('#event-name'),
            view2 : $('#event-description')

        });
        var createEvent = new PostButton({
            view    : $('#create-event'),
            input   : $('#event-name'),
            input2  : $('#event-description')
        });

        createEvent.bind('click', function (event) {
            console.log(this);
            var text = this.input.val();
            //$('#event-name').prop('readonly', true);
            var text2 = this.input2.val();
            //$('#event-description').prop('readonly', true);
            //$('#create-event').remove();
            pinnc.post(text, text2, location.k, location.B);
            infowindow.close();
            return false;
        });

        // Bind a click event:
        createComment.bind('click', function (event) {
            console.log(this);
            var text = this.input.val();
            commentc.post(text);
            $('#chat').append('<li>' + text + '</li>');
            // clear input text:
            this.input.val('');
            return false;
        });
    });

    google.maps.event.addListener(pinn, 'click', function() {
        infowindow.open(map, pinn);
    });

    google.maps.event.addListener(infowindow, 'closeclick', function() {
       //creatingpinn toggles the visibility of the controlpinn and the inactive pinn
       $(controlPinn).trigger("creatingpinn");
       $(inActivePinn).trigger("creatingpinn");


        if($('#event-name').attr('readonly') === 'readonly'){
            infowindow.close();
        }
        else{
            pinn.setMap(null);
        }
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
    $(controlPinn).draggable({helper: 'clone',
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

    $(controlPinn).on("creatingpinn", function(){
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

