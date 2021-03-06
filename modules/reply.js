import { line, getForecast } from "./weather.js";
import { emoji } from "./utils.js";
import { createExerisesPlan } from "./bodybuilding.js";
import { readFileSync } from "fs";
import config from "config";
import read from "ds18b20-raspi";


// температура с датчика ds18b20
const getTemp = (detector) => {
  return `${emoji.therm} ${read.readC(config.get(`sensors`)[detector], 1)}`;
};

// const getTempRpi = () => {
//   return (readFileSync(`/sys/class/thermal/thermal_zone0/temp`) / 1000).toPrecision(3);
// };

// команды разрешенные для гостей
export const access = new Set([
  `street`, `other`, `back`, `triceps`, `legs`, `shoulders`, `chest`, `biceps`, 'athlete', `/start`
]);


// список включаемого оборудования
export const power = new Map([
  [`street`, [`streetLamp`]],
  [`house`, [`houseHeat`]]
]);


// список датчиков
const sensors = new Map([
  [`street`, [`streetTemp`]],
  [`house`, [`houseTemp`]]
]);


// текст для команд
const text = new Map([
  [`other`, `Для связи в телеграмм: @altulin`],
  [`errorMsg`, `Эту команду я не знаю`],
  [`access`, `Эта команда для вас не доступна`],
  [`/start`, `Привет`]
]);


// список команд спорт
export const exersiseTypes = new Set([
  `back`, `triceps`, `legs`, `shoulders`, `chest`, `biceps`
]);


// список спец команд
export const special = new Set([`errorMsg`, `access`, `start`]);


// список команд с инлайн клавиатурой
export const inline = new Map([
  [`street`, [`weather`]],
  [`house`, [`gear`, `counter`]],
  [`other`, ['athlete']]
]);

// список всех команд
export const reply = new Map([
  [`/start`, `start`],
  [`${emoji.tree} Улица`, `street`],
  [`${emoji.house} Дом`, `house`],
  [`Разное`, `other`],
  [`Спина`, `back`],
  [`Трицепс`, `triceps`],
  [`Ноги`, `legs`],
  [`Плечи`, `shoulders`],
  [`Грудь`, `chest`],
  [`Бицепс`, `biceps`],
  [`Погода`, `weather`],
  [`Настройки`, `gear`],
  [`Счетчики`, `counter`],
  [`Качалка`, 'athlete']

]);

export const getText = (msg) => {
  const message = (special.has(msg)) ? [] : [msg];
  const replyItem = reply.get(msg);

  if (special.has(msg)) {
    // спец текст
    message.push(text.get(msg));
  }

  if (text.has(replyItem)) {
    // текст
    message.push(text.get(replyItem));
  }

  if (sensors.has(replyItem)) {
    // датчики
    const listSensors = sensors.get(replyItem);
    for (const item of listSensors) {
      message.push(getTemp(item));
    }
  }

  if (exersiseTypes.has(replyItem)) {
    // спорт
    message.push(createExerisesPlan(replyItem));
  }

  if (replyItem === `weather`) {
    // message.push(getForecast());
  }
  return message.join(`${line}`);
};

const promise = new Promise(function (resolve, reject) {

})


// const answers = new Map([
//   [
//     `/start`,
//     [`${line}Привет! Выбери нужный пункт ${emoji.backhand}`, keyboards.main, `guest`]
//   ],
//   [
//     `${emoji.tree} Улица`,
//     [`${line}${emoji.therm} ${getTemp`street`} °C${line}${emoji.lamp}`, keyboards.weatherlampExitOff, `guest`]
//   ],
//   [
//     `${emoji.house} Дом`,
//     [`${line}${emoji.therm} ${getTemp`house`} °C${line}${emoji.lamp} `, keyboards.houseOff]
//   ],
//   [
//     `Разное`,
//     [`${line}Для связи в телеграмм: @altulin`, keyboards.other, `guest`]
//   ],
//   [
//     `errorMsg`,
//     [`${emoji.pouting}${line}Эту команду я не знаю \n`, keyboards.main, `guest`]
//   ],
//   [
//     `${emoji.man}`,
//     [`${line}Что будем сегодня делать?`, keyboards.sport, `guest`]
//   ],
//   [
//     `gear`,
//     [`${emoji.gear} RPi${line}${emoji.therm} ${getTemp`rpi`} °C${line}${emoji.proc} ${getTempRpi()}${line}${emoji.hot}`, keyboards.rpiOff]
//   ],
//   [
//     `counter`,
//     [`${emoji.clock} ХВС ГВС через пробел`, keyboards.reply]
//   ],
//   [
//     `access`,
//     [`${emoji.pouting}${line}Эта команда для вас не доступна \n`, keyboards.main]
//   ],
//   [
//     `Спина`,
//     [keyboards.main, `guest`]
//   ],
//   [
//     `Трицепс`,
//     [keyboards.main, `guest`]
//   ],
//   [
//     `Ноги`,
//     [keyboards.main, `guest`]
//   ],
//   [
//     `Плечи`,
//     [keyboards.main, `guest`]
//   ],
//   [
//     `Грудь`,
//     [keyboards.main, `guest`]
//   ],
//   [
//     `Бицепс`,
//     [keyboards.main, `guest`]
//   ]
// ]);
