import { Bus, Events } from "../controller";
import Forecast from "./forecast";
import Search from "./search";
import Weather from "./weather";

export default async function Main() {
    const frag = document.createDocumentFragment();

    const container = document.createElement('div');
    container.className = 'flex items-center justify-center h-screen';

    const body = document.createElement('div');
    body.className = 'w-full max-w-lg select-none';

    const header = document.createElement('h1');
    header.className = 'text-7xl font-light text-blue-300 mb-8 overflow-hidden text-center max-h-40 transition-all duration-800 ease-out';
    header.textContent = 'Forecast';

    const span = document.createElement('span');
    span.className = 'inline-block bg-blue-900 text-blue-300 font-medium px-5 py-0.5 ms-4 rounded-sm uppercase';
    span.textContent = 'me';
    header.appendChild(span);

    const footer = document.createElement('div');
    footer.className = 'flex items-center justify-between gap-2 opacity-0 translate-y-2 transition-all duration-1500 ease-out';

    const logo = document.createElement('p');
    logo.className = 'text-lg font-light text-blue-300';
    logo.textContent = 'Forecast';

    const badge = document.createElement('span');
    badge.className = 'inline-block bg-blue-900 text-blue-300 font-medium px-2 py-0.2 ms-1 rounded-sm uppercase';
    badge.textContent = 'me';
    logo.appendChild(badge);

    const credit = document.createElement('p');
    credit.className = 'font-light text-slate-700';
    credit.textContent = 'Data from OpenWeatherMap';

    [logo, credit].forEach(child => footer.appendChild(child));

    const search = await Search();
    [header, search].forEach(child => body.appendChild(child));
    container.appendChild(body);
    frag.appendChild(container);

    const removeHeader = () => {
        header.classList.remove('max-h-40', 'mb-8');
        header.classList.add('max-h-0', 'opacity-0');
        header.addEventListener('transitionend', () => header.remove(), { once: true });
    };

    const weatherContainer = Weather();
    const forecastContainer = Forecast();

    Bus.addEventListener(Events.CONTENT_LOAD, () => {
        removeHeader();

        forecastContainer.preload();

        setTimeout(() => {
            [weatherContainer, forecastContainer, footer].forEach(child => body.appendChild(child));

            requestAnimationFrame(() => {
                weatherContainer.classList.remove('opacity-0', 'translate-y-2');
                weatherContainer.classList.add('opacity-100', 'translate-y-0');
                forecastContainer.classList.remove('opacity-0', 'translate-y-2');
                forecastContainer.classList.add('opacity-100', 'translate-y-0');
                footer.classList.remove('opacity-0', 'translate-y-2');
                footer.classList.add('opacity-100', 'translate-y-0');
            });

        }, 700);
    }, { once: true });

    Bus.addEventListener(Events.WEATHER_LOAD, () => {
        weatherContainer.load();
        forecastContainer.load();
    });

    Bus.addEventListener(Events.WEATHER_SUCCESS, (e) => {
        weatherContainer.update(e.detail.weather);
        forecastContainer.update(e.detail.forecast);
    });

    return frag;
}