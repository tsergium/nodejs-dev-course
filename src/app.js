const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
  res.locals.metaTags = {
    title: 'Home | Weather app'
  };
  res.render('index', {
    title: 'Weather',
    name: 'Sergiu Tomsa'
  })
})

app.get('/about', (req, res) => {
  res.locals.metaTags = {
    title: 'About | Weather app'
  };
  res.render('about', {
    title: 'About Me',
    name: 'Sergiu Tomsa'
  })
})

app.get('/help', (req, res) => {
  res.locals.metaTags = {
    title: 'Help | Weather app'
  };
  res.render('help', {
    helpText: 'This is some helpful text.',
    title: 'Help',
    name: 'Sergiu Tomsa'
  })
})

app.get('/weather', (req, res) => {
  const { address = '' } = req.query
  if (!address) {
    return res.send({
      error: 'You must provide an address'
    })
  }

  geocode(address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error })
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error })
      }

      res.send({
        forecast: forecastData,
        location,
        address
      })
    })
  })
})

app.get('/help/*', (req, res) => {
  res.locals.metaTags = {
    title: 'Help page not Found | Weather app'
  };
  res.render('404', {
    title: '404',
    name: 'Sergiu Tomsa',
    errorMessage: 'Help article not found!'
  })
})

app.get('*', (req, res) => {
  res.locals.metaTags = {
    title: 'Page not Found | Weather app'
  };
  res.render('404', {
    title: '404',
    name: 'Sergiu Tomsa',
    errorMessage: 'Page not found!'
  })
})

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`)
})