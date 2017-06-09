var map;
var initialLocation;
var hk = new google.maps.LatLng(22.38,114.10);
var browserSupportFlag =  new Boolean();

var directionsDisplay;
var oldDirections = [];
var currentDirections = null;
var fromX = document.getElementById("txtFrom");
var geocoder = new google.maps.Geocoder();

var successCallback = function(position){
  var x = position.coords.latitude;
  var y = position.coords.longitude;
  displayLocation(x,y);
};

var errorCallback = function(error){
  var errorMessage = 'Unknown error';
  switch(error.code) {
    case 1:
      errorMessage = 'Permission denied';
      break;
    case 2:
      errorMessage = 'Position unavailable';
      break;
    case 3:
      errorMessage = 'Timeout';
      break;
  }
  console.log(errorMessage);
};

var options = {
  enableHighAccuracy: true,
  timeout: 1000,
  maximumAge: 0
};

function initialize() {
  
  var myOptions = {
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

  directionsDisplay = new google.maps.DirectionsRenderer({
    'map': map,
    'preserveViewport': true,
    'draggable': true
  }); 
  
  directionsDisplay.setPanel(document.getElementById("directions_panel"));

  google.maps.event.addListener(directionsDisplay, 'directions_changed',
    function() {
      if (currentDirections) {
        oldDirections.push(currentDirections);          
      }
      currentDirections = directionsDisplay.getDirections();
    });
  
  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      map.setCenter(initialLocation);
      var marker = new google.maps.Marker({
      position: initialLocation,
      map: map,
      title: 'You are Here.'
  });
    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });

  }
  // Browser doesn't support Geolocation
  else {
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
  }
  
  function handleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
      alert("地圖定位失敗");
    } else {
      alert("您的瀏覽器不支援定位服務");
    }
	initialLocation = hk;
    map.setCenter(initialLocation);
  }
  navigator.geolocation.getCurrentPosition(successCallback,errorCallback,options);
}

function calcRoute(pFrom,pEnd) {
  var start = pFrom;
  var end = pEnd;
  var request = {
    origin:start,
    destination:end,
    travelMode: google.maps.DirectionsTravelMode.DRIVING
  };

  codeAddress();

  var directionsService = new google.maps.DirectionsService();
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });

}

function codeAddress() {

    var address = document.getElementById( 'txtFrom' ).value;
    geocoder.geocode( { 'address' : address }, function( results, status ) {
        if( status == google.maps.GeocoderStatus.OK ) {

            //In this case it creates a marker, but you can get the lat and lng from the location.LatLng
            map.setCenter( results[0].geometry.location );
            //var marker = new google.maps.Marker( {
                //map     : map,
                //position: results[0].geometry.location
            //} );
        } else {
            alert( 'Geocode was not successful for the following reason: ' + status );
        }
    } );
}


function arrayCounter(arr) {
  //console.log(arr);
  //Check to see if the passed in argument is a string, number, or undefined
  if (typeof arr == "string" || typeof arr == "number" || typeof arr == "undefined") {
  //If so, return 0, which breaks out of the function
   console.log("0");
  }
  else {
  //If it's not any of those things, it is of type "object" so it can be an array which is the same as an object
  console.log(arr.length);
  }
}

function markerLatLng(x,y) {
  //var str1 = x.split("/");

  //var arrX = new Array();
  //for ( var i = 0 ; i < x.length ; i++){
    var xy = new google.maps.LatLng(x,y);
    var marker = new google.maps.Marker({
        position: xy,
        map: map 
    });
  //}
}

function calcRoute2(x1,y1,x2,y2) {
  var request = {
    origin:{lat: x1, lng: y1},
    destination:{lat: x2, lng: y2},
    travelMode: google.maps.DirectionsTravelMode.DRIVING
  };
  var directionsService = new google.maps.DirectionsService();
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });

}

 function displayLocation(latitude,longitude){
        var request = new XMLHttpRequest();

        var method = 'GET';
        var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true';
        var async = true;

        request.open(method, url, async);
        request.onreadystatechange = function(){
          if(request.readyState == 4 && request.status == 200){
            var data = JSON.parse(request.responseText);
            var address = data.results[0];
            fromX.value = address.formatted_address;
          }
        };
        request.send();
      };

