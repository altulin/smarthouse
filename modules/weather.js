'use strict';
(function () {
	const weather = require(`openweather-apis`);
	const keyboard = require(`./keyboard`);
	const config = require(`config`);
	const line = `
	================
	`;
	// const emoji = keyboard.objects.emoji;
	weather.setLang(`ru`);
	weather.setCity(config.get(`city`));
	weather.setUnits(`metric`);
	weather.setAPPID(config.get(`key`));

	exports.weather = {
		line,
		getWeather(id, bot) {
			weather.getWeatherForecastForDays(3, (err, obj) => {
				if (err) {
					bot.sendMessage(id, `Что-то пошло не так!`, keyboard.objects.main);
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
				bot.sendMessage(id, forecast, keyboard.objects.main);
			});
		}
	};
})();
