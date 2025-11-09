import { format, fromUnixTime } from "date-fns";
import Main from "./layout";

export default class Utility {
    static async load() {
        const app = document.getElementById('app');
        app.appendChild(await Main());
    }

    static render(html) {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.firstElementChild;
    }

    static country = (code) => code ? new Intl.DisplayNames(['en'], { type: 'region' }).of(code) ?? code : '';

    static date = (unix) => format(fromUnixTime(unix, 0), "EEEE, MMMM dd");

    static day = (date) => format(date, 'EEE');
}