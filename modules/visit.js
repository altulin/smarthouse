import SendMessage from "./send_message.js";
import { keyboards } from "./keyboard.js";


const makeVisitMessage = (id, text, user) => {
	const userName = (user) ? `@${user}` : `no name ${emoji.face}`;
	return `У нас гости!${line}${text} \nid: ${id}\nuser: ${userName}`;
};


export default class VisitSendMessage extends SendMessage {
	constructor(id, msg, user) {
		super(id);
		this._msg = msg;
		this._user = user;
  }
  getMessage() {
		return	makeVisitMessage(this._id, this._msg, this._user);
	}
  getMarkup() {
    return keyboards.main;
	}
}
