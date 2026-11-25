import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Chart from "chart.js/auto";
import "./style.css";

// ======================================
// 1. ISS LIVE API
// ======================================

const API_URL =
  "https://api.wheretheiss.at/v1/satellites/25544";

  // Latest ISS position shared with other features
let latestISSPosition = null;

// Altitude history storage
const altitudeHistory = [];

let altitudeChart = null;
// ======================================
// 2. INITIALIZE WORLD MAP
// ======================================

const map = L.map("map", {
  worldCopyJump: true
}).setView([20, 0], 2);

// Map tiles
L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 18
  }
).addTo(map);

// ======================================
// 3. CREATE ISS MARKER
// ======================================

const issIcon = L.divIcon({
  className: "iss-custom-icon",
  html: '<div class="iss-pulse">🛰️</div>',
  iconSize: [44, 44],
  iconAnchor: [22, 22]
});

const issMarker = L.marker([0, 0], {
  icon: issIcon
}).addTo(map);

issMarker.bindPopup(
  "<b>International Space Station</b><br>Currently orbiting Earth"
);

issMarker.bindPopup(
  "<b>International Space Station</b><br>Live orbital position"
);

// ======================================
// 4. ORBITAL TRAIL
// ======================================

let trailPoints = [];

const orbitalTrail = L.polyline([], {
  color: "#00e5ff",
  weight: 2,
  opacity: 0.85
}).addTo(map);


// ======================================
// LIVE ALTITUDE CHART
// ======================================

function updateAltitudeChart(altitude) {

  const canvas = document.getElementById("altitudeChart");

  if (!canvas || !Number.isFinite(altitude)) {
    return;
  }

  // Store latest measurement
  altitudeHistory.push({
    time: new Date().toLocaleTimeString(),
    altitude: altitude
  });

  // Keep only the latest 30 measurements
  if (altitudeHistory.length > 30) {
    altitudeHistory.shift();
  }

  const labels = altitudeHistory.map(item => item.time);

  const values = altitudeHistory.map(item => item.altitude);

  // Create chart only once
  if (!altitudeChart) {

    altitudeChart = new Chart(canvas, {

      type: "line",

      data: {
        labels: labels,

        datasets: [{
          label: "ISS Altitude (km)",
          data: values,

          borderColor: "#55e6ff",
          backgroundColor: "rgba(85, 230, 255, 0.12)",

          borderWidth: 3,
          fill: true,
          tension: 0.35,

          pointRadius: 3,
          pointHoverRadius: 6
        }]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        animation: false,

        plugins: {
          legend: {
            labels: {
              color: "#ffffff"
            }
          },

          tooltip: {
            enabled: true
          }
        },

        scales: {

          x: {
            ticks: {
              color: "#9eacc5",
              maxTicksLimit: 7
            },

            grid: {
              color: "rgba(255,255,255,0.05)"
            }
          },

          y: {
            title: {
              display: true,
              text: "Altitude (km)",
              color: "#55e6ff"
            },

            ticks: {
              color: "#9eacc5"
            },

            grid: {
              color: "rgba(255,255,255,0.07)"
            }
          }
        }
      }
    });

  } else {

    // Update existing chart
    altitudeChart.data.labels = labels;
    altitudeChart.data.datasets[0].data = values;

    altitudeChart.update("none");
  }
}

// ======================================
// 5. FETCH LIVE ISS POSITION
// ======================================

async function trackISS() {

  const status = document.getElementById("status");

  try {

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("ISS API request failed");
    }

    const data = await response.json();

    const latitude = Number(data.latitude);
    const longitude = Number(data.longitude);
    // Store latest ISS coordinates for distance calculator
latestISSPosition = {
  latitude: latitude,
  longitude: longitude
};

    if (!Number.isFinite(latitude) ||
        !Number.isFinite(longitude)) {
      throw new Error("Invalid ISS coordinates");
    }

    // Update ISS marker
    issMarker.setLatLng([latitude, longitude]);

    // Reset trail when crossing the date line
    if (
      trailPoints.length > 0 &&
      Math.abs(
        longitude - trailPoints[trailPoints.length - 1][1]
      ) > 180
    ) {
      trailPoints = [];
    }

    // Store last 20 positions
    trailPoints.push([latitude, longitude]);

    if (trailPoints.length > 20) {
      trailPoints.shift();
    }

    // Update orbital trail
    orbitalTrail.setLatLngs(trailPoints);

    // ==================================
    // 6. UPDATE DASHBOARD STATISTICS
    // ==================================

    document.getElementById("latitude").textContent =
      latitude.toFixed(4) + "°";

    document.getElementById("longitude").textContent =
      longitude.toFixed(4) + "°";

    document.getElementById("altitude").textContent =
      data.altitude.toFixed(2) + " km";
      // Update live altitude history chart
updateAltitudeChart(Number(data.altitude));

    document.getElementById("speed").textContent =
      (data.velocity / 3600).toFixed(2) + " km/s";

    // Update timestamp
    document.getElementById("updated").textContent =
      new Date(data.timestamp * 1000).toLocaleTimeString();

    // Connection status
    status.textContent = "● LIVE CONNECTION ACTIVE";
    status.style.color = "#00ff99";

  } catch (error) {

    console.error("ISS Tracking Error:", error);

    status.textContent = "● CONNECTION ERROR - RETRYING";
    status.style.color = "#ff6666";

  }
}

// ======================================
// 7. START LIVE TRACKING
// ======================================

// Fetch immediately
trackISS();

// Refresh every 5 seconds
setInterval(trackISS, 5000);

// ======================================
// 8. ASTRONAUT CREW INFORMATION
// ======================================


// ======================================
// 8. ISS ASTRONAUT CREW DASHBOARD
// ======================================

const CREW_API =
  "https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json";

async function loadCrew() {

  const crewList = document.getElementById("crew-list");
  const crewCount = document.getElementById("crew-count");

  try {

    const response = await fetch(CREW_API);

    if (!response.ok) {
      throw new Error("Crew API request failed");
    }

    const data = await response.json();

    // Only show astronauts aboard the ISS
    const issCrew = data.people.filter(
      person => person.iss === true
    );

    crewCount.textContent =
      `${issCrew.length} ASTRONAUTS ABOARD`;

    crewList.replaceChildren();

    if (issCrew.length === 0) {
      crewList.textContent =
        "No ISS crew information available.";
      return;
    }

    // Create astronaut cards
    issCrew.forEach(person => {

      const card = document.createElement("div");
      card.className = "crew-card";

      const name = document.createElement("h3");
      name.textContent = `👨‍🚀 ${person.name}`;

      const agency = document.createElement("p");
      agency.textContent =
        `Space Agency: ${person.agency || "Not available"}`;

      const position = document.createElement("p");
      position.textContent =
        `Position: ${person.position || "Not available"}`;

      const spacecraft = document.createElement("p");
      spacecraft.textContent =
        `Spacecraft: ${person.spacecraft || "Not available"}`;

      card.append(name, agency, position, spacecraft);

      crewList.appendChild(card);

    });

  } catch (error) {

    console.error("Crew loading error:", error);

    crewCount.textContent = "DATA UNAVAILABLE";

    crewList.textContent =
      "Unable to load astronaut information. Please try again later.";

  }

}

// Load crew information
loadCrew();

// Refresh crew information every 30 minutes
setInterval(loadCrew, 30 * 60 * 1000);

/* =====================================
   9. CITY DISTANCE CALCULATOR
===================================== */

// Calculate great-circle distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {

  const earthRadius = 6371;

  const toRadians = degrees => degrees * Math.PI / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}


// Search city and calculate distance
async function searchCity() {

  const cityInput = document.getElementById("city-input");
  const result = document.getElementById("distance-result");

  const city = cityInput.value.trim();

  if (!city) {
    result.textContent = "Please enter a city name.";
    return;
  }

  if (!latestISSPosition) {
    result.textContent = "Waiting for live ISS coordinates. Try again shortly.";
    return;
  }

  result.textContent = "Searching for city...";

  try {

    const url =
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Geocoding request failed");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      result.textContent = "City not found. Try another city.";
      return;
    }

    const location = data.results[0];

    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      latestISSPosition.latitude,
      latestISSPosition.longitude
    );

    result.textContent =
      `The ISS is approximately ${distance.toFixed(2)} km from ${location.name}, ${location.country}.`;

  } catch (error) {

    console.error("Distance calculation error:", error);

    result.textContent =
      "Unable to calculate distance. Please try again.";

  }
}


// Button click
document
  .getElementById("search-city")
  .addEventListener("click", searchCity);


// Allow Enter key
document
  .getElementById("city-input")
  .addEventListener("keydown", event => {
    if (event.key === "Enter") {
      searchCity();
    }
  });
