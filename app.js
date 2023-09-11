// Import Express module
const express = require('express');

// Create an Express app
const app = express();
// Import fs and path modules
const fs = require('fs');
const path = require('path');

// Define the path to the stats.json file
const statsFile = path.join(__dirname, 'stats', 'stats.json');

// Define a function to update and save the stats
function updateStats(delay) {
  // Read the stats.json file
  fs.readFile(statsFile, 'utf8', (err, data) => {
    if (err) {
      // If there is an error, log it to the console
      console.error(err);
    } else {
      // If there is no error, parse the data as JSON
      let stats = JSON.parse(data);

      // Increment the total request count by one
      stats['total-request']['total']++;

      // Add the delay to the total request time
      stats['avg-request-time']['total'] += delay;

      // Calculate the average request time by dividing the total request time by the total request count
      let avgTime = stats['avg-request-time']['total'] / stats['total-request']['total'];

      // Round the average request time to two decimal places
      avgTime = Math.round(avgTime * 100) / 100;

      // Update the average request time in the stats object
      stats['avg-request-time']['total'] = avgTime;

      // Check if the delay is less than or equal to 0.5 seconds
      if (delay <= 0.5) {
        // If yes, increment the success request count by one
        stats['success-request']['total']++;
      } else {
        // If no, increment the failed request count by one
        stats['failed-request']['total']++;
      }

      // Stringify the stats object as JSON
      let newStats = JSON.stringify(stats);

      // Write the new stats to the stats.json file
      fs.writeFile(statsFile, newStats, (err) => {
        if (err) {
          // If there is an error, log it to the console
          console.error(err);
        } else {
          // If there is no error, log a success message to the console
          console.log('Stats updated and saved');
        }
      });
    }
  });
}


// Define a port number
const port = 3000;

// Define a route for /api/v1/hello
app.get('/api/v1/hello', (req, res) => {
  // Generate a random delay between 0 and 1 second
  let delay = Math.random();

  // Set a timeout function to simulate the delay
  setTimeout(() => {
    // Send a JSON response with the message "hello-world"
    res.json({ message: 'hello-world' });
    // Call the updateStats function with the delay as an argument
updateStats(delay);

  }, delay * 1000);
});

// Define a route for /worker/stats
app.get('/worker/stats', (req, res) => {
  // Read the stats.json file from the stats folder
  const fs = require('fs');
  const path = require('path');
  const statsFile = path.join(__dirname, 'stats', 'stats.json');

  fs.readFile(statsFile, 'utf8', (err, data) => {
    if (err) {
      // If there is an error, send a status code of 500 and an error message
      res.status(500).send('Error reading stats file');
    } else {
      // If there is no error, parse the data as JSON and send it as a response
      let stats = JSON.parse(data);
      res.json(stats);
    }
  });
});

// Start the app on the port number
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
