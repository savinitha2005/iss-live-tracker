
# ISS Live Tracker

A real-time International Space Station tracking application that visualizes the ISS position, orbital movement, telemetry and astronaut crew information through an interactive dashboard.

## Project Overview

ISS Live Tracker provides real-time information about the International Space Station through a web-based monitoring dashboard.

The application includes live geographical coordinates, altitude and orbital velocity, interactive map visualization, astronaut crew information, altitude history and a city-to-ISS distance calculator.

## Features

- **Live ISS Tracking:** Retrieves current ISS latitude and longitude.
- **Interactive World Map:** Displays the ISS position using Leaflet.js.
- **Orbital Trail:** Visualizes recently recorded ISS positions.
- **Live Telemetry:** Displays altitude and orbital velocity.
- **Altitude Monitoring:** Visualizes collected altitude measurements using Chart.js.
- **Astronaut Crew Dashboard:** Displays astronaut information from a public crew data source.
- **Distance Calculator:** Calculates the great-circle ground distance between a selected city and the ISS ground-projected position.
- **Responsive Interface:** Supports desktop and mobile screens.

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Structure |
| CSS3 | Styling and responsive design |
| JavaScript | Application logic |
| Vite | Development environment |
| Leaflet.js | Interactive mapping |
| Chart.js | Data visualization |
| Where The ISS At API | ISS position and telemetry |
| Open-Meteo Geocoding API | City coordinate lookup |
| Haversine Formula | Geographic distance calculation |

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the project

```bash
cd iss-live-tracker
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the application

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

## APIs and Data Sources

- ISS Position: https://api.wheretheiss.at/v1/satellites/25544
- Astronaut Information: https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json
- Geocoding: https://geocoding-api.open-meteo.com/

## Project Structure

```text
iss-live-tracker/
├── public/
├── src/
│   ├── main.js
│   └── style.css
├── index.html
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Future Improvements

- ISS pass prediction for selected locations.
- Historical orbital trajectory visualization.
- Improved astronaut crew information and data validation.
- Additional telemetry analysis.

## Author

Developed as a personal space-data visualization and web development project.
