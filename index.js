// process.env.NTBA_FIX_319 = 1
import { bot } from "./modules/bot.js";
import { keyboards } from "./modules/keyboard.js";
import { reply } from "./modules/reply.js";
import { line } from "./modules/weather.js";
import { createTasksSunPositions } from "./modules/crontab.js";
// import SimpleSendMessage from "./modules/simple_send_message.js";
import CounterSendMessage from "./modules/counter.js";
import VisitSendMessage from "./modules/visit.js";
import  config  from "config";


// const sendMessage = (id, message, markup) => bot.sendMessage(id, message, markup);

// const sendMessageMe = (id, text, user) => {
// 	const userName = (user) ? `@${user}` : `no name ${emoji.face}`;
// 	const message = `У нас гости!${line}${text} \nid: ${id}\nuser: ${userName}`;
// 	bot.sendMessage(get(`myId`), message, keyboards.main);
// 	// return;
// };


class SendMessage {
	constructor() {
		this._bot = bot;
		this._keyboards = keyboards;
		this._reply = reply;
		this._resonseMsg = null;
		this._responseMarkup = null;
		this._id = null;

	}

	createResponse(id, msg) {
		this._id = id;
		this._msg = msg;


		this._resonseMsg = this._reply.get(`errorMsg`)[0];
		this._responseMarkup = this._reply.get(`errorMsg`)[1];


		this._sendMessage();
	}

	_sendMessage() {
    this._bot.sendMessage(this._id, this._resonseMsg, this._responseMarkup);
	}
}

class Bot {
	constructor() {
		this._bot = bot;
		this._sendmessage = new SendMessage();
	}

	init() {
		this._makeListenerMessage();
		this._makeListenerQuery();
	}

	_makeListenerMessage() {
		this._bot.on(`message`, (msg) => {
			this._id = msg.from.id;
			this._msg = msg.text;
			this._sendmessage.createResponse(this._id, this._msg);
		})
	}
	_makeListenerQuery() {
		this._bot.on(`callback_query`, (msg) => {
			this._id = msg.from.id;
			this._msg = msg.data;
			this._sendmessage.createResponse(this._id, this._msg);
		})
	}
}
new Bot().init();
