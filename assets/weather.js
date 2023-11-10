// API key
const apiKey = '3977bb5e1b61426933e83f3be4f8c778';

function tempConvert(temp) {
    return ((temp - 273.15) * 1.8 + 32).toFixed(2);
}

function searchWeather() {
    const cityInput = document.getElementById('city-input');
    const city = cityInput.value.trim();

    if (city === '') {
        showError('Please enter a city name');
        return;
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // -------------Fetch data from OpenWeatherMap API
    fetch(weatherUrl)
        .then(response => {
        if (!response.ok) {
            throw new Error('City not found');
        }
        return response.json();
    })
        .then(data => {
        //--- Process data
        displayWeather(data);
        saveCity(city);
    })
        .catch(error => {
        console.error(error);
        showError('City not found. Please enter a valid city name.');
    });
}

function displayWeather(data) {
    const currentWeatherContainer = document.getElementById('current-weather');
    const forecastContainer = document.getElementById('forecast');

    // Clear existing content-----------------------------------------------
    currentWeatherContainer.innerHTML = '';
    forecastContainer.innerHTML = '';

    currentWeatherContainer.innerHTML += `
        <h2>${data.city.name}, ${data.city.country}</h2>
        <p>Temperature: ${tempConvert(data.list[0].main.temp)}°F</p>
        <p>Weather: ${data.list[0].weather[0].description}</p>
    `;

    forecastContainer.innerHTML += '<h3>5-Day Forecast</h3>';

    for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        const date = new Date(forecast.dt_txt);
        const formattedDate = date.toLocaleDateString();

        // get relevant forecast data-----------------------------------
        forecastContainer.innerHTML += `
            <div class="card">
                <p>Date: ${formattedDate}</p>
                <p>Temperature: ${tempConvert(forecast.main.temp)}°F</p>
                <p>Weather: ${forecast.weather[0].description}</p>
            </div>
        `;
    }

    updateLastCitiesList();
}

function showError(message) {
    const errorContainer = document.getElementById('error-message');
    errorContainer.innerHTML = `<p style="color: red;">Error: ${message}</p>`;

    setTimeout(() => {
        errorContainer.innerHTML = '';
    }, 5000);
}

function saveCity(city) {
    // -------------------------------get the existing cities from localStorage
    const savedCities = JSON.parse(localStorage.getItem('lastCities')) || [];

    // ------------------------Add the new city
    savedCities.unshift(city);

    // -----------------Keep the last 5 cities
    const last5Cities = savedCities.slice(0, 5);

    // ------------------------Save the array back to localStorage
    localStorage.setItem('lastCities', JSON.stringify(last5Cities));

    // -------Update the list of last 5 cities
    updateLastCitiesList();
}

function updateLastCitiesList() {
    // ----------------------------------get the last 5 cities
    const last5Cities = JSON.parse(localStorage.getItem('lastCities')) || [];

    // ---------------------------------Display the last 5 cities
    const lastCitiesList = document.getElementById('last-cities-list');
    lastCitiesList.innerHTML = '<h3>Last 5 Cities</h3>';

    last5Cities.forEach(city => {
        lastCitiesList.innerHTML += `<p>${city}</p>`;
    });
}
