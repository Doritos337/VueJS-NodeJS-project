
const app = new Vue({
  el: '#app',
  data: {
    count: 100,
    vehicles: [],
    map: null,
    vehiclesLayer: null,
  },
  computed: {
    averageSpeed() {
      if (this.vehicles.length === 0) return 0;
      const totalSpeed = this.vehicles.reduce((sum, vehicle) => sum + vehicle.speed, 0);
      return (totalSpeed / this.vehicles.length).toFixed(2);
    },
    vehiclesUnder50() {
      return this.countSpeedRange(this.vehicles, 0, 49);
    },
    vehiclesBetween50And80() {
      return this.countSpeedRange(this.vehicles, 50, 79);
    },
    vehiclesAbove80() {
      return this.countSpeedRange(this.vehicles, 80, Infinity);
    },
  },
  methods: {
    generateVehicles() {
      if (this.count < 100 || this.count > 500) {
        alert('Invalid count. Please enter a number between 100 and 500.');
        return;
      }
    
      axios
        .get(`http://localhost:3000/vehicles?count=${this.count}`)
        .then((response) => {
          this.vehicles = response.data;
          this.updateVehiclesOnMap();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    countSpeedRange(vehicles, minSpeed, maxSpeed) {
      return vehicles.filter((vehicle) => vehicle.speed >= minSpeed && vehicle.speed <= maxSpeed).length;
    },
    getVehicleClass(vehicle) {
      if (vehicle.speed < 50) return 'green';
      if (vehicle.speed < 80) return 'orange';
      return 'red';
    },
    updateVehiclesOnMap() {
      this.vehiclesLayer.getSource().clear();

      this.vehicles.forEach((vehicle) => {
        const marker = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([vehicle.latitude, vehicle.longitude])),
        });

        let color;
        if (vehicle.speed < 50) color = 'green';
        else if (vehicle.speed < 80) color = 'orange';
        else color = 'red';

        marker.setStyle(
          new ol.style.Style({
            image: new ol.style.Circle({
              radius: 5,
              fill: new ol.style.Fill({ color }),
            }),
            text: new ol.style.Text({
              text: vehicle.speed.toString(),
              fill: new ol.style.Fill({ color: 'black' }),
            }),
          })
        );

        this.vehiclesLayer.getSource().addFeature(marker);
      });
    },
    initMap() {
      this.map = new ol.Map({
        layers: [
          new ol.layer.Tile({
            source: new ol.source.TileJSON({
              url: 'https://api.maptiler.com/maps/basic-v2/tiles.json?key=cDK2WaroaH9jSoMSgxSn',
              tileSize: 512,
            })
          }),
        ],
        target: 'map',
        view: new ol.View({
          center: ol.proj.fromLonLat([18.77048, 49.21583]),
          zoom: 13,
        }),
      });

      this.vehiclesLayer = new ol.layer.Vector({
        source: new ol.source.Vector(),
      });

      this.map.addLayer(this.vehiclesLayer);
    },
  },
  mounted() {
    this.initMap();
    setInterval(this.generateVehicles, 30000);
  },
});