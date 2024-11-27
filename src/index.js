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

const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const search = document.getElementById("location-search");
  const location = search.value.toLowerCase().trim();

  getWeatherData(location, "uk").then(
    (data) => console.log(processWeatherData(data)),
    (error) => console.log(error),
  );
});
