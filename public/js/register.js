

if('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude);

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        document.getElementById('lat').textContent = lat;
        document.getElementById('lon').textContent = lon;
        const data = {lat , lon};
       

        
      });
  } else {
    console.log('Geolocation not available');
  }
