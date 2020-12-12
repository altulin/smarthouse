import { line } from "./weather.js";
import { emoji, keyboards } from "./keyboard.js";
import { readFileSync } from "fs";
import  config  from "config";
import read from "ds18b20-raspi";

const getTemp = (detector) => {
	return read.readC(config.get(`sensors`)[detector], 1);
};

const getTempRpi = () => {
	return (readFileSync(`/sys/class/thermal/thermal_zone0/temp`) / 1000).toPrecision(3);
};


export const reply = new Map([
	[`/start`, [`${line}Привет! Выбери нужный пункт ${emoji.backhand}`, keyboards.main]],
	[`${emoji.tree} Улица`, [`${line}${emoji.therm} ${getTemp`street`} °C${line}${emoji.lamp}`,	keyboards.weatherlampExitOn, keyboards.weatherlampExitOff]],
	[`${emoji.house} Дом`, [`${line}${emoji.therm} ${getTemp`house`} °C${line}${emoji.lamp} `, keyboards.houseOn, keyboards.houseOff]],
	[`Разное`, [`${line}Для связи в телеграмм: @altulin`, keyboards.other]],
	[`errorMsg`, [`${emoji.pouting}${line}Неизвестная команда: \n`, keyboards.main]],
	[`body`, [`Что будем сегодня делать?`, keyboards.sport]],
	[`gear`, [`${emoji.gear} RPi${line}${emoji.therm} ${getTemp`rpi`} °C${line}${emoji.proc} ${getTempRpi()}${line}${emoji.hot}`, keyboards.rpiOff]],
	[`counter`, [`${emoji.clock} ХВС ГВС через пробел`, keyboards.reply]]
]);

export const replyGuest = new Map([
	[`/start`, [`${line}Привет! Выбери нужный пункт ${emoji.backhand}`, keyboards.main]],
	[`${emoji.tree} Улица`, [`${line}${emoji.therm} ${getTemp`street`} °C${line} ${emoji.lamp} Освещение выкл.`, keyboards.main]],
	[`${emoji.house} Дом`, [`${line}${emoji.therm} 25 °C${line}${emoji.lamp} Отопление вкл.`, keyboards.main]],
	[`Разное`, [`${line}Для связи в телеграмм: @altulin`, keyboards.other]],
	[`body`, [`Что будем сегодня делать?`, keyboards.sport]]
]);
