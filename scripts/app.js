const BASE_URL = 'https://api.weatherapi.com/v1/forecast.json?key=c1bdf339354a49f197d130248242412&q=Tashkent&days=7&aqi=yes&alerts=yes\'';
const searchInputEl = document.querySelector('.weather-dashboard__search');
const mainEl = document.querySelector('.weather-dashboard__main');
const forecastEl = document.querySelector('.weather-dashboard__section--forecast');
const detailsEl = document.querySelector('.weather-dashboard__section--details');
const weeklyEl = document.querySelector('.weather-dashboard__weekly');
const tempEl = document.querySelector('.weather-dashboard__temp');
const cityEl = document.querySelector('.weather-dashboard__city');
const descEl = document.querySelector('.weather-dashboard__description strong');
const windSpeedEl = document.querySelector('.wind-speed strong');
const pressureEl = document.querySelector('.pressure strong');
const sunriseEl = document.querySelector('.sunrise strong');
const sunsetEl = document.querySelector('.sunset strong');
const uvIndexEl = document.querySelector('.uv-index strong');
const feelsLikeEl = document.querySelector('.feels-like strong');
const visibilityEl = document.querySelector('.visibility strong');
const windDegreeEl = document.querySelector('.wind-degree strong');

async function fetchData(city) {
    const response = await fetch(BASE_URL)
    
    response 
        .json()
        .then(res => {
            createWeatherCards(res)
            createWeeklyCards(res)
            console.log(res);
            tempEl.textContent = `${res.current.temp_c}°`;
            cityEl.textContent = res.location.name;
            descEl.textContent = res.current.humidity;
            windSpeedEl.textContent = res.current.wind_kph + ' km/h';
            pressureEl.textContent = res.current.pressure_mb + ' mb';
            sunriseEl.textContent = res.forecast.forecastday[0].astro.sunrise;
            sunsetEl.textContent = res.forecast.forecastday[0].astro.sunset;
            uvIndexEl.textContent = res.current.uv;
            feelsLikeEl.textContent = res.current.feelslike_c + '°';
            visibilityEl.textContent = res.current.vis_km + ' km';
            windDegreeEl.textContent = res.current.wind_degree + '°';
            
        })
        .catch(err => console.log(err))
}
window.onload = () => {
    fetchData()
}

function createWeatherCards(data) {
    const hours = data.forecast.forecastday.flatMap(day => day.hour).slice(0, 24);
    hours.forEach(hour => {
        const forecastCardEl = document.createElement('div');
        forecastCardEl.classList.add('forecast__time');
        forecastCardEl.innerHTML = `
            <p>${hour.time.split(' ')[1]}</p> 
            <img src="${hour.condition.icon}" alt="${hour.condition.text}" class="forecast__icon">
            <p>${hour.temp_c}°</p>
        `;
        forecastEl.appendChild(forecastCardEl);
    });
}
function createWeeklyCards(data) {
    const days = data.forecast.forecastday;
    days.forEach(day => {
        const weeklyCardEl = document.createElement('div');
        weeklyCardEl.classList.add('weekly__day');
        weeklyCardEl.innerHTML = `
            <span>${day.date}</span>
            <div><img src="${day.day.condition.icon}" alt="">${day.day.condition.text}</div>
            <span>${day.day.maxtemp_c}°/${day.day.mintemp_c}°</span>
        `;
        weeklyEl.appendChild(weeklyCardEl);
    });
}

