$(document).ready(function() {
  $("#data").click(function() {
    $.ajax({
        url: "https://data.energystar.gov/resource/8bjc-dg2y.json",
        type: "GET",
        data: {
          "$limit" : 5000,
          "$$app_token" : "LTdNZ0UwA85BQrjScMSgYYyZH"
        }
    }).done(function(data) {
      alert("Retrieved " + data.length + " records from the dataset!");
      console.log(data);
    });
  });
})
