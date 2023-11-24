var APIkey = "7bc0e627ae57f769db338969c74ae3c9"
var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=" + APIkey;
var searchInput = document.querySelector("#search-input");
var selectedCity;
var searchBtn = document.querySelector("#search-button");

console.log(searchBtn);

searchBtn.addEventListener("click", function(e){
    selectedCity = searchInput.value;
    var cityInfo = "http://api.openweathermap.org/geo/1.0/direct?q={" + selectedCity + "}&limit=3&appid=" + APIkey;
    var cityLon;
    var cityLat;
    e.preventDefault();
    // console.log('working');
    if (selectedCity) {
        // console.log(selectedCity);

    fetch (cityInfo)
    .then(function(response) {
        return response.json();
    }).then (function(data){
        cityLon = data[0].lon;
        cityLat = data[0].lat
        console.log(selectedCity + " " + cityLon + " " + cityLat);
    })


    }
})

// fetch (queryURL)
// .then(function(response) {
//     return response.json();
// }).then (function(data){
//     console.log(data);
// })