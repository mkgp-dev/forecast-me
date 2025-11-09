import Utility from "../utility";

export default function Weather() {
    let icon = null, windDirection = null;

    const html = Utility.render(`
        <div class="w-full bg-linear-to-tr from-slate-950 to-slate-800/80 rounded-md p-4 border border-gray-800 overflow-hidden pointer-events-none mb-2 opacity-0 translate-y-2 transition-all duration-1500 ease-out">
            <div id="status" class="bg-weather lg-weather lg-mcons opacity-0 transition-opacity duration-500"></div>
            <div class="flex flex-col items-end mb-4">
                <div id="country"></div>
                <div id="date"></div>
                <div id="temperature"></div>
            </div>
            <ul class="flex justify-around items-center font-light">
                <li class="flex items-center gap-2">
                    <div id="direction" class="wi wi-wind-direction transition-[rotate] duration-500 ease-in-out text-3xl text-blue-300"></div>
                    <div id="wind"></div>
                </li>
                <li class="flex items-center gap-2">
                    <div class="wi wi-barometer text-2xl text-blue-300"></div>
                    <div id="pressure"></div>
                </li>
                <li class="flex items-center gap-2">
                    <div class="wi wi-humidity text-2xl text-blue-300"></div>
                    <div id="humidity"></div>
                </li>
            </ul>
        </div>
    `);

    const status = html.querySelector('#status');
    const country = html.querySelector('#country');
    const date = html.querySelector('#date');
    const temperature = html.querySelector('#temperature');
    const wind = html.querySelector('#wind');
    const direction = html.querySelector('#direction');
    const pressure = html.querySelector('#pressure');
    const humidity = html.querySelector('#humidity');

    const contentPlaceholder = () => {
        country.className = 'h-7 bg-gray-800 rounded-md w-50 mb-1 animate-pulse';
        country.innerHTML = '';

        date.className = 'h-3 bg-gray-800 rounded-sm w-44 mb-2 animate-pulse';
        date.textContent = '';

        temperature.className = 'h-11 bg-gray-800 rounded-md w-25 mb-1 animate-pulse';
        temperature.textContent = '';
    };

    const contentDetails = (data) => {
        country.className = 'inline-flex gap-1 text-2xl';
        country.innerHTML = `
            <span class="font-medium">${data?.name}</span>
            <span class="font-light">${Utility.country(data?.sys?.country)}</span>
        `;

        date.className = '-mt-1 font-light';
        date.textContent = `${Utility.date(data?.dt)}`;

        temperature.className = 'text-5xl font-medium text-blue-300';
        temperature.textContent = `${Math.round(data?.main?.temp)}°C`;
    };

    const listPlaceholder = () => {
        wind.className = 'h-5 bg-gray-800 rounded-sm w-12 animate-pulse';
        wind.textContent = '';

        pressure.className = 'h-5 bg-gray-800 rounded-sm w-12 animate-pulse'
        pressure.textContent = '';

        humidity.className = 'h-5 bg-gray-800 rounded-sm w-12 animate-pulse';
        humidity.textContent = '';
    };

    const listDetails = (data) => {
        const dataDirection = data?.wind?.deg ?? 0;
        direction.style.rotate = `${dataDirection}deg`;

        wind.className = '';
        wind.textContent = `${data?.wind?.speed} m/s`;

        pressure.className = '';
        pressure.textContent = `${data?.main?.pressure} hPa`;

        humidity.className = '';
        humidity.textContent = `${data?.main?.humidity}%`;
    };

    html.load = () => {
        contentPlaceholder();
        listPlaceholder();
    };

    html.update = (data) => {
        const dataIcon = data?.weather?.[0]?.icon ?? '000';
        const curr = `f${dataIcon}`;

        if (!icon) {
            icon = curr;
            status.classList.add(icon);
            setTimeout(() => {
                status.classList.remove('opacity-0');
            }, 500);
        } else if (icon !== curr) {
            status.classList.add('opacity-0');
            setTimeout(() => {
                status.classList.replace(icon, curr);
                icon = curr;
                status.classList.remove('opacity-0');
            }, 500);
        }

        setTimeout(contentDetails, 500, data);
        setTimeout(listDetails, 500, data);
    };

    return html;
}