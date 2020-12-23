import  config  from "config";
import SendMessage from "./send_message.js";
import { keyboards } from "./keyboard.js";

const addr = config.get(`addr`);
const name = config.get(`name`);

const getCounterMsg = (response) => {
  const data = response.split(` `, 2);
  return (data.length == 2) ?
  `Показания счетчиков \n${addr} \n${name} \nХВС: ${data[0]} \nГВС: ${data[1]}` :
  `Не корректные данные!!!`
};

export default class CounterSendMessage extends SendMessage {
	constructor(id, msg) {
		super(id);
		this._msg = msg;
  }
  getMessage() {
		return	getCounterMsg(this._msg);
	}
  getMarkup() {
    return keyboards.main;
	}
}
