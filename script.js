var APIkey = "7bc0e627ae57f769db338969c74ae3c9"
var searchInput = document.querySelector("#search-input");
var selectedCity;
var searchBtn = document.querySelector("#search-button");
var historyList = document.querySelector("#history");
var searchHistory = [];
var firstChild = historyList.firstChild;
var todayEl = document.querySelector("#today");
var newBtn;
var cityHeader = "";
var cityLon;
var cityLat;
var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIkey;

updateHistory();

if(localStorage){
    updateHistory();

    for(i=0; i<searchHistory.length; i++){
        newBtn = document.createElement('button');
        newBtn.setAttribute('id', searchHistory[i]);
        newBtn.textContent = searchHistory[i];
        firstChild = historyList.firstChild;

        if (firstChild){
            historyList.insertBefore(newBtn, firstChild);
        } else {
            historyList.appendChild(newBtn);
        }
        }
}


searchBtn.addEventListener("click", function(e){

    updateHistory();

    selectedCity = searchInput.value.trim();
    saveToLocalStorage(selectedCity);

    newBtn = document.createElement('button');
    newBtn.setAttribute('id', selectedCity);
    newBtn.textContent = selectedCity;
    firstChild = historyList.firstChild;

    if(selectedCity && historyList.firstChild.id != selectedCity){
    if(firstChild){
        historyList.insertBefore(newBtn, firstChild);
    } else {
        historyList.appendChild(newBtn);
    }
}


    var cityInfo = "http://api.openweathermap.org/geo/1.0/direct?q={" + selectedCity + "}&limit=3&appid=" + APIkey;
    e.preventDefault();
    
    if (selectedCity) {
    fetch (cityInfo)
    .then(function(response) {
        return response.json();
    }).then (function(data){
        cityLon = data[0].lon;
        cityLat = data[0].lat;
        // queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIkey;
        queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIkey + "&units=metric";
    // PRINT THE WEATHER
    fetch (queryURL)
    .then(function(response) {
        return response.json();
    }).then (function(data){

        console.log(data);
        cityHeader = document.createElement('h2');
        var temp = document.createElement('p');
        temp.textContent = "Temp: " + data.main.temp;
        var wind = document.createElement('p');
        wind.textContent = "Wind: " + data.wind.speed + " KPH";
        var humidity = document.createElement('p');
        humidity.textContent = "Humidity: " + data.main.humidity + "%";

        var todayDay = dayjs().format('DD/MM/YYYY');
        var weatherIconID = data.weather[0].icon;
        var weatherIconURL = "https://openweathermap.org/img/wn/" + weatherIconID + ".png";
        var weatherIcon = document.createElement('img');
        weatherIcon.setAttribute('src', weatherIconURL);
        cityHeader.textContent = selectedCity + " (" + todayDay + ")";
        cityHeader.appendChild(weatherIcon);

        while (todayEl.hasChildNodes()){
            todayEl.removeChild(todayEl.firstChild);
        } 
            
        todayEl.appendChild(cityHeader);
        todayEl.appendChild(temp);
        todayEl.appendChild(wind);
        todayEl.appendChild(humidity);

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
    if (object !== "" && searchHistory[searchHistory.length - 1] !== object) {
        searchHistory.push(object);
        localStorage.setItem("history", JSON.stringify(searchHistory));
    }
}
