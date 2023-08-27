const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static('public'));

function generateVehicles(count) {
  const vehicles = [];
  for (let i = 0; i < count; i++) {
    const speed = getRandomSpeed();
    const id = i + 1;
    const name = `${id}-vehicle`;
    const latitude = getRandomCoordinate(18.67861, 18.79271);
    const longitude = getRandomCoordinate(49.19171, 49.23841);
    vehicles.push({ speed, id, name, latitude, longitude });
  }
  return vehicles;
}

function getRandomSpeed() {
  return Math.floor(Math.random() * 96) + 5;
}

function getRandomCoordinate(min, max) {
  return Math.random() * (max - min) + min;
}

app.get('/vehicles', (req, res) => {
  const count = parseInt(req.query.count);
  if (count) {
    const vehicles = generateVehicles(count);
    res.json(vehicles);
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port: http://localhost:${port}`);
});
