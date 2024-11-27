import "./styles.css";

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
    "feels like": data.currentConditions.feelslike,
    humidity: data.currentConditions.humidity,
    conditions: data.currentConditions.conditions,
  };
}

function displayWeatherData(data) {
  const temperatureDisplay = document.getElementById("temperature");
  temperatureDisplay.textContent = data.temperature;

  const locationDisplay = document.getElementById("location");
  locationDisplay.textContent = data.location;

  const conditionsDisplay = document.getElementById("conditions");
  conditionsDisplay.textContent = data.conditions;

  const humidityDisplay = document.getElementById("humidity");
  humidityDisplay.textContent = data.humidity;

  const feelsLikeDisplay = document.getElementById("feels-like");
  feelsLikeDisplay.textContent = data["feels like"];
}

const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const search = document.getElementById("location-search");
  const location = search.value.toLowerCase().trim();

  getWeatherData(location, "uk").then(
    (data) => displayWeatherData(processWeatherData(data)),
    (error) => alert(error),
  );
});

// TODO: need button to change temperature - will probably use the current location
// or the location in the search bar if no location is currently chosen
