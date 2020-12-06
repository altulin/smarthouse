import { keyboards } from "./modules/keyboard.js";
import { weatherMessage as weather } from "./modules/weather.js";
import { createTasksSunPositions } from "./modules/crontab.js";
import { readFileSync } from "fs";
import { getCounterMsg } from "./modules/counter.js"
import { createExerisesPlan } from "./modules/bodybilding.js"

import  config  from "config";
import TelegramBot from "node-telegram-bot-api";
import read from "ds18b20-raspi";


const users = Object.values(config.get(`userId`));
const line = weather.line;
const emoji = keyboards.emoji;
const bot = new TelegramBot(config.get(`token`), {polling: true});

const getTempRpi = () => {
	return (readFileSync(`/sys/class/thermal/thermal_zone0/temp`) / 1000).toPrecision(3);
};

const getTemp = (detector) => {
	return read.readC(config.get(`sensors`)[detector], 1);
};

const sendMessage = (id, message, markup) => bot.sendMessage(id, message, markup);

const sendMessageMe = (id, text, user) => {
	const userName = (user) ? `@${user}` : `no name ${emoji.face}`;
	const message = `У нас гости!${line}${text} \nid: ${id}\nuser: ${userName}`;
	bot.sendMessage(get(`myId`), message, keyboards.main);
	// return;
};

const reply = new Map([
	[`/start`, [`${line}Привет! Выбери нужный пункт ${emoji.backhand}`, keyboards.main]],
	[`${emoji.tree} Улица`, [`${line}${emoji.therm} ${getTemp`street`} °C${line}${emoji.lamp}`,	keyboards.weatherlampExitOn, keyboards.weatherlampExitOff]],
	[`${emoji.house} Дом`, [`${line}${emoji.therm} ${getTemp`house`} °C${line}${emoji.lamp} `, keyboards.houseOn, keyboards.houseOff]],
	[`Разное`, [`${line}Для связи в телеграмм: @altulin`, keyboards.other]],
	[`errorMsg`, [`${emoji.pouting}${line}Неизвестная команда: \n`, keyboards.main]],
	[`body`, [`Что будем сегодня делать?`, keyboards.sport]],
	[`gear`, [`${emoji.gear} RPi${line}${emoji.therm} ${getTemp`rpi`} °C${line}${emoji.proc} ${getTempRpi()}${line}${emoji.hot}`, keyboards.rpiOff]],
	[`counter`, [`${emoji.clock} ХВС ГВС через пробел`, keyboards.reply]]
]);

const replyGuest = new Map([
	[`/start`, [`${line}Привет! Выбери нужный пункт ${emoji.backhand}`, keyboards.main]],
	[`${emoji.tree} Улица`, [`${line}${emoji.therm} ${getTemp`street`} °C${line} ${emoji.lamp} Освещение выкл.`, keyboards.main]],
	[`${emoji.house} Дом`, [`${line}${emoji.therm} 25 °C${line}${emoji.lamp} Отопление вкл.`, keyboards.main]],
	[`Разное`, [`${line}Для связи в телеграмм: @altulin`, keyboards.other]],
	[`body`, [`Что будем сегодня делать?`, keyboards.sport]]
]);

const getResponse = () => {
	bot.on(`message`, (msg) => {
		const chatId = msg.from.id;
		const textMsg = msg.text;
		const replyMsg = msg.reply_to_message;
		const userName = msg.from.username;

		if (users.toString().includes(chatId)) {
				if (replyMsg) {
					sendMessage(config.get(`myId`), getCounterMsg(textMsg), keyboards.main);
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
					weather.getForecastWeather(chatId, bot);
				} else if (reply.has(textMsg)) {
					sendMessage(chatId, `${reply.get(textMsg)[0]}`, reply.get(textMsg)[1]);
				} else if (textMsg.split(`_`)[1] === `exercises`) {
					const section = textMsg.split(`_`)[0];
					createExerisesPlan(section).forEach(item => sendMessage(chatId, item, keyboards.main));
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
	createTasksSunPositions(bot);
	getResponse();
};

main();
