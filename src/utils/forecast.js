const request = require('request')
const dotenv = require('dotenv');

dotenv.config();

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=${process.env.API_KEY}&query=${latitude},${longitude}&units=m`

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to weather service!', undefined)
    } else if (body.error) {
      callback('Unable to find location!', undefined)
    } else {
      console.log(body)
      const current = body.current
      const { temperature, feelslike, weather_descriptions, humidity } = current

      callback(undefined, `${weather_descriptions[0]}. It is currently ${temperature} degrees out. It feels like ${feelslike} degrees out. The humidity is ${humidity}.`)
    }
  })
}

module.exports = forecast