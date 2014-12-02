var overlay;
var map;
var PinndItPin = {
    url: '/images/PinndItPin.png',
    size: new google.maps.Size(100, 100),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(0, 32)
};

// A ChatClient object for communicating
// with the chat server.
function ChatClient(config) {
  for (var prop in config) {
    this[prop] = config[prop];
  }
}

ChatClient.prototype = {
  // An cache of posts received from server.
  posts : [],

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
      url  : '/post',
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
      data : { last : that.posts.length },
      dataType : 'json'
    }).done(function (data) {
      console.log('Check rcvd: ' + JSON.stringify(data));

      // Append the posts to the current posts:
      that.posts = that.posts.concat(data);

      // Rewrite to the view:
      that.view.empty();
      for (var i = 0; i < that.posts.length; i++) {
        var li   = $('<li>');
        li.html(that.posts[i].text);
        that.view.append(li);
      }
    });
  } 
};

function PostButton(config) {
  for (var prop in config) {
    this[prop] = config[prop];
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

function AddControlPinn(controlDiv, map) {

    controlDiv.style.padding = '15px';

    var controlPinn = document.createElement('div');

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
       
       
    var pinnDiv = document.createElement('div');
        
    var addPinn = new AddControlPinn(pinnDiv, map);
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

    var contentObject = $('<div><p>New Pinn Information</p>' + 
                        'Event Name: <input type="text" name="eventname"> <br>' + 
                        'Event Description:  <input type="text" name="eventdescription"> <br>' + 
                        '<button>Create Event</button>' + 
                        '</form><br></div>' +
                        '<div><input id= "submit" type="text" size="50">' +
                        '<button name= "send" id= "send" class="send" onclick="pinndit:onSend()">Submit</button>' +
                        '<ul style="list-style: none" id="chat">' +
                        '</ul></div>');

    var contentString = '<div><p>New Pinn Information</p>' + 
                        'Event Name: <input type="text" name="eventname"> <br>' + 
                        'Event Description:  <input type="text" name="eventdescription"> <br>' + 
                        '<button>Create Event</button>' + 
                        '</form><br></div>' +
                        '<div><input id= "submit" type="text" size="50">' +
                        '<button name="send" id= "send" class="send">Submit</button>' +
                        '<ul style="list-style: none" id="chat">' +
                        '</ul></div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        
        maxWidth: 500
    });
    
    infowindow.open(map, pinn);

    setTimeout(function(){
    console.log("enteredTimeout\n");
    var chatc = new ChatClient({ view : $('ul#chat') });
  // Setup the post button:
    var postb = new PostButton({
        view  : $('#send'),
        input : $('#submit')
    });

  // Bind a click event:
    postb.bind('click', function (event) {
    console.log(this);
    var text = this.input.val();
    chatc.post(text);
    $('#chat').append('<li>' + text + '</li>');
    // clear input text:
    this.input.val('');
    return false;
    });
    },5000);

    google.maps.event.addListener(infowindow, 'closeclick', function() {
        pinn.setMap(null);
    });
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success);
} else {
    error('Geo Location is not supported');
}

