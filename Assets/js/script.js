var searchBtn = document.querySelector('.search-button');
var searchInput = document.getElementById('city-search');
var displayCity = document.querySelector('.city-name');
var displayTemp = document.querySelector('.temp');
var displayWind = document.querySelector('.wind');
var displayHumidity = document.querySelector('.humidity');
var displayUV = document.querySelector('.uv-index');
var fiveDay = document.querySelector('.five-day');
var cityList = document.querySelector('.city-list');
var searchedCity = "";
var citiesSearched = [];

getCityLocal();
cityButtons();

searchBtn.addEventListener('click', handleFetch)

function handleFetch(event) {
    event.preventDefault();
    if (searchInput.value === '') {
        alert("City not found, please try again");
        return;
    // } else if (citiesSearched.includes(searchInput.value)) {
    //     handleSearch(searchInput.value); 
    } else {
        console.log("item Searched")
        // citiesSearched.push(searchInput.value)
        console.log(citiesSearched)
        var oldSearch = searchInput.value
        var newSearch = oldSearch.toUpperCase();
        console.log(newSearch)
        handleSearch(newSearch)
    };
}

function handleCityBtnFetch(event) {
    event.preventDefault();
    if (event.target.innerHTML == null) {
        console.log("City not found, please try again");
        return;
    } else {
        console.log('button Pressed')
        handleSearch(event.target.innerHTML)
    };
}

function setCityLocal() {
    localStorage.setItem('citiesSearched', JSON.stringify(citiesSearched))
        console.log("Storage Set");
}

function getCityLocal() {
    var storedCity = localStorage.getItem("citiesSearched")
    if (storedCity) {
        citiesSearched = JSON.parse(storedCity)
        console.log("Storage Got")
    }
}

function cityButtons(){
    var clearButtons = document.querySelectorAll(".city-buttons")
    for (let i = 0; i< clearButtons.length; i++) {
        clearButtons[i].remove();
    }
    if (citiesSearched.length > 0) {
        for (i = 0; i < citiesSearched.length; i++) {
        var cityBtn = document.createElement('button');
        cityList.appendChild(cityBtn)
        cityBtn.innerHTML = citiesSearched[i]
        cityBtn.classList.add('city-buttons', 'btn', 'btn-secondary', 'text-white', 'fw-bold', 'fs-4')
        cityBtn.addEventListener('click', handleCityBtnFetch);   
        console.log("buttons made");
    }
    };
};

function handleSearch(searched){
    var removeLi = document.querySelectorAll(".col")
    for (let i = 0; i< removeLi.length; i++) {
        removeLi[i].remove();
    }
    console.log(searched)
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searched + "&appid=b0fa292c20893032e1d93d8d0f087c82"
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        // Get Lat/Lon from City Searched API and input it into onecall API call
        .then(function (data) {
            if (data.cod === '404') {
                alert("City not found, please try again");
                cityButtons();
                return;
            } 
            if (!citiesSearched.includes(data.name)) {
                citiesSearched.push(data.name)
            }
            setCityLocal();
            getCityLocal();
            cityButtons();
            console.log(data);
            var city = data.name;
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            var requestWeatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely&appid=b0fa292c20893032e1d93d8d0f087c82"
            // API call to get one call API for search city via the Lat/Lon
            fetch(requestWeatherUrl)
                .then (function(response1){
                    return response1.json();
                })
                .then (function(data1){
                    console.log(data1);
                    // Current Weather For the Selected City
                    displayCity.textContent = city + " : " + moment.unix(data1.current.dt).format("M/DD/YYYY");
                    displayTemp.textContent = "Temp: " + Math.round(data1.current.temp) + "℉";
                    displayWind.textContent = "Wind: " + data1.current.wind_speed + " MPH";
                    displayHumidity.textContent = "Humidity: " + data1.current.humidity + "%";
                    displayUV.textContent = "UV Index: " + data1.current.uvi

                    // Grab and display weather icon for selected city
                    var currentIcon = data1.current.weather[0].icon;
                    var currentIconURL = "http://openweathermap.org/img/wn/" + currentIcon + "@2x.png ";
                    var currentIconDisplay = document.createElement('img');
                    currentIconDisplay.setAttribute("src", currentIconURL);
                    displayCity.appendChild(currentIconDisplay);

                    // Logic to adjust bacgound color of UV Index
                    if(data1.current.uvi < 3){
                        displayUV.style.backgroundColor = "green";
                        displayUV.classList.remove("text-dark", "fw-bolder");
                        displayUV.classList.add("text-white", "fw-bolder");
                    }    
                    if(data1.current.uvi > 3 && data1.current.uvi < 6 ){
                        displayUV.style.backgroundColor = "yellow";
                        displayUV.classList.remove("text-white", "fw-bolder");
                        displayUV.classList.add("text-dark", "fw-bolder");
                    }
                    if(data1.current.uvi > 6 && data1.current.uvi < 7 ){
                        displayUV.style.backgroundColor = "orange";
                        displayUV.classList.remove("text-white", "fw-bolder");
                        displayUV.classList.add("text-dark", "fw-bolder");
                    }
                    if(data1.current.uvi > 7 && data1.current.uvi < 11 ){
                        displayUV.style.backgroundColor = "red";
                        displayUV.classList.remove("text-dark", "fw-bolder");
                        displayUV.classList.add("text-white", "fw-bolder");
                    }
                    if(data1.current.uvi > 11 ){
                        displayUV.style.backgroundColor = "purple";
                        displayUV.classList.remove("text-dark", "fw-bolder");
                        displayUV.classList.add("text-white", "fw-bolder");
                    }

                    // For loop to create 5 day forecast cards
                    for (var i = 0; i < (data1.daily.length -3); i++) {
                        console.log((data1.daily.length-3));
                        var columnDiv = document.createElement('div');
                        fiveDay.appendChild(columnDiv);
                        columnDiv.classList.add("col", "align-self-center");

                        var card = document.createElement('div');
                        columnDiv.appendChild(card);
                        card.classList.add("card", "border-dark", "mb-3");
                        card.style.width = "11rem";
                    
                        var cardBody = document.createElement('div');
                        card.appendChild(cardBody);
                        cardBody.classList.add("card-body");
                        cardBody.classList.add("text-center");

                        var fiveDayDate = document.createElement('h4');
                        fiveDayDate.classList.add("card-title")
                    
                        var fiveDayTemp = document.createElement('h5');
                        fiveDayTemp.classList.add("card-subtitle", "mb-2", "fw-bold");
                
                        var fiveDayHumidity = document.createElement('h6');
                        fiveDayHumidity.classList.add("card-text");
                
                        var fiveDayWind = document.createElement('h6');
                        fiveDayWind.classList.add("card-text")
                
                        var fiveDayIcon = data1.daily[i].weather[0].icon;
                        var fiveDayIconURL = "http://openweathermap.org/img/wn/" + fiveDayIcon + "@2x.png ";
                        var fiveDayIconDisplay = document.createElement('img');
                        fiveDayIconDisplay.setAttribute('src', fiveDayIconURL)
                
                        cardBody.appendChild(fiveDayDate);
                        cardBody.appendChild(fiveDayIconDisplay)
                        cardBody.appendChild(fiveDayTemp);
                        cardBody.appendChild(fiveDayHumidity);
                        cardBody.appendChild(fiveDayWind);
                    
                        fiveDayDate.textContent = moment.unix(data1.daily[i].dt).format('MM/DD/YYYY');
                        fiveDayTemp.textContent = "Temp: " + Math.round(data1.daily[i].temp.day) + "°F";
                        fiveDayWind.textContent = "Wind: " + Math.round(data1.daily[i].wind_speed) + " MPH";
                        fiveDayHumidity.textContent = "Humidity: " + data1.daily[i].humidity + "%";

                    };
                })
        })
};
