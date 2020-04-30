const request = require('request')
const dotenv = require('dotenv');

dotenv.config();

const geocode = (address, callback) => {
  address = encodeURIComponent(address)
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.ACCESS_TOKEN}&cachebuster=1588075013027&limit=1`

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to location service!', undefined)
    } else if (body.features.length === 0) {
      callback('Unable to find location. Try another search.', undefined)
    } else {
      const { geometry, place_name } = body.features[0]
      const { coordinates } = geometry
      const latitude = coordinates[1]
      const longitude = coordinates[0]

      callback(undefined, {
        latitude,
        longitude,
        location: place_name
      })
    }
  })
}

module.exports = geocode