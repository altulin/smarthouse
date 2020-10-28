'use strict';
process.env.NTBA_FIX_319 = 1;
const config = require(`config`);
const keyboard = require(`./modules/keyboard`);
const weather = require(`./modules/weather`);
const TelegramBot = require(`node-telegram-bot-api`);
const Gpio = require(`onoff`).Gpio;
const sensor = require(`ds18b20-raspi`);
const fs = require('fs');
const users = Object.values(config.get(`user_id`));
const line = `
	=================
	`;
const ln = `
	=================
	`;
const emoji = keyboard.objects.emoji;
const addr = config.get("addr"); 
const name = config.get("name");

const bot = new TelegramBot(config.get(`token`), {polling: true});
// const heatingrpi = new Gpio(17, 'out');//обогрев бокса
// const lampexit = new Gpio(18, 'out');//лампа вход
// const house = new Gpio(15, 'out');//обогрев дом

const getTempRpi = () => {
	return (fs.readFileSync(`/sys/class/thermal/thermal_zone0/temp`) / 1000).toPrecision(3);
}

const getTemp = (detector) => {
	return sensor.readC(config.get(`sensors`)[detector], 1);
};

const sendMessage = (id, message, markup) => bot.sendMessage(id, message, markup);

const checkGpio = (arg) => {
	let state;
	arg.readSync() === 0 ? state = ` выкл.` : state = ` вкл.`;
	return state;
};

const getResponse = () => {
	bot.on(`message`, (msg) => {
		const chatId = msg.from.id;
		const userName = msg.from.username;
		const textMsg = msg.text;
		let message = ``;
		if (users.toString().includes(chatId)) {
			if (textMsg.includes(`/start`)) {
				message = `Привет! Выбери нужный пункт ${emoji.backhand}`;
				sendMessage(chatId, message, keyboard.objects.main)
			}
			
			if (textMsg.includes(`Улица`)) {
				message = `${textMsg}${line}${emoji.therm} ${getTemp`street`} °C${ln}${emoji.lamp} `;
				sendMessage(chatId, message, keyboard.objects.weatherlampExitOn);
			}

			if (textMsg.includes(`Дом`)) {
				message = `${textMsg}${line}${emoji.therm} ${getTemp`house`} °C${ln}${emoji.lamp} `;
				sendMessage(chatId, message, keyboard.objects.houseOff);
			}

			if (textMsg.includes(`Разное`)) {
				message = `${textMsg}${line}@altulin`;
				sendMessage(chatId, message, keyboard.objects.other);
			}

			if (msg.reply_to_message) {
				if (msg.reply_to_message.text.includes(`${emoji.clock} ХВС ГВС через пробел`)) {
					if (textMsg.split(' ').length === 2) {
						const hvs = textMsg.split(' ')[0];
						const gvs = textMsg.split(' ')[1];
						message = `Показания счетчиков \n${addr} \n${name} \nХВС: ${hvs} \nГВС: ${gvs}`;
						sendMessage(chatId, message, keyboard.objects.main);
					}	else {
						message = `\u{1f61b} Попробуй ещё раз`;
						bot.sendMessage(chatId, message, keyboard.objects.main);
					}
				}
			}
		} else {
			if (textMsg.includes(`Улица`)) {
				message = `${textMsg}${line}${emoji.therm} ${getTemp`street`} °C${ln}${emoji.lamp} Освещение выкл.`;
				sendMessage(chatId, message, keyboard.objects.main);
			}

			if (textMsg.includes(`Дом`)) {
				message = `${textMsg}${line}${emoji.therm} 25 °C${ln}${emoji.lamp} Отопление вкл.`;
				sendMessage(chatId, message, keyboard.objects.main);
			}

			if (textMsg.includes(`Разное`)) {
				message = `${textMsg}${line}@altulin`;
				sendMessage(chatId, message, keyboard.objects.other);
			}
		}
	});

	bot.on("callback_query", (msg) => {
		const chatId = msg.from.id;
		const userName = msg.from.username;
		const dataMsg = msg.data;
		let message = ``;

		if (users.toString().includes(chatId)) {
			
			if(dataMsg.includes(`body`)) {
				message = `Что будем сегодня делать?`;
				sendMessage(chatId, message, keyboard.objects.sport);
			}

			if(dataMsg.includes(`gear`)) {
				message = `${emoji.gear} RPi${line}${emoji.therm} ${getTemp`rpi`} °C${ln}${emoji.proc} ${getTempRpi()}${ln}${emoji.hot}`;
				sendMessage(chatId, message, keyboard.objects.rpiOff);
			}

			if(dataMsg.includes(`counter`)) {
				message = `${emoji.clock} ХВС ГВС через пробел`;
				sendMessage(chatId, message, keyboard.objects.reply);
			}
		} else {
			if(dataMsg.includes(`body`)) {
				message = `Что будем сегодня делать?`;
				sendMessage(chatId, message, keyboard.objects.sport);
			}
		}
	});
}

const main = () => {
	getResponse();
	weather.getWeather(87307445, bot);
};

main();
