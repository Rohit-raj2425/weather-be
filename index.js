require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { default: axios } = require('axios');

// Initialize the app
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(bodyParser.json());

app.get('/api/v1/weather', async (req, res) => {
  try {
    const { cityName } = req.query;
    if (!cityName) {
      return res.status(400).json({ error: 'cityName are required' });
    }
    const weatherData = await axios.get(`${process.env.BASE_URL}/current.json?key=${process.env.API_KEY}&q=${cityName}&aqi=yes`);
    console.log(weatherData.status);

    const response = {
      temperature: weatherData?.data?.current?.temp_c || null,
      condition: weatherData?.data?.current?.condition.text || null,
      humidity: weatherData?.data?.current?.humidity || null,
    }

    res.status(200).json({ data: response, message: `Weather data fetched successfully.` });
  } catch (error) {
    if(error?.response?.status === 400)
      return res.status(400).json({ error: 'No matching city found.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
