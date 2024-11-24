import "./styles.css";

async function getWeatherData(location, unitGroup) {
  const weatherData = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unitGroup}&elements=datetime%2Ctemp%2Cfeelslike%2Chumidity%2Cwindspeedmean%2Cconditions&include=current&key=J34LGPNZGQ95XYK8YUGDAAGSY&contentType=json`,
    { mode: "cors" },
  );

  if (weatherData.status == 200) {
    const jsonData = await weatherData.json();
    console.log(jsonData);
    return jsonData;
  } else if (weatherData.status == 400) {
    throw `"${location}" is not a valid location`;
  }

  throw new Error(weatherData.status);
}

getWeatherData("london", "uk").catch((error) => {
  console.log(error);
});
