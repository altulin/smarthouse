import config from "config";
// import SendMessage from "./send_message.js";
// import { keyboards } from "./keyboard.js";

const addr = config.get(`addr`);
const name = config.get(`name`);

export const getCounterMsg = (response) => {
  const data = response.split(` `, 2);
  return (data.length === 2) ?
    `Показания счетчиков \n${addr} \n${name} \nХВС: ${data[0]} \nГВС: ${data[1]}` :
    `Не корректные данные!!!`;
};
