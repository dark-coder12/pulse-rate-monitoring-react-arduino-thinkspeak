const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());

app.get('/', async (req, res) => {
  try {
    const fetch = await import('node-fetch');
    const apiURL = 'https://api.thingspeak.com/channels/2525383/feeds.json?api_key=BONUVFUO0N1P9XX0&results=10';
    const response = await fetch.default(apiURL); 

    const data = await response.json();
    console.log(data); 
    res.json(data); 
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
