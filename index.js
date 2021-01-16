// process.env.NTBA_FIX_319 = 1
import { bot } from "./modules/bot.js";
import { keyboards, getKeyboard } from "./modules/keyboard.js";
import { reply, access, getText } from "./modules/reply.js";
import config from "config";

const listenerList = [`message`, `callback_query`];
const users = Object.values(config.get(`userId`));


const getResponseAboutGuest = (id, msg, first_name, username) => {
	const myId = config.get(`myId`);
	const responseMsg =
		`У нас гости!\nимя: ${first_name}\nusername: @${username}\nid: ${id}\nкоманда: ${msg}`;
	const responseMarkup = keyboards.main;
	sendMessage(myId, responseMsg, responseMarkup);
}


const sendMessage = (id, responseMsg, responseMarkup) => {
	bot.sendMessage(id, responseMsg, responseMarkup);
};


const getResponse = (id, msg) => {
	let responseMsg = ``;
	let responseMarkup = {};

	responseMsg = getText(msg);
	responseMarkup = getKeyboard(reply.get(msg));
	// responseMarkup = keyboards.main;
	sendMessage(id, responseMsg, responseMarkup);
};


const sortResponseQuest = (id, msg) => {

	if (!users.toString().includes(id)) {
		// 	допуск гостям : запрет гостям
		(access.has(reply.get(msg))) ? getResponse(id, msg) : getResponse(id, `access`);

	} else {
		// свои
		getResponse(id, msg);
	}
};

const sortResponseId = (response) => {
	const id = response.from.id;
	const replyMessage = response.reply_to_message;
	const msg = (response.text === undefined) ? response.data : response.text;
	const firstName = response.from.first_name;
	const userName = response.from.username;
	//оповещение о гостях
	if (!users.toString().includes(id)) {
		getResponseAboutGuest(id, msg, firstName, userName);
	}

	if (replyMessage) {

	}

	// незнакомая команда
	(!reply.has(msg)) ? getResponse(id, `errorMsg`) : sortResponseQuest(id, msg);
};


const makeListener = (list) => {
	for (const listener of list) {
		bot.on(listener, (msg) => {
			sortResponseId(msg);
		});
	}
};

const main = () => {
	// createTasksSunPositions(bot);
	makeListener(listenerList);
}

main();
