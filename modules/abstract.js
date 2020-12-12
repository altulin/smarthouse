
import TelegramBot from "node-telegram-bot-api";
import  config  from "config";

const bot = new TelegramBot(config.get(`token`), {polling: true});

export default class SendMessage {
  constructor(id) {
    if (new.target === Send) {
      throw new Error(`Can't instantiate Send, only concrete one.`);
    }
    this._id = id;
	}
	getMarkup() {
		throw new Error(`Send method not implemented: getMarkup`);
	}
	getMessage() {
		throw new Error(`Send method not implemented: getMarkup`);
	}
  sendMessage() {
    bot.sendMessage(this._id, this.getMessage(), this.getMarkup());
  }
}
