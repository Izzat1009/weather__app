
const searchInputEl = document.querySelector('.weather-dashboard__search');
const mainEl = document.querySelector('.weather-dashboard__main');
const forecastEl = document.querySelector('.weather-dashboard__section--forecast');
const detailsEl = document.querySelector('.weather-dashboard__section--details');
const weeklyEl = document.querySelector('.weather-dashboard__weekly');
const tempEl = document.querySelector('.weather-dashboard__temp');
const cityEl = document.querySelector('.weather-dashboard__city');
const descEl = document.querySelector('.weather-dashboard__description strong');
const searchEL = document.querySelector('.weather-dashboard__search');
const searchForm = document.querySelector('.weather-dashboard__form');


async function fetchData(city) {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=c1bdf339354a49f197d130248242412&q=${city}&days=7&aqi=yes&alerts=yes`)
    
    response 
        .json()
        .then(res => {
            createWeatherCards(res)
            createWeeklyCards(res)
            createDetailsCards(res)
            console.log(res);
            tempEl.textContent = `${res.current.temp_c}°`;
            cityEl.textContent = res.location.name;
            descEl.textContent = res.current.humidity;
           
            
        })
        .catch(err => console.log(err))
}
window.onload = () => {
    const savedCity = localStorage.getItem('city') || 'Tashkent';
    fetchData(savedCity);
    searchInputEl.value = savedCity; 
};
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = searchInputEl.value;
    if (city) {
        localStorage.setItem('city', city);
        fetchData(city);
        searchInputEl.value = '';
    }
});

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
    weeklyEl.innerHTML = null;
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
function createDetailsCards(data) {
    detailsEl.innerHTML = null;

    const detailsData = [
        { label: 'Condition', value: data.current.condition.text, icon: data.current.condition.icon },
        { label: 'Feels Like', value: `${data.current.feelslike_c}°C` },
        { label: 'Humidity', value: `${data.current.humidity}%` },
        { label: 'Wind Speed', value: `${data.current.wind_kph} kph` },
        { label: 'Wind Direction', value: data.current.wind_dir },
        { label: 'Pressure', value: `${data.current.pressure_mb} mb` },
        { label: 'UV Index', value: data.current.uv },
        { label: 'Visibility', value: `${data.current.vis_km} km` }
    ];

    detailsData.forEach(detail => {
        const detailsCardEl = document.createElement('div');
        detailsCardEl.classList.add('details__item');
        detailsCardEl.innerHTML = `
            ${detail.icon ? `<img src="${detail.icon}" alt="${detail.label}">` : ''}
            <strong>${detail.label}:</strong> <span>${detail.value}</span>
        `;
        detailsEl.appendChild(detailsCardEl);
    });
}
