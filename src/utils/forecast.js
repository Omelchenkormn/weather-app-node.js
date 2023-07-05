const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const API_KEY = "f5dcfe834931dc66f22d8d247f90e770";
  const BASE_URL = `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${latitude},${longitude}&units=m`;

  request(
    { url: BASE_URL, json: true },
    (
      error,
      {
        body: {
          error: bodyError,
          current: { weather_descriptions, temperature, precip },
        },
      }
    ) => {
      if (error) {
        callback("Unable to connect to weather service", undefined);
      } else if (bodyError) {
        callback("Unable to find location", undefined);
      } else {
        callback(
          undefined,
          weather_descriptions[0] +
            " " +
            "It is currently" +
            " " +
            temperature +
            " " +
            "degrees out." +
            " There is a" +
            " " +
            precip +
            "% chance of rain"
        );
      }
    }
  );
};

module.exports = forecast;
