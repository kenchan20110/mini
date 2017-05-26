

var initialLocation;
var hk = new google.maps.LatLng(22.38,114.10);
var browserSupportFlag =  new Boolean();

function initialize() {
  var myOptions = {
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  
  // Try W3C Geolocation (Preferred)
  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      map.setCenter(initialLocation);
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
}