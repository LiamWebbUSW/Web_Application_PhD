
# 🚌 Web Application for Public Transport Accessibility Analysis

This repository contains the open-source code developed as part of Liam Webb's PhD research, *"Applying Web-based Technologies to Better Understand Access to Services Using Public Transport"*, completed at the University of South Wales.

The aim of this project is to create a highly interactive, browser-based application that enables planners, policymakers, and community members to explore the impacts of public transport network changes on spatial accessibility. The tool integrates routing engines, GIS visualisation, and open data to support scenario modelling and public transport planning, especially in rural and underserved areas.

## 🔍 Key Features

- **Isochrone Mapping**: Visualise catchment areas based on time, walking distance, and available public transport.
- **"What-if" Scenarios**: Simulate service changes such as adding/removing routes or agencies and assess accessibility outcomes.
- **GTFS Integration**: Modify General Transit Feed Specification (GTFS) data directly within the web interface.
- **Routing Engines**: Use both OpenTripPlanner (OTP) and R5 for multimodal transport routing and analysis.
- **Interactive Web Mapping**: Built with Leaflet.js, Chart.js, and Highcharts for responsive visualisation.
- **Database-Backed**: Powered by PostgreSQL + PostGIS for geospatial storage and queries.

## 🧱 Repository Structure

```
Web_Application_PhD/
├── src/
│   ├── CSS/                  # Stylesheets for OTP and R5 interfaces
│   ├── HTML/                 # HTML files for front-end interface
│   ├── JS/                   # JavaScript and Chart.js scripts
│   ├── PHP/                  # Backend PHP scripts (e.g. for POIs, GTFS editing, OTP querying)
│   ├── R/                    # R scripts for R5 analysis and GTFS conversion
│   └── config/               # PostgreSQL, Geoserver, OTP config files
├── gtfs/                     # Example GTFS feeds used for analysis
├── docs/                     # Diagrams and images referenced in thesis
└── README.md
```

## ⚙️ Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Leaflet.js, Chart.js, Highcharts
- **Backend**: PHP, PostgreSQL/PostGIS
- **Routing Engines**: [OpenTripPlanner](https://www.opentripplanner.org/), [R5 via r5r](https://github.com/ipeaGIT/r5r)
- **Geospatial Server**: Geoserver
- **Data Formats**: GTFS (General Transit Feed Specification)

## 🚀 How to Run

**Note**
This version of the application does not include and of the external JS files from plugins that were utlised 
   - Chart.JS
   - FileSaver
   - Turf
**External plugins**
   - Leaflet
   - BootStrap
   - jquery
   - AJAX
   - leaflet-geosearch
   - leaflet markercluster


1. **Clone the Repository**
   ```bash
   git clone https://github.com/LiamWebbUSW/Web_Application_PhD.git
   ```

2. **Set Up the Environment**
   - Install and configure PostgreSQL with PostGIS
   - Set up [OpenTripPlanner](https://docs.opentripplanner.org/en/latest/) and/or [R5](https://docs.conveyal.com/)
   - Install and configure [Geoserver](http://geoserver.org/)

3. **Launch a Local Server**
   - Run a PHP server or deploy using Apache/Nginx
   - Ensure Java-based services (OTP, R5) are running

4. **Open in Browser**
   - Navigate to `localhost/src/HTML/otp.html` or `r5.html` to start exploring

## 📘 Thesis Reference

If you're citing this tool or using it in your research, please reference:

**Webb, L. (2024)** *Applying Web-based Technologies to Better Understand Access to Services Using Public Transport*. University of South Wales. PhD Thesis.  

## 📜 License

This project is released under the MIT License. See [LICENSE](LICENSE) for more details.

## 🤝 Acknowledgements

This work was supported by the University of South Wales and WISERD (Wales Institute of Social and Economic Research and Data). Special thanks to my supervisors and Transport for Wales for their feedback and support during development.
