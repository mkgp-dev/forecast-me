export async function currentWeatherMap(q) {
    try {
        const response = await fetch(`https://api.mkgpdev.xyz/v1/weather?q=${q.trim()}`);
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
        const response = await fetch(`https://api.mkgpdev.xyz/v1/weather?forecast=${q.trim()}`);
        const d = await response.json();

        if (!response.ok) return { cod: response.status, message: d.error.message || response.statusText };

        return d.data;
    } catch(error) {
        console.error(error.message);
        return { cod: 0, message: error.message };
    }
}
