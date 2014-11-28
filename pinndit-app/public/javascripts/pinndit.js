var overlay;
var map;
var PinndItPin = {
    url: '/images/PinndItPin.png',
    size: new google.maps.Size(100, 100),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(0, 32)
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


    var infowindow = new google.maps.InfoWindow({
        content: '<div><p>New Pinn Information</p>' + 
                'Event Name: <input type="text" name="eventname"> <br>' + 
                'Event Description:  <input type="text" name="eventdescription"> <br>' + 
                '<button>Create Event</button>' + 
                '</form></div>',
        
        maxWidth: 500
    });
    
    infowindow.open(map, pinn);

    google.maps.event.addListener(infowindow, 'closeclick', function() {
        pinn.setMap(null);
    });
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success);
} else {
    error('Geo Location is not supported');
}