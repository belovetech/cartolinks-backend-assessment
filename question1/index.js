const http = require('http');

// This app key should be stored in a .env file but for the sake of this test, I'll leave it here
const apiKey = '4a25e6d88cf95e8c9d1a8056016fadc4';
const city = 'lagos';

/**
 * This function makes a request to the openweathermap API to get the current temperature in Lagos
 * @param {req}: http request
 * @param {res}: http response
 */
const getCurrentLagosTemperature = async (req, res) => {
  const options = {
    hostname: 'api.openweathermap.org',
    path: `/data/2.5/weather?q=${city}&appid=${apiKey}`,
    method: 'GET',
  };

  try {
    const response = await new Promise((resolve, reject) => {
      const request = http.request(options, (response) => {
        resolve(response);
      });

      request.on('error', (error) => {
        reject(error);
      });

      request.end();
    });

    let body = '';
    response.on('data', (chunk) => {
      body += chunk;
    });

    response.on('end', () => {
      const weatherData = JSON.parse(body);
      const temperature = weatherData.main.temp;
      res.writeHead(200);
      res.end(JSON.stringify({ currentTemperature: temperature }));
    });
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end('Error retrieving weather data');
  }
};

const server = http.createServer(getCurrentLagosTemperature);
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server listening on port ${5000}`);
});
