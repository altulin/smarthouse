import weather from "openweather-apis";
import { keyboards } from "./keyboard.js";
import config from "config";
export const line = `
================
`;
weather.setLang(`ru`);
weather.setCity(config.get(`city`));
weather.setUnits(`metric`);
weather.setAPPID(config.get(`key`));




export const getForecast = weather.getWeatherForecastForDays(3, (err, obj) => {
	if (err) {
		// bot.sendMessage(id, `Что-то пошло не так!`, keyboards.main);
		console.log(`Что-то пошло не так!`)
	} else {

	}

	// console.log(obj.list);

	// const test = new Array(obj.list.length).fill(` `).map((item, i) =>{
	// 	const date =  new Date(obj.list[i].dt * 1000);
	// 	return `${date.getDate()}.${(date.getMonth() + 1)}.${date.getFullYear()}\n` +
	// 		`${obj.list[i].weather[0].description}\n` +
	// 		`ночью : ${obj.list[i].temp.night} °C\n` +
	// 		`днем : ${obj.list[i].temp.day} °C${line}`
	// }).join(` `);

	// let forecast = `Прогноз погоды :${line}`;
	// obj.list.forEach((item) => {
	// 	const date = new Date(item.dt * 1000);
	// 	forecast = forecast +
	// 		`${date.getDate()}.${(date.getMonth() + 1)}.${date.getFullYear()}\n` +
	// 		`${item.weather[0].description}\n` +
	// 		`ночью : ${item.temp.night} °C\n` +
	// 		`днем : ${item.temp.day} °C${line}`;
	// });
	// bot.sendMessage(id, forecast, keyboards.main);
	// console.log(test)
	// return test
});
