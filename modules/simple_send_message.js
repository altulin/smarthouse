import SendMessage from "./send_message.js";
import { reply } from "./reply.js"
import  config  from "config";


const users = Object.values(config.get(`userId`));
const guestMsg = `Эта команда для гостей не доступна`;


const makeMessage = (id, msg) => {
  if (reply.has(msg)) {
    if (reply.get(msg).join().includes(`guest`)) {
      return `${msg}${reply.get(msg)[0].join()}`;
    } else {
      return (users.toString().includes(id)) ?
      `${msg}${reply.get(msg)[0].join()}` :
      guestMsg;
    }
  } else {
    return `${reply.get(`errorMsg`)[0].join()}${msg}`;
  }
  // return `${msg}`;
};

const makeMarkup = (id, msg) => {
  if (reply.has(msg)) {
    return (reply.get(msg)[1].length>1) ? reply.get(msg)[1][0] : reply.get(msg)[1][0];
  } else {
    return reply.get(`errorMsg`)[1][0];
  }
};

export default class SimpleSendMessage extends SendMessage {
	constructor(id, msg) {
		super(id);
		this._msg = msg;
  }
  getMessage() {
    // return	makeMessage(this._id, this._msg);
    return this._id
	}
  getMarkup() {
    return this_.msg
    // return makeMarkup(this._id, this._msg);
	}
}
