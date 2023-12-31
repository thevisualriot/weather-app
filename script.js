/* --------------------------------------- VARIABLES -------------------------------------------- */
var APIkey = "7bc0e627ae57f769db338969c74ae3c9"
var searchInput = document.querySelector("#search-input");
var searchBtn = document.querySelector("#search-button");
var historyList = document.querySelector("#history");
var forecastEl = document.querySelector("#forecast");
var todayEl = document.querySelector("#today");
var searchHistory = [];
var firstChild;
var newBtn;
var cityLon;
var cityLat;
var queryURL;
var cityInfo;
var selectedCity;
var displayedName;


// ACCESS LOCAL STORAGE AND DISPLAY SEARCH HISTORY
if(localStorage){ // check if localStorage is not empty

    updateHistory(); // update history search

    for(i=0; i<searchHistory.length; i++){ // display localStorage items as buttons
        createNewBtn(searchHistory[i]);

        firstChild = historyList.firstChild;

        if (firstChild){
            historyList.insertBefore(newBtn, firstChild);  //add the last search on top
        } else {
            historyList.appendChild(newBtn);
        }
    }
}

// WHEN SEARCH BUTTON IS CLICKED
searchBtn.addEventListener("click", function(e){
    e.preventDefault();

    selectedCity = searchInput.value.trim(); // store input city
    
    cityInfo = "https://api.openweathermap.org/geo/1.0/direct?q={" + selectedCity + "}&limit=3&appid=" + APIkey; 
    
    if (selectedCity) {
        fetch (cityInfo)
        .then(function(response) {
                return response.json();
        }).then (function(data){
            if(data.length === 0){  // check if the city exists in the weather API data
                clearElement(todayEl);
                clearElement(forecastEl);
                var error = document.createElement("p");
                error.textContent = "City not found";  // display error message if it doesn't exist
                error.style.color= "red";
                todayEl.appendChild(error);
                throw new Error("City not found");
            }

            cityLon = data[0].lon;
            cityLat = data[0].lat;

            queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIkey + "&units=metric";
            
            fetch (queryURL)  // fetch weather data
            .then(function(response) {
                return response.json();
            }).then (function(data){
                displayedName = data.city.name;
                updateToday(data);  // display today weather 
                updateForecast(data); // display 5 day forecast
                createNewBtn(displayedName);
                saveToLocalStorage(displayedName); // save the search in local storage

                if(firstChild){  // add the button at the top to display the last search first
                    firstChild = historyList.firstChild;
                    if(displayedName && historyList.firstChild.id != displayedName){
                        historyList.insertBefore(newBtn, firstChild);
                    }
                } else if (displayedName) {
                    historyList.appendChild(newBtn);
                }
            })

            

        })
    }
});


// WHEN HISTORY BUTTONS ARE CLICKED 
historyList.addEventListener("click", function(e){
    
    if(e.target.tagName === "BUTTON"){
        displayedName = e.target.id;
        
        cityInfo = "https://api.openweathermap.org/geo/1.0/direct?q={" + displayedName + "}&limit=3&appid=" + APIkey;
        
        fetch (cityInfo)
        .then(function(response) {
            return response.json();
        }).then (function(data){
            cityLon = data[0].lon;
            cityLat = data[0].lat;
            
            queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIkey + "&units=metric";

    fetch (queryURL)
    .then(function(response) {
        return response.json();
    }).then (function(data){

        updateToday(data);
        updateForecast(data);

    })
})
}})



/* ------------------------------------------- FUNCTIONS ----------------------------------------------- */

// Update History Search Array from Local Storage
function updateHistory (){
    if (localStorage){
        var pastSearch = localStorage.getItem("history");
    
        if (pastSearch) {
            searchHistory = JSON.parse(pastSearch);
        } else {
            searchHistory = [];
        }
    }
}

// Save search to Local Storage
function saveToLocalStorage(object){
    if (object !== "" && searchHistory[searchHistory.length - 1] !== object) {  //save to localStorage if the input isn't empty or the same as last search
        searchHistory.push(object);
        localStorage.setItem("history", JSON.stringify(searchHistory));
    }
    firstChild = historyList.firstChild;
}

// Display Today Weather Info
function updateToday(data) {
    var todayDay = dayjs().format("DD/MM/YYYY");  // fetch today's date
    
    var cityHeader = document.createElement("h2");    
    var todayTemp = document.createElement("p");
    var todayWind = document.createElement("p");
    var todayHumidity = document.createElement("p");

    var weatherIcon = document.createElement("img");

    var weatherIconID = data.list[0].weather[0].icon;
    var weatherIconURL = "https://openweathermap.org/img/wn/" + weatherIconID + ".png";
    weatherIcon.setAttribute("src", weatherIconURL);
    
    todayTemp.textContent = "Temp: " + data.list[0].main.temp + "°C";   
    todayWind.textContent = "Wind: " + data.list[0].wind.speed + " KPH";    
    todayHumidity.textContent = "Humidity: " + data.list[0].main.humidity + "%";
    cityHeader.textContent = displayedName + " (" + todayDay + ")";
    
    cityHeader.appendChild(weatherIcon);

    clearElement(todayEl);
            
    todayEl.appendChild(cityHeader);
    todayEl.appendChild(todayTemp);
    todayEl.appendChild(todayWind);
    todayEl.appendChild(todayHumidity);
    todayEl.style.borderStyle ="solid";
}


// Display 5-day Forecast
function updateForecast(data){
    
    clearElement(forecastEl);

    var forecastHeader = document.createElement("h2");
    var currentDayTimestamp;
    var currentDay;

    forecastHeader.textContent = "5 Day Forecast";

    for(i = 0; i < 8 * 5; i += 8){  //display 5 cards with 5 days
        var dayCard = document.createElement("div");
        dayCard.setAttribute("class", "col dayCard");
        
        currentDayTimestamp = data.list[i].dt;
        currentDay = dayjs.unix(currentDayTimestamp).format("DD/MM/YYYY");

        var weatherIcon = document.createElement("img");
        var weatherIconID = data.list[i].weather[0].icon;
        var weatherIconURL = "https://openweathermap.org/img/wn/" + weatherIconID + ".png";
        weatherIcon.setAttribute("src", weatherIconURL);

        var currentDayText = document.createElement("h3");
        var currentTemp = document.createElement("p");
        var currentWind = document.createElement("p");
        var currentHumidity = document.createElement("p");
        
        currentDayText.textContent = currentDay;
        currentTemp.textContent = "Temp: " + data.list[i].main.temp + "°C";
        currentWind.textContent = "Wind: " + data.list[i].wind.speed + " KPH";
        currentHumidity.textContent = "Humidity: " + data.list[i].main.humidity + "%";

        dayCard.appendChild(currentDayText);
        dayCard.appendChild(weatherIcon);
        dayCard.appendChild(currentTemp);
        dayCard.appendChild(currentWind);
        dayCard.appendChild(currentHumidity);

        forecastEl.appendChild(dayCard);
    }

}


// Create new Button
function createNewBtn (city){
    newBtn = document.createElement("button");
    newBtn.setAttribute("id", city);
    newBtn.textContent = city;
}


// Remove all children of an Element
function clearElement (element){
    while (element.hasChildNodes()){
        element.removeChild(element.firstChild);
    } 
}