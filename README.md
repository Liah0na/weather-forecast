# Weather Forecast

## Overview

This project is a small web application designed to strengthen practical JavaScript development skills by building a complete, interactive weather experience from the ground up. The application retrieves weather information for a user-provided location and presents current conditions, forecast summaries, daily weather details, and a temperature chart in a responsive interface.

The software demonstrates the JavaScript language through several practical features. It uses multiple JavaScript functions to organize the application logic, dynamically displays information in the browser using DOM manipulation, and processes forecast data with native ES6 array methods such as `map()`, `filter()`, and `reduce()`. It also includes a recursive function to process forecast days and uses the Chart.js library to create a visual temperature forecast.

The purpose of writing this software is to gain practical experience working with JavaScript, asynchronous programming, external APIs, JSON data, error handling, DOM manipulation, data processing, and third-party JavaScript libraries. The project also provides an opportunity to practice creating a clear and responsive user experience while keeping the code organized and understandable.

[Weather Forecast Demo Video](https://youtu.be/251SMOqUqMM)

## Development Environment

The application was developed using the following tools and technologies:

- **Visual Studio Code** - Code editor used to write and organize the project.
- **Google Chrome** - Browser used to run and test the application.
- **Git and GitHub** - Version control and source-code repository.
- **HTML5** - Used to define the structure of the application.
- **CSS3** - Used to create the responsive layout and visual presentation.
- **JavaScript (ES6+)** - Used for application logic, API requests, data processing, DOM manipulation, validation, and event handling.
- **Open-Meteo API** - Used to retrieve geocoding information and weather forecast data.
- **Chart.js** - External JavaScript library used to display maximum and minimum temperature trends as a line chart.

The application uses JavaScript features including `async`/`await`, `fetch()`, template literals, DOM manipulation, and native array methods such as `map()`, `filter()`, and `reduce()`. It also demonstrates recursion through the `processForecastDays()` function and exception handling with `try`/`catch`.

## Useful Websites

- [MDN Web Docs - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [MDN Web Docs - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN Web Docs - Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [Open-Meteo Documentation](https://open-meteo.com/en/docs)
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [Chart.js Line Chart Documentation](https://www.chartjs.org/docs/latest/charts/line.html)

## Future Work

- Add a unit selector so users can switch between Celsius and Fahrenheit.
- Add more weather information, such as wind speed, precipitation probability, sunrise, and sunset.
- Improve location search by displaying multiple matching locations when a search is ambiguous.
- Add more detailed hourly forecast information.
- Improve accessibility with additional keyboard navigation and accessibility testing.
- Add automated tests for the main JavaScript functions and user interactions.
- Improve the visual presentation with weather-specific backgrounds or additional visual indicators.
- Add a mechanism to remember the user's most recently searched locations.
- Deploy the application and continue monitoring its behavior in a production environment.
