var countrySelect = document.getElementById("global-country");
var citySellect = document.getElementById("global-city");
var selectedDestination = document.getElementById("selected-destination");
var exploreBtn = document.getElementById("global-search-btn");
var bordersContainer = document.getElementById("borders");
var toastContainer = document.getElementById("toast-container");
var toast = document.getElementById("toast");
var countryInfoSection = document.getElementById("dashboard-country-info");
var countryInfoPlaceholder = document.querySelector(
  ".country-info-placeholder",
);

// Holidays Section Variables :
var loadingOverlay = document.getElementById("loading-overlay");
var emptyState = document.querySelectorAll(".empty-state");
var yearSelect = document.getElementById("global-year");
var holidaysContent = document.getElementById("holidays-content");
var container = document.querySelectorAll(".container");
var countryName = document.querySelectorAll(".countryName");
var selectionYear = document.querySelector(".selection-year");

// Events Section Variables :
var eventsContainer = document.getElementById("events-content");

// Weather Section Variables :
var weatherContainer = document.getElementById("weather-content");

// Weekends Section Variables:
const lwContainer = document.getElementById("lw-content");

// Sun Times Section Variables :
const sunTimesContainer = document.getElementById("sun-times-content");

// Glople Variables :
var headerSelection = document.querySelectorAll(".view-header-selection");
var selectedCountryData = null;
var selectedYear = yearSelect.value;
var weatherIcons;

// Select Country :
async function getCountries() {
  loadingOverlay.classList.remove("hidden");
  var response = await fetch("https://date.nager.at/api/v3/AvailableCountries");

  if (response.ok == true) {
    var countriesData = await response.json();

    createOption(countriesData);
    loadingOverlay.classList.add("hidden");
  }
}
getCountries();

function createOption(countriesData) {
  var cartona = `<option value="">Select a Country</option>`;

  for (let i = 0; i < countriesData.length; i++) {
    cartona += `
        <option class="custom-select-option" data-value="${countriesData[i].countryCode}" data-name="${countriesData[i].name}" value="${countriesData[i].countryCode}">
      <img src="https://flagcdn.com/w40/ax.png" alt="${countriesData[i].countryCode}" class="flag-img" onerror="this.style.display='none'">
      <span class="country-name">${countriesData[i].name}</span>
      <span class="country-code">${countriesData[i].countryCode}</span>
    </option>
        `;
  }

  countrySelect.innerHTML = cartona;
}

// Select City depended on Selected Country Code :
countrySelect.addEventListener("change", function () {
  var selectedCode = this.value;

  if (selectedCode) {
    getCity(selectedCode);

    selectedDestination.style.display = "flex";
  }
});

async function getCity(selectedCode) {
  loadingOverlay.classList.remove("hidden");

  var response = await fetch(
    `https://restcountries.com/v3.1/alpha/${selectedCode}`,
  );

  if (response.ok == true) {
    var citiesData = await response.json();
    selectedCountryData = citiesData[0];

    citySellection();
    dispalyDestination();
    loadingOverlay.classList.add("hidden");
  }
}

// City Sellection :
function citySellection() {
  citySellect.innerHTML = "";

  var capitalOption = document.createElement("option");
  capitalOption.value = selectedCountryData.capital;
  capitalOption.textContent = selectedCountryData.capital + " (Capital)";
  capitalOption.selected = true;

  citySellect.appendChild(capitalOption);
}

// Destination Card Function :
function dispalyDestination() {
  selectedDestination.innerHTML = `
                    <div class="selected-flag">
                    <img
                      id="selected-country-flag"
                      src="${selectedCountryData.flags?.png || selectedCountryData.flags.svg}"
                      alt="Egypt"
                    />
                  </div>
                  <div class="selected-info">
                    <span
                      class="selected-country-name"
                      id="selected-country-name"
                      >${selectedCountryData.name.common}</span
                    >
                    <span class="selected-city-name" id="selected-city-name"
                      >• ${selectedCountryData.capital}</span
                    >
                  </div>
                  <button class="clear-selection-btn" id="clear-selection-btn">
                    <i class="fa-solid fa-xmark"></i>
                  </button>`;
  deleteDestination();
}
function deleteDestination() {
  const destXmark = document.getElementById("clear-selection-btn");
  destXmark.addEventListener("click", () => {
    clearElements();

    citySellect.innerHTML = '<option value="">Select a City</option>';

    showToast("Selection cleared", "info");
  });
}

// Explore Btn Event :
exploreBtn.addEventListener("click", () => {
  if (!countrySelect.value) {
    showToast("❗ Please select a country first", "error");
  } else {
    countryInfoPlaceholder.style.display = "none";
    emptyState.forEach((div) => {
      div.style.display = "none";
    });

    countryDetails();
    headerCard();
    neighbourSpan();

    showToast(
      `Exploring ${selectedCountryData.name.common},${selectedCountryData.capital}! ✔`,
      `success`,
    );

    getHolidays(yearSelect.value, selectedCountryData.cca2);
    getEvents();
    getWeather(selectedCountryData.latlng[0], selectedCountryData.latlng[1]);
    getWeekends(yearSelect.value, selectedCountryData.cca2);
    getCurrency();
    getSunTimes(selectedCountryData.latlng[0], selectedCountryData.latlng[1]);
  }
});

// Create Country Info Box For more details at Dashboard :
function countryDetails() {
  countryInfoSection.innerHTML = `
                    <div class="dashboard-country-header">
                  <img
                    src="${selectedCountryData.flags?.png || selectedCountryData.flags.svg}"
                    alt="${selectedCountryData.name.common}"
                    class="dashboard-country-flag"
                  />
                  <div class="dashboard-country-title">
                    <h3>${selectedCountryData.name.common}</h3>
                    <p class="official-name">${selectedCountryData.name.official}</p>
                    <span class="region"
                      ><i class="fa-solid fa-location-dot"></i> ${selectedCountryData.region} •
                      ${selectedCountryData.subregion}</span
                    >
                  </div>
                </div>

                <div class="dashboard-local-time">
                  <div class="local-time-display">
                    <i class="fa-solid fa-clock"></i>
                    <span class="local-time-value" id="country-local-time"
                      >08:30:45 AM</span
                    >
                    <span class="local-time-zone">${selectedCountryData.timezones}</span>
                  </div>
                </div>

                <div class="dashboard-country-grid">
                  <div class="dashboard-country-detail">
                    <i class="fa-solid fa-building-columns"></i>
                    <span class="label">Capital</span>
                    <span class="value">${selectedCountryData.capital}</span>
                  </div>

                  <div class="dashboard-country-detail">
                    <i class="fa-solid fa-users"></i>
                    <span class="label">Population</span>
                    <span class="value">${selectedCountryData.population}</span>
                  </div>

                  <div class="dashboard-country-detail">
                    <i class="fa-solid fa-ruler-combined"></i>
                    <span class="label">Area</span>
                    <span class="value">${selectedCountryData.area} km²</span>
                  </div>

                  <div class="dashboard-country-detail">
                    <i class="fa-solid fa-globe"></i>
                    <span class="label">Continent</span>
                    <span class="value">${selectedCountryData.continents}</span>
                  </div>

                  <div class="dashboard-country-detail">
                    <i class="fa-solid fa-phone"></i>
                    <span class="label">Calling Code</span>
                    <span class="value">${selectedCountryData.idd.root + selectedCountryData.idd.suffixes}</span>
                  </div>

                  <div class="dashboard-country-detail">
                    <i class="fa-solid fa-car"></i>
                    <span class="label">Driving Side</span>
                    <span class="value">${selectedCountryData.car.side}</span>
                  </div>

                  <div class="dashboard-country-detail">
                    <i class="fa-solid fa-calendar-week"></i>
                    <span class="label">Week Starts</span>
                    <span class="value">${selectedCountryData.startOfWeek.toUpperCase()}</span>
                  </div>
                </div>

                <div class="dashboard-country-extras">
                  <div class="dashboard-country-extra">
                    <h4><i class="fa-solid fa-coins"></i> Currency</h4>
                    <div class="extra-tags">
                      <span class="extra-tag">${Object.values(selectedCountryData.currencies)[0].name} (${Object.values(selectedCountryData.currencies)[0].symbol})</span>
                    </div>
                  </div>

                  <div class="dashboard-country-extra">
                    <h4><i class="fa-solid fa-language"></i> Languages</h4>
                    <div class="extra-tags">
                      <span class="extra-tag">${Object.values(selectedCountryData.languages)[0]}</span>
                    </div>
                  </div>

                  <div class="dashboard-country-extra">
                    <h4>
                      <i class="fa-solid fa-map-location-dot"></i> Neighbors
                    </h4>
                    <div class="extra-tags" id="borders">
                    </div>
                  </div>
                </div>

                <div class="dashboard-country-actions">
                  <a
                    href="${selectedCountryData.maps.googleMaps}"
                    target="_blank"
                    class="btn-map-link"
                  >
                    <i class="fa-solid fa-map"></i> View on Google Maps
                  </a>
                </div>
    `;
}

// Create Neighbours Span Function :
function neighbourSpan() {
  var bordersContainer = document.getElementById("borders");
  bordersContainer.innerHTML = "";
  if (selectedCountryData.borders.length > 0) {
    selectedCountryData.borders.forEach((ele) => {
      bordersContainer.innerHTML += `
      <span class="extra-tag">${ele}</span>
    `;
    });
  } else {
    bordersContainer.innerHTML = `
    <span class="extra-tag">No neighbors</span>
  `;
  }
}

// Create Header Card Function for All Sections :
function headerCard() {
  headerSelection.forEach((ele) => {
    ele.style.display = "flex";
    ele.innerHTML = `
                            <div class="current-selection-badge">
                    <img
                      src="${selectedCountryData.flags.png}"
                      alt="${selectedCountryData.name.common}"
                      class="selection-flag"
                    />
                    <span class="countryName">${selectedCountryData.name.common}</span>
                    <span class="selection-year">${yearSelect.value}</span>
                  </div>
        `;
  });
}

///////////////////////////////////////////////////////////////////////////////////
// Holidays :

async function getHolidays(year, countryCode) {
  loadingOverlay.classList.remove("hidden");

  var response = await fetch(
    `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`,
  );

  if (response.ok == true) {
    var holidaysData = await response.json();
    holidaysCards(holidaysData);

    loadingOverlay.classList.add("hidden");
  }
}

function holidaysCards(holidaysData) {
  var holidaysContainer = ``;

  for (let i = 0; i < holidaysData.length; i++) {
    var dateObj = new Date(holidaysData[i].date);
    var dayNum = dateObj.toLocaleDateString("en-US", {
      day: "2-digit",
    });
    var month = dateObj.toLocaleDateString("en-US", {
      month: "short",
    });
    var day = dateObj.toLocaleDateString("en-US", {
      weekday: "long",
    });

    holidaysContainer += `
              <div class="holiday-card">
                <div class="holiday-card-header">
                  <div class="holiday-date-box">
                    <span class="day">${dayNum}</span><span class="month">${month}</span>
                  </div>
                  <button class="holiday-action-btn favBtn">
                    <i class="fa-regular fa-heart"></i>
                  </button>
                </div>
                <h3>${holidaysData[i].localName}</h3>
                <p class="holiday-name">${holidaysData[i].name}</p>
                <div class="holiday-card-footer">
                  <span class="holiday-day-badge"
                    ><i class="fa-regular fa-calendar"></i>${day}</span
                  >
                  <span class="holiday-type-badge">${holidaysData[i].types[0]}</span>
                </div>
              </div>
`;
  }
  holidaysContent.innerHTML = holidaysContainer;
}

///////////////////////////////////////////////////////////////////////////////////
// Events :

async function getEvents() {
  loadingOverlay.classList.remove("hidden");

  const response = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?apikey=VwECw2OiAzxVzIqnwmKJUG41FbeXJk1y&city=${selectedCountryData.capital[0]}&countryCode=${selectedCountryData.cca2}&size=20`,
  );
  if (response.ok == true) {
    var eventsData = await response.json();

    displayEvent(eventsData);
    loadingOverlay.classList.add("hidden");
  }
}

function displayEvent(eventsData) {
  if (!eventsData._embedded || !eventsData._embedded.events) {
    eventsContainer.innerHTML = `<div class="empty-event-state">
        <div class="empty-icon"><i class="fa-solid fa-ticket"></i></div>
        <h3>No Events Found</h3>
        <p>No events found for this location</p>
      </div>`;
    return;
  }

  var eventsCards = ``;

  for (let i = 0; i < eventsData._embedded.events.length; i++) {
    var location = eventsData._embedded.events[i]._embedded.venues[0];
    var dateObj = new Date(
      eventsData._embedded.events[i].dates.start.localDate,
    );
    // var timeObj = new Date(
    //   eventsData._embedded.events[i].dates.start.localTime,
    // );
    var month = dateObj.toLocaleDateString("en-US", {
      month: "short",
    });
    var day = dateObj.toLocaleDateString("en-US", {
      day: "2-digit",
    });
    var year = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
    });
    // var time = timeObj.toLocaleTimeString("en-US", {
    //   hour: "2-digit",
    //   minute: "2-digit",
    //   hour12: false,
    // });

    eventsCards += `
                  <div class="event-card">
                <div class="event-card-image">
                  <img
                    src="${eventsData._embedded.events[i].images[0].url}"
                    alt="${eventsData._embedded.events[i].name}"
                  />
                  <span class="event-card-category">${eventsData._embedded.events[i].classifications[0].segment.name}</span>
                  <button class="event-card-save favBtn">
                    <i class="fa-regular fa-heart"></i>
                  </button>
                </div>
                <div class="event-card-body">
                  <h3>${eventsData._embedded.events[i].name}</h3>
                  <div class="event-card-info">
                    <div>
                      <i class="fa-regular fa-calendar"></i>${month + " " + day + ", " + year} at
                      ${eventsData._embedded.events[i].dates.start.localTime.slice(0, 5)}
                    </div>
                    <div>
                      <i class="fa-solid fa-location-dot"></i>${location.address.line1 + "," + location.city.name}
                    </div>
                  </div>
                  <div class="event-card-footer">
                    <button class="btn-event">
                      <i class="fa-regular fa-heart"></i> Save
                    </button>
                    <a href="#" class="btn-buy-ticket"
                      ><i class="fa-solid fa-ticket"></i> Buy Tickets</a
                    >
                  </div>
                </div>
              </div>
    `;
  }

  eventsContainer.innerHTML = eventsCards;
}

///////////////////////////////////////////////////////////////////////////////////
// Weather :

async function getWeather(lat, long) {
  loadingOverlay.classList.remove("hidden");

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto`,
  );
  if (response.ok == true) {
    const weatherData = await response.json();

    weatherHeader(weatherData);
    weatherSummary(weatherData);
    hourlyForecast(weatherData);
    dailyForecast(weatherData);
    weatherType(weatherData);

    loadingOverlay.classList.add("hidden");
  }
}

function weatherHeader(weatherData) {
  var dateObj = new Date(weatherData.current.time);
  var weekday = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
  });
  var month = dateObj.toLocaleDateString("en-US", {
    month: "short",
  });
  var day = dateObj.toLocaleDateString("en-US", {
    day: "2-digit",
  });

  weatherContainer.innerHTML = `
  <div class="weather-hero-card">
                <div class="weather-location">
                  <i class="fa-solid fa-location-dot"></i>
                  <span>${selectedCountryData.capital}</span>
                  <span class="weather-time">${weekday + ", " + month + " " + day}</span>
                </div>

                <div class="weather-hero-main">
                  <div class="weather-hero-left">
                    <div class="weather-hero-icon weatherIcon">
                      <i class="fa-solid"></i>
                    </div>

                    <div class="weather-hero-temp">
                      <span class="temp-value">${Math.round(weatherData.current.temperature_2m)}</span>
                      <span class="temp-unit">°C</span>
                    </div>
                  </div>

                  <div class="weather-hero-right">
                    <div class="weather-condition"></div>
                    <div class="weather-feels">Feels like ${weatherData.current.apparent_temperature}°C</div>
                    <div class="weather-high-low">
                      <span class="high"
                        ><i class="fa-solid fa-arrow-up"></i> ${weatherData.daily.apparent_temperature_max[0]}°</span
                      >
                      <span class="low"
                        ><i class="fa-solid fa-arrow-down"></i> ${weatherData.daily.apparent_temperature_min[0]}°</span
                      >
                    </div>
                  </div>
                </div>
              </div>

                <div class="weather-details-grid"></div>

                <div class="weather-section" id="hourlySection"></div>

                <div class="weather-section" id="dailySection"></div>
    `;
}

// Weather Overview Details Cards :
function weatherSummary(weatherData) {
  var weatherOverview = document.querySelector(".weather-details-grid");

  weatherOverview.innerHTML = `
                  <div class="weather-detail-card">
                  <div class="detail-icon humidity">
                    <i class="fa-solid fa-droplet"></i>
                  </div>

                  <div class="detail-info">
                    <span class="detail-label">Humidity</span>
                    <span class="detail-value">${weatherData.current.relative_humidity_2m}%</span>
                  </div>
                </div>

                <div class="weather-detail-card">
                  <div class="detail-icon wind">
                    <i class="fa-solid fa-wind"></i>
                  </div>
                  <div class="detail-info">
                    <span class="detail-label">Wind</span>
                    <span class="detail-value">${weatherData.current.wind_speed_10m} km/h</span>
                  </div>
                </div>

                <div class="weather-detail-card">
                  <div class="detail-icon uv">
                    <i class="fa-solid fa-sun"></i>
                  </div>
                  <div class="detail-info">
                    <span class="detail-label">UV Index</span>
                    <span class="detail-value">${weatherData.current.uv_index}</span>
                  </div>
                </div>

                <div class="weather-detail-card">
                  <div class="detail-icon precip">
                    <i class="fa-solid fa-cloud-rain"></i>
                  </div>
                  <div class="detail-info">
                    <span class="detail-label">Precipitation</span>
                    <span class="detail-value">${weatherData.daily.precipitation_probability_max[0]}%</span>
                  </div>
                </div>
  `;

  // weatherContainer.appendChild(weatherOverview);
}

// Hourly Forecast :
function hourlyForecast(weatherData) {
  var hourlySection = document.getElementById("hourlySection");

  hourlySection.innerHTML = `
                  <h3 class="weather-section-title">
                  <i class="fa-solid fa-clock"></i> Hourly Forecast
                </h3>

                <div class="hourly-scroll"></div>
  `;
  // weatherContainer.appendChild(hourlySection);
  createHourlyCard(weatherData);
}

function createHourlyCard(weatherData) {
  var hourlyScroll = document.querySelector(".hourly-scroll");

  for (let i = 0; i < 24; i++) {
    var timeObj = new Date(weatherData.hourly.time[i]);
    var hour = timeObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      hour12: true,
    });

    hourlyScroll.innerHTML += `
                  <div class="hourly-item">
                    <span class="hourly-time">${hour}</span>
                    <div class="hourly-icon weatherIcon">
                      <i class="fa-solid"></i>
                    </div>
                    <span class="hourly-temp">${Math.round(weatherData.hourly.temperature_2m[i])}°</span>
                    <span class="hourly-precip"><i class="fa-solid fa-droplet"></i> ${weatherData.hourly.precipitation_probability[i]}%</span>
                  </div>
`;
  }
  var hourlyItem = document.querySelectorAll(".hourly-item");
  var hourlyCurrentTime = document.querySelectorAll(".hourly-time");
  hourlyItem[0].classList.add("now");
  hourlyCurrentTime[0].textContent = "Now";
}

// Daily Forecast :
function dailyForecast(weatherData) {
  var dailySection = document.getElementById("dailySection");

  dailySection.innerHTML = `
                  <h3 class="weather-section-title">
                  <i class="fa-solid fa-calendar-week"></i> 7-Day Forecast
                </h3>

                <div class="forecast-list"></div>
  `;
  // weatherContainer.appendChild(dailySection);
  createDailyCard(weatherData);
}

function createDailyCard(weatherData) {
  var dailyCard = document.querySelector(".forecast-list");

  for (let i = 0; i < weatherData.daily.time.length; i++) {
    var dateObj = new Date(weatherData.daily.time[i]);
    var dayName = dateObj.toLocaleDateString("en-US", {
      weekday: "short",
    });
    var day = dateObj.toLocaleDateString("en-US", {
      day: "2-digit",
    });
    var month = dateObj.toLocaleDateString("en-US", {
      month: "short",
    });

    dailyCard.innerHTML += `
                  <div class="forecast-day">
                    <div class="forecast-day-name">
                      <span class="day-label">${dayName}</span
                      ><span class="day-date">${day + " " + month}</span>
                    </div>

                    <div class="forecast-icon weatherIcon">
                      <i class="fa-solid"></i>
                    </div>

                    <div class="forecast-temps">
                      <span class="temp-max">${weatherData.daily.temperature_2m_max[i]}°</span
                      ><span class="temp-min">${weatherData.daily.temperature_2m_min[i]}°</span>
                    </div>

                    <div class="forecast-precip">
                      <i class="fa-solid fa-droplet"></i>
                      <span>${weatherData.daily.precipitation_probability_max[i]}%</span>
                    </div>
                  </div>
`;
  }
  var dialyItem = document.querySelectorAll(".forecast-day");
  var currentDay = document.querySelectorAll(".day-label");
  dialyItem[0].classList.add("today");
  currentDay[0].textContent = "Today";
}

// Determine Weather Type :
function weatherType(weatherData) {
  var weatherHeroCard = document.querySelector(".weather-hero-card");
  var weatherCondition = document.querySelector(".weather-condition");
  weatherIcons = document.querySelectorAll(".weatherIcon i");

  weatherIcons.forEach((icon) => {
    icon.className = "fa-solid";
  });

  weatherHeroCard.className = "weather-hero-card";

  if (weatherData.current.weather_code === 0) {
    weatherHeroCard.classList.add("weather-sunny");
    changeWeatherIcons("fa-sun");
    weatherCondition.textContent = "Clear Sky";
  } else if (
    weatherData.current.weather_code === 1 ||
    weatherData.current.weather_code === 2 ||
    weatherData.current.weather_code === 3
  ) {
    weatherHeroCard.classList.add("weather-cloudy");
    changeWeatherIcons("fa-cloud");
    weatherCondition.textContent = "Partly Cloudy";
  } else if (
    weatherData.current.weather_code >= 45 &&
    weatherData.current.weather_code <= 48
  ) {
    weatherHeroCard.classList.add("weather-foggy");
    changeWeatherIcons("fa-smog");
    weatherCondition.textContent = "Foggy";
  } else if (
    weatherData.current.weather_code >= 51 &&
    weatherData.current.weather_code <= 65
  ) {
    weatherHeroCard.classList.add("weather-rainy");
    changeWeatherIcons("fa-cloud-rain");
    weatherCondition.textContent = "Rainy";
  } else if (
    weatherData.current.weather_code >= 71 &&
    weatherData.current.weather_code <= 77
  ) {
    weatherHeroCard.classList.add("weather-snowy");
    changeWeatherIcons("fa-snowflake");
    weatherCondition.textContent = "Snowy";
  } else if (
    weatherData.current.weather_code >= 95 &&
    weatherData.current.weather_code <= 99
  ) {
    weatherHeroCard.classList.add("weather-stormy");
    changeWeatherIcons("fa-cloud-bolt");
    weatherCondition.textContent = "Thunderstorm";
  } else {
    weatherHeroCard.classList.add("weather-default");
    changeWeatherIcons("fa-temperature-half");
    weatherCondition.textContent = "Unknown";
  }
}

function changeWeatherIcons(type) {
  weatherIcons.forEach((icon) => {
    icon.classList.add(type);
  });
}

//////////////////////////////////////////////////////////////////////////////////
// Long Weekends Section :

async function getWeekends(year, countryCode) {
  loadingOverlay.classList.remove("hidden");

  var response = await fetch(
    `https://date.nager.at/api/v3/LongWeekend/${year}/${countryCode}`,
  );

  if (response.ok == true) {
    loadingOverlay.classList.add("hidden");

    var weekendsData = await response.json();

    createWeekendCard(weekendsData);

    console.log(weekendsData);
  }
}

function createWeekendCard(weekendsData) {
  var cartona = ``;

  for (var i = 0; i < weekendsData.length; i++) {
    var startDateObj = new Date(weekendsData[i].startDate);
    var startDay = startDateObj.toLocaleDateString("en-US", {
      day: "2-digit",
    });
    // var startDayName = startDateObj.toLocaleDateString("en-US", {
    //   weekday: "short",
    // });
    var startMonth = startDateObj.toLocaleDateString("en-US", {
      month: "short",
    });
    var startYear = startDateObj.toLocaleDateString("en-US", {
      year: "numeric",
    });
    var endDateObj = new Date(weekendsData[i].endDate);
    var endDay = endDateObj.toLocaleDateString("en-US", {
      day: "2-digit",
    });
    var endMonth = endDateObj.toLocaleDateString("en-US", {
      month: "short",
    });
    var endYear = endDateObj.toLocaleDateString("en-US", {
      year: "numeric",
    });

    cartona += `
                  <div class="lw-card">
                <div class="lw-card-header">
                  <span class="lw-badge"
                    ><i class="fa-solid fa-calendar-days"></i> ${weekendsData[i].dayCount} Days</span
                  >
                  <button class="holiday-action-btn favBtn">
                    <i class="fa-regular fa-heart"></i>
                  </button>
                </div>

                <h3>Long Weekend #${i + 1}</h3>

                <div class="lw-dates">
                  <i class="fa-regular fa-calendar"></i> ${startMonth + " " + startDay + ", " + startYear + " - " + endMonth + " " + endDay + ", " + endYear}
                </div>

                <div class="lw-info-box success">
                  <i class="fa-solid fa-check-circle"></i> No extra days off
                  needed!
                </div>

                <div class="lw-days-visual">
                </div>
              </div>
    `;

    lwContainer.innerHTML = cartona;

    var displayDays = document.querySelector(".lw-days-visual");

    for (var j = 0; j < weekendsData[i].dayCount; j++) {
      displayDays.innerHTML += `
                        <div class="lw-day">
                        <span class="name"> </span><span class="num"></span>
                      </div>
      `;
    }
  }
}

/////////////////////////////////////////////////////////////////////////////////
// Sun Times Section :
async function getSunTimes(lat, long) {
  loadingOverlay.classList.remove("hidden");

  var response = await fetch(
    `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${long}&date=2026-01-26&formatted=0`,
  );
  if (response.ok == true) {
    var sunData = await response.json();

    sunTimesDetails(sunData);
    loadingOverlay.classList.add("hidden");
    console.log(sunData);
  }
}

function sunTimesDetails(sunData) {
  var dayHours = Math.floor(sunData.results.day_length / 3600);
  var dayMinutes = Math.floor((sunData.results.day_length % 3600) / 60);
  var day = `${dayHours}h ${dayMinutes}m`;

  var dateObj = new Date(sunData.results.sunrise);
  var fullDate = dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  var dayName = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
  });

  container.innerHTML = "";
  sunTimesContainer.innerHTML = `
              <div class="sun-main-card">
                <div class="sun-main-header">
                  <div class="sun-location">
                    <h2><i class="fa-solid fa-location-dot"></i> ${selectedCountryData.capital}</h2>
                    <p>Sun times for your selected location</p>
                  </div>
                  <div class="sun-date-display">
                    <div class="date">${fullDate}</div>
                    <div class="day">${dayName}</div>
                  </div>
                </div>

                <div class="sun-times-grid">
                  <div class="sun-time-card dawn">
                    <div class="icon"><i class="fa-solid fa-moon"></i></div>
                    <div class="label">Dawn</div>
                    <div class="time">${new Date(sunData.results.civil_twilight_begin).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</div>
                    <div class="sub-label">Civil Twilight</div>
                  </div>
                  <div class="sun-time-card sunrise">
                    <div class="icon"><i class="fa-solid fa-sun"></i></div>
                    <div class="label">Sunrise</div>
                    <div class="time">${new Date(sunData.results.sunrise).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</div>
                    <div class="sub-label">Golden Hour Start</div>
                  </div>
                  <div class="sun-time-card noon">
                    <div class="icon"><i class="fa-solid fa-sun"></i></div>
                    <div class="label">Solar Noon</div>
                    <div class="time">${new Date(sunData.results.solar_noon).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</div>
                    <div class="sub-label">Sun at Highest</div>
                  </div>
                  <div class="sun-time-card sunset">
                    <div class="icon"><i class="fa-solid fa-sun"></i></div>
                    <div class="label">Sunset</div>
                    <div class="time">${new Date(sunData.results.sunset).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</div>
                    <div class="sub-label">Golden Hour End</div>
                  </div>
                  <div class="sun-time-card dusk">
                    <div class="icon"><i class="fa-solid fa-moon"></i></div>
                    <div class="label">Dusk</div>
                    <div class="time">${new Date(sunData.results.civil_twilight_end).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</div>
                    <div class="sub-label">Civil Twilight</div>
                  </div>
                  <div class="sun-time-card daylight">
                    <div class="icon">
                      <i class="fa-solid fa-hourglass-half"></i>
                    </div>
                    <div class="label">Day Length</div>
                    <div class="time">${day}</div>
                    <div class="sub-label">Total Daylight</div>
                  </div>
                </div>
              </div>

              <div class="day-length-card">
                <h3>
                  <i class="fa-solid fa-chart-pie"></i> Daylight Distribution
                </h3>

                <div class="day-progress">
                  <div class="day-progress-bar">
                    <div class="day-progress-fill" style="width: 44.6%"></div>
                  </div>
                </div>

                <div class="day-length-stats">
                  <div class="day-stat">
                    <div class="value">10h 42m</div>
                    <div class="label">Daylight</div>
                  </div>

                  <div class="day-stat">
                    <div class="value">44.6%</div>
                    <div class="label">of 24 Hours</div>
                  </div>

                  <div class="day-stat">
                    <div class="value">13h 18m</div>
                    <div class="label">Darkness</div>
                  </div>
                </div>
              </div>
  `;
}

/////////////////////////////////////////////////////////////////////////////////
// Currancy Exchange Section :

async function getCurrency() {
  var response = await fetch(
    `https://v6.exchangerate-api.com/v6/805842951e5953ad31497176/latest/USD`,
  );

  if (response.ok == true) {
    var currencyData = await response.json();

    console.log(currencyData);
    // console.log(selectedCountryData.currencies);
  }
}

/////////////////////////////////////////////////////////////////////////////////
// My Plans Section :

var filterBtns = document.querySelectorAll(".plan-filter");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((ele) => {
      ele.classList.remove("active");
    });
    btn.classList.add("active");
  });
});

// var favBtns = document.querySelectorAll(".favBtn");
// favBtns.forEach((btn)=>{
//   btn.addEventListener("click", ()=>{
//     // favBtns.forEach((ele)=>{
//     //   ele.classList
//     // })
//     showToast("✔ Saved to My Plans!","success")
//   })
// })

////////////////////////////////////////////////////////////////////////
// Clear Function :

function clearElements() {
  selectedDestination.style.display = "none";
  selectedDestination.innerHTML = "";

  countryInfoSection.innerHTML = "";
  countryInfoPlaceholder.style.display = "flex";
  countryInfoSection.appendChild(countryInfoPlaceholder);

  countrySelect.value = "";

  headerSelection.forEach((ele) => {
    ele.innerHTML = "";
    ele.style.display = "none";
  });

  container.forEach((cont, index) => {
    cont.innerHTML = "";
    emptyState[index].style.display = "flex";
    cont.appendChild(emptyState[index]);
  });
}

// Alert For Unselected Country:
function showToast(message, type) {
  toastContainer.innerHTML = `
  <div class="toast ${type}" id="toast">${message}</div>
  `;
  toastContainer.style.display = "block";

  setTimeout(() => {
    toastContainer.style.display = "none";
  }, 3000);
}