﻿var map;
var markers = [];
var initialLocation;
var hk = new google.maps.LatLng(22.38,114.10);
var browserSupportFlag =  new Boolean();

var directionsDisplay;
var oldDirections = [];
var currentDirections = null;
var fromX = document.getElementById("txtFrom");
var fromY = document.getElementById("txtEnd");
var geocoder = new google.maps.Geocoder();
var directionsService = new google.maps.DirectionsService();

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
    zoomControl: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

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
    travelMode: google.maps.DirectionsTravelMode.DRIVING,
    avoidTolls: true
  };

  codeAddress();

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
            map.setCenter( results[0].geometry.location );
        } else {
            alert( 'Geocode was not successful for the following reason: ' + status );
        }
    } );
}

function markerLatLng(allX,allY,allLoc) {

  if(document.getElementById('txtFrom').value !='' && document.getElementById('txtEnd').value !=''){
  var x = allX.split(",");
  var y = allY.split(",");
  var loc = allLoc.split(",");
  var str = "<table class='w3-table w3-table-all'>";

  deleteMarkers();
  for ( var i = 0 ; i < x.length ; i++){
    var xy = new google.maps.LatLng(x[i],y[i]);
    if ( i == 0 || i == x.length - 1) {
    var marker = new google.maps.Marker({
        position: xy,
        map: map 
    });
    markers.push(marker);
      if (i ==0){
        codeAddress();
      }
    }
    if ( i != x.length - 1) {
      var xy2 = new google.maps.LatLng(x[i+1],y[i+1]);
      calcRoute2(xy.lat(),xy.lng(),xy2.lat(),xy2.lng());
}
    }

  for ( var j = 0 ; j < loc.length ; j++){
    str += "<tr><th>Stop " + (j+1) + "</th><td><a>" + loc[j] + "</a></td></tr>";
  }
  str += "</table>";
  //console.log(str);
  document.getElementById("directions_panel").innerHTML = str;
  //directionsDisplay2.setPanel(document.getElementById("directions_panel"));

  }else{
    alert("Please insert route.");
  }
}

function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

function deleteMarkers() {
        setMapOnAll(null);
        markers = [];
      }

function calcRoute2(x1,y1,x2,y2) {

  var directionsDisplay2 = new google.maps.DirectionsRenderer({
    preserveViewport: false,
    suppressMarkers: true
  });

  directionsDisplay2.setMap(map);

  //directionsDisplay2.setPanel(document.getElementById("directions_panel"));

  google.maps.event.addListener(directionsDisplay2, 'directions_changed',
    function() {
      if (currentDirections) {
        oldDirections.push(currentDirections);          
      }
      currentDirections = directionsDisplay2.getDirections();
    });

  var request = {
    origin:{lat: x1, lng: y1},
    destination:{lat: x2, lng: y2},
    travelMode: google.maps.DirectionsTravelMode.DRIVING,
    avoidTolls: true
  };

  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay2.setDirections(response);
    }
  });

}

 function displayLocation(latitude,longitude){
        var request = new XMLHttpRequest();

        var method = 'GET';
        var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true';
        var async = true;

        request.open(method, url, async);
        request.onreadystatechange = function(){
          if(request.readyState == 4 && request.status == 200){
            var data = JSON.parse(request.responseText);
            var address = data.results[1];
            fromX.value = address.address_components[2].long_name + address.address_components[1].long_name;;
            //fromY.value = url;
          }
        };
        request.send();
      };

