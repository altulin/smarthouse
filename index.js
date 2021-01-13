// process.env.NTBA_FIX_319 = 1
import { bot } from "./modules/bot.js";
import { keyboards } from "./modules/keyboard.js";
import { reply, text, access, getTemp, sensors, power, exersiseTypes } from "./modules/reply.js";
import { line } from "./modules/weather.js";
import config from "config";

const special = new Set([`quest`, `errorMsg`, `access`]);
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

const getText = (msg) => {
	const message = [msg];
	const replyItem = reply.get(msg);
	if (text.has(replyItem)) {
		message.push(text.get(replyItem));
	}
	if (sensors.has(replyItem)) {
		const listSensors = sensors.get(replyItem);
		for (const item of listSensors) {
			message.push(getTemp(item));
		}
	}
	if (exersiseTypes.has(replyItem)) {

	}
	return message.join(`${line}`)
};


const getResponse = (id, msg) => {
	let responseMsg = ``;
	let responseMarkup = {};

	if (special.has(msg)) {
		responseMsg = text.get(msg);
		responseMarkup = keyboards.main;
	} else {
		responseMsg = getText(msg);
		responseMarkup = keyboards.main;
	}



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
	const msg = (response.text === undefined) ? response.data : response.text;
	const firstName = response.from.first_name;
	const userName = response.from.username;
	//оповещение о гостях
	if (!users.toString().includes(id)) {
		getResponseAboutGuest(id, msg, firstName, userName);
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
