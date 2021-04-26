document.getElementById("locationDOM").style.display = "none";
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition((position) => {
    console.log(position.coords.latitude, position.coords.longitude);

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    document.getElementById("Latitude").value = lat;
    document.getElementById("Longitude").value = lon;
    const data = { lat, lon };
  });
} else {
  console.log("Geolocation not available");
}
var password = document.getElementById("password"),
  confirm_password = document.getElementById("confirm_password");
function validatePassword() {
  if (password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords do not match");
  } else {
    confirm_password.setCustomValidity("");
  }
}

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;