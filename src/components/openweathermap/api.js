export async function currentWeatherMap(q) {
    try {
        const response = await fetch(`https://mkgpdev-backend.vercel.app/api/owm/weather?q=${q.trim()}`);
        const d = await response.json();

        if (!response.ok) return { cod: response.status, message: d.error.message || response.statusText };

        return d.data;
    } catch(error) {
        console.error(error.message);
        return { cod: 0, message: error.message };
    }
}

export async function weatherForecast(q) {
    try {
        const response = await fetch(`https://mkgpdev-backend.vercel.app/api/owm/forecast?q=${q.trim()}`);
        const d = await response.json();

        if (!response.ok) return { cod: response.status, message: d.error.message || response.statusText };

        return d.data;
    } catch(error) {
        console.error(error.message);
        return { cod: 0, message: error.message };
    }
}