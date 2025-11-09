# forecast-me
A simple Weather App project submitted for The Odin Project course.

> [!TIP]
> Need help setting up TailwindCSS with Webpack?  
> Check out this [detailed guide](https://gist.github.com/mkgp-dev/66d2f158057c539dad55c24804f66f82) for step-by-step instructions or use my [boilerplate](https://github.com/mkgp-dev/webpack-tailwindcss-v4-boilerplate).

## Features
- Built with [TailwindCSS](https://tailwindcss.com) for responsive and modern UI styling
- Uses [Meteocons](https://bas.dev/work/meteocons) and [Weather Icons](https://erikflowers.github.io/weather-icons/) for clear visual weather representation
- Includes smooth transition effects such as sliding animations, 3D flip hovers, and loading placeholders for better UX
- Backend integrated with [Upstash](https://upstash.com/) for caching and rate limiting
- API key from OpenWeatherMap is securely hidden and not exposed publicly
- Displays current and forecast weather data using async API calls
- Lightweight and optimized for desktop browsers

## Goals
- Add unit conversion for better flexibility
- Display more detailed weather data
- Implement Web Storage to save and display recent user searches automatically

## Deployment
Install required libraries
```bash
  npm install
```

Build the project using **Webpack**

```bash
  npm run build
```

or safely run the project in development

```bash
  npm run dev
```
