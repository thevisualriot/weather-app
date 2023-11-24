var APIkey = "7bc0e627ae57f769db338969c74ae3c9"
var searchInput = document.querySelector("#search-input");
var selectedCity;
var searchBtn = document.querySelector("#search-button");
var searchHistory = [];

updateHistory();


searchBtn.addEventListener("click", function(e){

    updateHistory();

    selectedCity = searchInput.value.trim();
    saveToLocalStorage(selectedCity);

    var cityInfo = "http://api.openweathermap.org/geo/1.0/direct?q={" + selectedCity + "}&limit=3&appid=" + APIkey;
    var cityLon;
    var cityLat;
    e.preventDefault();
    if (selectedCity) {

    fetch (cityInfo)
    .then(function(response) {
        return response.json();
    }).then (function(data){
        cityLon = data[0].lon;
        cityLat = data[0].lat
        console.log(selectedCity + " " + cityLon + " " + cityLat);

        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIkey;

    fetch (queryURL)
    .then(function(response) {
        return response.json();
    }).then (function(data){
        console.log(data);
    })

    })


    }
})





function updateHistory (){
    var pastSearch;
    if (localStorage){
        console.log("here: " + searchHistory);
        pastSearch = localStorage.getItem("history");
    
        if (pastSearch) {
            searchHistory = JSON.parse(pastSearch);
        } else {
            searchHistory = [];
        }
}
}


function saveToLocalStorage(object){
    if (object !== "") {
        searchHistory.push(object);
        localStorage.setItem("history", JSON.stringify(searchHistory));
    }
}