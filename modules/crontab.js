'use strict';
(function () {
	const sunCalc = require(`suncalc`);
	const CronJob = require(`cron`).CronJob;
	const CronTime = require(`cron`).CronTime;
	const config = require(`config`);
	const keyboard = require(`./keyboard`);
	const latitude = config.get(`sun.latitude`);
	const longitude = config.get(`sun.longitude`);
	const land = config.get(`sun.height`);
	const city = config.get(`city`);

	const getTimeSunPositions = () => {
		const sunObject = sunCalc.getTimes(new Date(), latitude, longitude, land);
		const timesObject = {
			hourSunrise: sunObject.dawn.getHours(),
			minuteSunrise: sunObject.dawn.getMinutes(),
			hourSunset: sunObject.dusk.getHours(),
			minuteSunset: sunObject.dusk.getMinutes()
		};
		return timesObject;
	};

	const onLampExit = (bot) => {
		const message = `Лампу выключаю`;
		bot.sendMessage(config.get(`myId`), message, keyboard.objects.main);
	};

	const offLampExit = (bot) => {
		const message = `Лампу включаю`;
		bot.sendMessage(config.get(`myId`), message, keyboard.objects.main);
	};

	const сhangeTasksSun = (task, name, bot) => {
		const newSunTimes = getTimeSunPositions();
		const newTime = new CronTime(`0 ${newSunTimes[`minute${name}`]} ${newSunTimes[`hour${name}`]} * * *`);
		const message = `${newSunTimes[`minute${name}`]}:${newSunTimes[`hour${name}`]}`;
		task.setTime(newTime);
		task.start();
		bot.sendMessage(config.get(`myId`), message, keyboard.objects.main);
		// const newTimeRise = new cronTime(`0 ${newSunTimes.minuteSunrise} ${newSunTimes.hourSunrise} * * *`);
		// taskSunrise.setTime(newTimeRise);
		// taskSunrise.start();
		// const newTimeSet = new cronTime(`0 ${newSunTimes.minuteSunset} ${newSunTimes.hourSunset} * * *`);
		// taskSunset.setTime(newTimeSet);
		// taskSunset.start();
		// const message = `${newSunTimes.minuteSunrise}-${newSunTimes.hourSunrise} : ${newSunTimes.minuteSunset}-${newSunTimes.hourSunset}`;
		// bot.sendMessage(config.get(`myId`), message, keyboard.objects.main);
	};

	exports.cron = {
		createTasksSunPositions(bot) {
			const sunTimes = getTimeSunPositions();

			const	taskSunrise = new CronJob(`0 ${sunTimes.minuteSunrise} ${sunTimes.hourSunrise} * * *`, () => {
				offLampExit(bot);
			}, null, true, `Asia/${city}`);

			const	taskSunset = new CronJob(`0 ${sunTimes.minuteSunset} ${sunTimes.hourSunset} * * *`, () => {
				onLampExit(bot);
			}, null, true, `Asia/${city}`);
			/* eslint-disable no-unused-vars */
			const taskCorrection = new CronJob(`0 0 1 * * *`, () => {
				сhangeTasksSun(taskSunrise, `Sunrise`, bot);
				сhangeTasksSun(taskSunset, `Sunset`, bot);
				// сhangeTasksSun(taskSunrise, taskSunset, bot);
			}, null, true, `Asia/${city}`);
			/* eslint-enable no-unused-vars */
		}
	};
})();
