'use strict';
process.env.NTBA_FIX_319 = 1;
const config = require(`config`);
const keyboard = require(`./modules/keyboard`);
const weather = require(`./modules/weather`);
const crontab = require(`./modules/crontab`);
const TelegramBot = require(`node-telegram-bot-api`);
const sensor = require(`ds18b20-raspi`);
const fs = require(`fs`);
const users = Object.values(config.get(`userId`));
const line = weather.weather.line;
const emoji = keyboard.objects.emoji;
const addr = config.get(`addr`);
const name = config.get(`name`);
const bot = new TelegramBot(config.get(`token`), {polling: true});

const getTempRpi = () => {
	return (fs.readFileSync(`/sys/class/thermal/thermal_zone0/temp`) / 1000).toPrecision(3);
};

const getTemp = (detector) => {
	return sensor.readC(config.get(`sensors`)[detector], 1);
};

const sendMessage = (id, message, markup) => bot.sendMessage(id, message, markup);

const sendMessageMe = (id, text, user) => {
	const userName = (user) ? `@${user}` : `no name ${emoji.face}`;
	const message = `У нас гости!${line}${text} \nid: ${id}\nuser: ${userName}`;
	bot.sendMessage(config.get(`myId`), message, keyboard.objects.main);
};

const getCounterMsg = (response) => {
	let message;
	if (response.split(` `).length === 2) {
		const hvs = response.split(` `)[0];
		const gvs = response.split(` `)[1];
		message = `Показания счетчиков \n${addr} \n${name} \nХВС: ${hvs} \nГВС: ${gvs}`;
		sendMessage(config.get(`myId`), message, keyboard.objects.main);
	}	else {
		message = `\u{1f61b} Попробуй ещё раз`;
		sendMessage(config.get(`myId`), message, keyboard.objects.main);
	}
};

const reply = new Map([
	[`/start`, [`${line}Привет! Выбери нужный пункт ${emoji.backhand}`, keyboard.objects.main]],
	[`${emoji.tree} Улица`, [`${line}${emoji.therm} ${getTemp`street`} °C${line}${emoji.lamp}`,	keyboard.objects.weatherlampExitOn, keyboard.objects.weatherlampExitOff]],
	[`${emoji.house} Дом`, [`${line}${emoji.therm} ${getTemp`house`} °C${line}${emoji.lamp} `, keyboard.objects.houseOn, keyboard.objects.houseOff]],
	[`${emoji.man} Разное`, [`${line}Для связи в телеграмм: @altulin`, keyboard.objects.other]],
	[`errorMsg`, [`${emoji.pouting}${line}Неизвестная команда: \n`, keyboard.objects.main]],
	[`body`, [`Что будем сегодня делать?`, keyboard.objects.sport]],
	[`gear`, [`${emoji.gear} RPi${line}${emoji.therm} ${getTemp`rpi`} °C${line}${emoji.proc} ${getTempRpi()}${line}${emoji.hot}`, keyboard.objects.rpiOff]],
	[`counter`, [`${emoji.clock} ХВС ГВС через пробел`, keyboard.objects.reply]]
]);

const replyGuest = new Map([
	[`/start`, [`${line}Привет! Выбери нужный пункт ${emoji.backhand}`, keyboard.objects.main]],
	[`${emoji.tree} Улица`, [`${line}${emoji.therm} ${getTemp`street`} °C${line} ${emoji.lamp} Освещение выкл.`, keyboard.objects.main]],
	[`${emoji.house} Дом`, [`${line}${emoji.therm} 25 °C${line}${emoji.lamp} Отопление вкл.`, keyboard.objects.main]],
	[`${emoji.man} Разное`, [`${line}Для связи в телеграмм: @altulin`, keyboard.objects.other]],
	[`body`, [`Что будем сегодня делать?`, keyboard.objects.sport]]
]);

const getResponse = () => {
	bot.on(`message`, (msg) => {
		const chatId = msg.from.id;
		const textMsg = msg.text;
		const replyMsg = msg.reply_to_message;
		const userName = msg.from.username;

		if (users.toString().includes(chatId)) {
				if (replyMsg) {
					getCounterMsg(textMsg);
				} else if (reply.has(textMsg)) {
					sendMessage(chatId, `${textMsg}${reply.get(textMsg)[0]}`, reply.get(textMsg)[1]);
				} else {
					sendMessage(chatId, `${reply.get(`errorMsg`)[0]}${textMsg}`, reply.get(`errorMsg`)[1]);
				}

		} else {
			if (replyGuest.has(textMsg)) {
				sendMessage(chatId, `${textMsg}${replyGuest.get(textMsg)[0]}`, replyGuest.get(textMsg)[1]);
			} else {
				sendMessage(chatId, `${reply.get(`errorMsg`)[0]}${textMsg}`, reply.get(`errorMsg`)[1]);
			}
			sendMessageMe(chatId, `${textMsg}`, userName);
		}
	});

	bot.on(`callback_query`, (msg) => {
		const chatId = msg.from.id;
		const userName = msg.from.username;
		const textMsg = msg.data;

		if (users.toString().includes(chatId)) {
			if (textMsg.includes(`weather`)) {
					weather.weather.getForecastWeather(chatId, bot);
				} else if (reply.has(textMsg)) {
					sendMessage(chatId, `${reply.get(textMsg)[0]}`, reply.get(textMsg)[1]);
				} else {
					sendMessage(chatId, `${reply.get(`errorMsg`)[0]}${textMsg}`, reply.get(`errorMsg`)[1]);
				}
		} else {

			if (replyGuest.has(textMsg)) {
				sendMessage(chatId, `${replyGuest.get(textMsg)[0]}`, replyGuest.get(textMsg)[1]);
			} else {
				sendMessage(chatId, `${reply.get(`errorMsg`)[0]}${textMsg}`, reply.get(`errorMsg`)[1]);
			}
			sendMessageMe(chatId, `${textMsg}`, userName);
		}
	});
};

const main = () => {
	crontab.cron.createTasksSunPositions(bot);
	getResponse();
};

main();
