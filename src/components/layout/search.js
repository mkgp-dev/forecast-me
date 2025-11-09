import { Bus, Events } from "../controller";
import { currentWeatherMap, weatherForecast } from "../openweathermap/api";
import Utility from "../utility";

export default async function Search() {
    const html = Utility.render(`
        <form class="max-w-full mx-auto mb-8">
            <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                        <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
                    </svg>
                </div>
                <input type="search" id="search" class="block w-full p-4 ps-10 text-sm border border-gray-800 rounded-lg bg-slate-800/40 outline-none disabled:opacity-50" placeholder="Manila, Philippines" required />
                <button type="submit" id="submit" class="text-white absolute end-2.5 bottom-2.5 font-medium rounded-md text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:opacity-50">Search</button>
            </div>
        </form>
    `);

    const showError = (str) => {
        const error = html.querySelector('#search-error');
        error?.remove();

        const p = document.createElement('p');
        p.id = 'search-error';
        p.className = 'mt-2 text-sm text-red-400 opacity-0 transition-opacity duration-500 ease-in-out';
        p.textContent = `An error has occured, ${str.trim().replace(/\.$/, '')}.`;
        
        html.appendChild(p);

        requestAnimationFrame(() => {
            p.classList.replace('opacity-0', 'opacity-100');
        });
    };

    const removeError = () => {
        const error = html.querySelector('#search-error');
        if (!error) return;

        error.classList.replace('opacity-100', 'opacity-0');
        error.addEventListener('transitionend', () => error.remove(), { once: true });
    };
    
    const input = html.querySelector('#search');
    const btn = html.querySelector('#submit');
    html.addEventListener('submit', async(e) => {
        e.preventDefault();

        const q = input.value.trim();
        if (!q) {
            showError('search field cannot be empty');
            return;
        }

        removeError();

        input.disabled = true;
        btn.disabled = true;

        try {
            Bus.dispatchEvent(new CustomEvent(Events.CONTENT_LOAD));
            Bus.dispatchEvent(new CustomEvent(Events.WEATHER_LOAD));

            const currentWeather = await currentWeatherMap(q);
            const dailyWeather = await weatherForecast(q);
            if (currentWeather.cod !== 200 && dailyWeather.cod !== 200) {
                showError(currentWeather.message);
                return;
            }

            Bus.dispatchEvent(new CustomEvent(Events.WEATHER_SUCCESS, { detail: { weather: currentWeather, forecast: dailyWeather } }));
        } catch(error) {
            showError(error.message);
        } finally {
            setTimeout(() => {
                input.disabled = false;
                btn.disabled = false;
            }, 800);
        }
    });

    return html;
}