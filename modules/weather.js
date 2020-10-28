(function () {
	const weather = require('openweather-apis');
	const keyboard = require(`./keyboard`);
	const config = require('config');
	const ln = `
	=================
	`;
	const emoji = keyboard.objects.emoji;
	weather.setLang('ru');
	weather.setCity(config.get("city"));
	weather.setUnits('metric');
	weather.setAPPID(config.get("key"));
	exports.getWeather = (id, bot) => {
		weather.getWeatherForecastForDays(3, (err, obj) => {
				if (err) {
					bot.sendMessage(id, `Что-то пошло не так!`, keyboard.objects.main);
				}
        let forecast = `Прогноз погоды :${ln}`;
        for (let i = 0; i < obj.list.length; i++) {
        	const date = new Date(obj.list[i].dt *1000);
        	forecast = forecast +
        		`${date.getDate()}.${(date.getMonth() + 1)}.${date.getFullYear()}\n` +
        		`${obj.list[i].weather[0].description}\n` +
        		`ночью : ${obj.list[i].temp.night} °C\n` +
        		`днем : ${obj.list[i].temp.day} °C${ln}`
        }
        bot.sendMessage(id, forecast, keyboard.objects.main);
    });
	};
})();
   