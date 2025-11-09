import { addSeconds, format, compareAsc, getHours } from "date-fns";
import Utility from "../utility"

export default function Forecast() {
    const html = Utility.render(`
        <div class="grid grid-cols-5 gap-2 mb-4 opacity-0 translate-y-2 transition-all duration-1500 ease-out"></div>
    `);

    const cardContainer = () => Utility.render(`
        <div class="flip-3d group w-full">
            <div tabindex="0" class="h-36 flip-card relative rounded-md border border-gray-800 bg-slate-950 group-hover:border-blue-400">
                <div class="flip-face absolute inset-0 rounded-md p-2 flex flex-col items-center justify-center gap-1">
                    <div id="icon"></div>
                    <div id="day"></div>
                    <div id="temperature"></div>
                </div>

                <div class="flip-face flip-back absolute inset-0 rounded-md p-3 flex flex-col items-start justify-center gap-2 text-xs">
                    <div id="wind"></div>
                    <div id="pressure"></div>
                    <div id="humidity"></div>
                </div>
            </div>
        </div>
    `);

    const cardPlaceholder = (body) => {
        const icon = body.querySelector('#icon');
        icon.className = 'h-13 bg-slate-900/80 rounded-md w-15 mb-3 animate-pulse';

        const day = body.querySelector('#day');
        day.className = 'h-4 bg-slate-900/80 rounded-sm w-15 mb-2 animate-pulse';
        day.textContent = '';

        const temperature = body.querySelector('#temperature');
        temperature.className = 'h-4 bg-slate-900/80 rounded-sm w-15 animate-pulse';
        temperature.textContent = '';

        const wind = body.querySelector('#wind');
        wind.className = 'h-4 bg-slate-900/80 rounded-sm w-15 mb-2 animate-pulse';
        wind.innerHTML = '';

        const pressure = body.querySelector('#pressure');
        pressure.className = 'h-4 bg-slate-900/80 rounded-sm w-15 mb-2 animate-pulse';
        pressure.textContent = '';

        const humidity = body.querySelector('#humidity');
        humidity.className = 'h-4 bg-slate-900/80 rounded-sm w-15 mb-2 animate-pulse';
        humidity.textContent = '';
    };

    const cardDetails = (body, data) => {
        const icon = body.querySelector('#icon');
        icon.className = `bg-weather sm-weather o${data.icon}`;

        const day = body.querySelector('#day');
        day.className = '';
        day.textContent = data.day;

        const temperature = body.querySelector('#temperature');
        temperature.className = 'font-medium text-blue-300';
        temperature.textContent = `${data.temperature}°C`;

        const wind = body.querySelector('#wind');
        wind.className = 'flex items-center justify-start gap-4';

        const windIcon = document.createElement('i');
        windIcon.className = 'wi wi-wind-direction transition-[rotate] duration-500 ease-in-out text-2xl text-blue-300'
        windIcon.style.rotate = `${data.degree}deg`;
        
        const windText = document.createElement('span');
        windText.className = 'tabular-nums';
        windText.textContent = `${data.wind}`;
        [windIcon, windText].forEach(child => wind.appendChild(child));

        const pressure = body.querySelector('#pressure');
        pressure.className = 'flex items-center justify-start gap-4';

        const pressureIcon = document.createElement('i');
        pressureIcon.className = 'wi wi-barometer text-2xl text-blue-300'
        
        const pressureText = document.createElement('span');
        pressureText.className = 'tabular-nums';
        pressureText.textContent = `${data.pressure}`;
        [pressureIcon, pressureText].forEach(child => pressure.appendChild(child));

        const humidity = body.querySelector('#humidity');
        humidity.className = 'flex items-center justify-start gap-4';

        const humidityIcon = document.createElement('i');
        humidityIcon.className = 'wi wi-humidity text-2xl text-blue-300'
        
        const humidityText = document.createElement('span');
        humidityText.className = 'tabular-nums';
        humidityText.textContent = `${data.humidity}`;
        [humidityIcon, humidityText].forEach(child => humidity.appendChild(child));
    };

    const forecastList = (data) => {
        const timezone = data?.city?.timezone ?? 0;
        const localOffset = -new Date().getTimezoneOffset() * 60;
        const fixOffset = timezone - localOffset;
        const maxHour = 12;

        const localTime = addSeconds(new Date(), fixOffset);
        const dateToday = format(localTime, 'yyyy-MM-dd');

        const day = new Map();

        for (const d of data.list) {
            const localDate = addSeconds(new Date(d.dt * 1000), timezone);
            const dataDates = format(localDate, 'yyyy-MM-dd');

            if (dateToday === dataDates) continue;

            const cap = Math.abs(getHours(localDate) - maxHour);
            const best = day.get(dataDates);

            if (!best || cap < best.cap) {
                day.set(dataDates, {
                    localDate,
                    cap,
                    temperature: Math.round(d?.main?.temp ?? 0),
                    icon: d?.weather?.[0]?.icon ?? '000',
                    pressure: d?.main?.pressure ?? 0,
                    wind: d?.wind?.speed ?? 0,
                    humidity: d?.main?.humidity ?? 0,
                    degree: d?.wind?.deg ?? 0
                });
            }
        }

        return [...day.entries()]
            .sort((a, b) => compareAsc(a.localDate, b.localDate))
            .slice(0, 5)
            .map(([_, v]) => ({
                day: Utility.day(v.localDate),
                temperature: v.temperature,
                icon: v.icon,
                pressure: v.pressure,
                wind: v.wind,
                humidity: v.humidity,
                degree: v.degree
            }));
    };

    html.preload = () => {
        const frag = document.createDocumentFragment();
        for (let i = 0; i < 5; i++) frag.appendChild(cardContainer());
        html.appendChild(frag);
    }

    html.load = () => {
        for (let i = 0; i < 5; i++) cardPlaceholder(html.children[i]);
    };

    html.update = (data) => {
        const days = forecastList(data);

        for (let i = 0; i < 5; i++) {
            const node = html.children[i];
            const day = days[i];

            if (!day) continue;

            setTimeout(() => cardDetails(node, day), 500);
        }
    };

    return html;
}