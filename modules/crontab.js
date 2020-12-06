import sunCalc from "suncalc";
import cron from "cron";
import config from "config";
import { keyboards } from "./keyboard.js";

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
	const message = `Лампу включаю`;
	bot.sendMessage(config.get(`myId`), message, keyboards.main);
};

const offLampExit = (bot) => {
	const message = `Лампу выключаю`;
	bot.sendMessage(config.get(`myId`), message, keyboards.main);
};

const сhangeTasksSun = (task, name, bot) => {
	const newSunTimes = getTimeSunPositions();
	const newTime = new cron.CronTime(`0 ${newSunTimes[`minute${name}`]} ${newSunTimes[`hour${name}`]} * * *`);
	const message = `${newSunTimes[`minute${name}`]}:${newSunTimes[`hour${name}`]}`;
	task.setTime(newTime);
	task.start();
	bot.sendMessage(config.get(`myId`), message, keyboards.main);
};

export const createTasksSunPositions = (bot) => {
	const sunTimes = getTimeSunPositions();

	const	taskSunrise = new cron.CronJob(`0 ${sunTimes.minuteSunrise} ${sunTimes.hourSunrise} * * *`, () => {
		offLampExit(bot);
	}, null, true, `Asia/${city}`);

	const	taskSunset = new cron.CronJob(`0 ${sunTimes.minuteSunset} ${sunTimes.hourSunset} * * *`, () => {
		onLampExit(bot);
	}, null, true, `Asia/${city}`);
	/* eslint-disable no-unused-vars */
	const taskCorrection = new cron.CronJob(`0 0 1 * * *`, () => {
		сhangeTasksSun(taskSunrise, `Sunrise`, bot);
		сhangeTasksSun(taskSunset, `Sunset`, bot);
	}, null, true, `Asia/${city}`);
	/* eslint-enable no-unused-vars */
};
