const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()
const port = 5000

app.use(cors())

app.get('/', async (req, res) => {
  try {
    const fetch = await import('node-fetch')
    const apiURL =
      'https://api.thingspeak.com/channels/2525383/feeds.json?api_key=BONUVFUO0N1P9XX0&results=15'
    const response = await fetch.default(apiURL)

    const data = await response.json()
    //console.log(data)
    res.json(data)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).send('Internal Server Error')
  }
})

app.post('/buzzer', async (req, res) => {
  console.log("Route hittin")
  try {
    const response = await axios.post('http://192.168.100.97/buzzer', {
      command: 'on',
    })
    console.log(response.data)
  } catch (error) {
    console.error(error)
  }
  console.log('Buzzer command:', req.body)
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})