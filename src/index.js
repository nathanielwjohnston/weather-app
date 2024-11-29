import "./styles.css";

let currentLocation;

async function getWeatherData(location, unitGroup) {
  const weatherData = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unitGroup}&elements=datetime%2Ctemp%2Cfeelslike%2Chumidity%2Cconditions&include=current&key=J34LGPNZGQ95XYK8YUGDAAGSY&contentType=json`,
    { mode: "cors" },
  );

  if (weatherData.status == 200) {
    const jsonData = await weatherData.json();
    return jsonData;
  } else if (weatherData.status == 400) {
    throw `"${location}" is not a valid location`;
  }

  throw new Error(weatherData.status);
}

function processWeatherData(data) {
  return {
    location: data.resolvedAddress,
    temperature: data.currentConditions.temp,
    "feels-like": data.currentConditions.feelslike,
    humidity: data.currentConditions.humidity,
    conditions: data.currentConditions.conditions,
  };
}

function displayWeatherData(data) {
  function changeDisplayElement(dataPoint) {
    const display = document.getElementById(dataPoint);
    display.textContent = data[dataPoint];
  }

  for (let dataPoint in data) {
    changeDisplayElement(dataPoint);
  }

  const displayContainer = document.getElementById("weather-display");
  displayContainer.style.display = "block";

  const temperatureUnitButton = document.getElementById(
    "temperature-unit-selector",
  );
  const temperatureUnit = temperatureUnitButton.dataset.unit;
  const unitDisplays = document.querySelectorAll(".temperature-unit-display");
  if (temperatureUnit === "uk") {
    unitDisplays.forEach((display) => {
      display.textContent = "C";
    });
  } else if (temperatureUnit === "us") {
    unitDisplays.forEach((display) => {
      display.textContent = "F";
    });
  }
}

const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const search = document.getElementById("location-search");
  const location = search.value.toLowerCase().trim();

  const temperatureUnitButton = document.getElementById(
    "temperature-unit-selector",
  );
  const temperatureUnit = temperatureUnitButton.dataset.unit;

  getWeatherData(location, temperatureUnit).then(
    (data) => {
      currentLocation = location;
      displayWeatherData(processWeatherData(data));
    },
    (error) => alert(error),
  );
});

const temperatureUnitButton = document.getElementById(
  "temperature-unit-selector",
);
temperatureUnitButton.addEventListener("click", () => {
  const temperatureUnit = temperatureUnitButton.dataset.unit;

  if (temperatureUnit === "uk") {
    temperatureUnitButton.dataset.unit = "us";
    temperatureUnitButton.textContent = "Unit: F";
  } else if (temperatureUnit === "us") {
    temperatureUnitButton.dataset.unit = "uk";
    temperatureUnitButton.textContent = "Unit: C";
  }

  // check if there is a location currently being displayed
  if (currentLocation) {
    getWeatherData(currentLocation, temperatureUnitButton.dataset.unit).then(
      (data) => {
        displayWeatherData(processWeatherData(data));
      },
      (error) => alert(error),
    );
  }
});
