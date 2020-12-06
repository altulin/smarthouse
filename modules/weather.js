import weather from "openweather-apis";
import { keyboards } from "./keyboard.js";
import config from "config";
const line = `
================
`;
weather.setLang(`ru`);
weather.setCity(config.get(`city`));
weather.setUnits(`metric`);
weather.setAPPID(config.get(`key`));

export const weatherMessage = {
	line,
	getForecastWeather(id, bot) {
		weather.getWeatherForecastForDays(3, (err, obj) => {
			if (err) {
				bot.sendMessage(id, `Что-то пошло не так!`, keyboards.main);
			}
			let forecast = `Прогноз погоды :${line}`;
			obj.list.forEach((item) => {
				const date = new Date(item.dt * 1000);
				forecast = forecast +
					`${date.getDate()}.${(date.getMonth() + 1)}.${date.getFullYear()}\n` +
					`${item.weather[0].description}\n` +
					`ночью : ${item.temp.night} °C\n` +
					`днем : ${item.temp.day} °C${line}`;
			});
			bot.sendMessage(id, forecast, keyboards.main);
		});
	}
};
