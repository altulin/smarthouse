import { power, reply, exersiseTypes, special } from "./reply.js";
import { emoji } from "./utils.js";




// список команд с инлайн клавиатурой
const inline = new Map([
	[`street`, [`weather`]],
	[`house`, [`gear`, `counter`]],
	[`other`, ['athlete']]
]);

const getTextCommand = (value) => {
	return [...reply].find(([key, val]) => val === value)[0]
}

export const getKeyboard = (msg) => {
	const markup = {
		"reply_markup": {
			"inline_keyboard": []
		}
	};

	const markupStart = {
		"reply_markup": {
			"keyboard": [[`${emoji.house} Дом`, `${emoji.tree} Улица`, `Разное`]],
			"resize_keyboard": true
		}
	}

	const markupArr = markup.reply_markup.inline_keyboard

	// управляемое вкл выкл
	if (power.has(msg)) {
		for (const item of power.get(msg)) {
			markupArr.push([{ "text": `${item}`, "callback_data": `lampExitOn` }]);
		}
	}

	// разные
	if (inline.has(msg)) {
		for (const item of inline.get(msg)) {
			markupArr.push([{ "text": `${getTextCommand(item)}`, "callback_data": `${getTextCommand(item)}` }]);
		}
	}

	// Качалка
	if (msg === `athlete`) {
		for (const item of exersiseTypes) {
			markupArr.push([{ "text": `${getTextCommand(item)}`, "callback_data": `${getTextCommand(item)}` }]);
		}
	}
	// console.log(msg)
	// спец команды
	if (special.has(msg)) {
		return markupStart;
	}

	if (msg === `weather`) {
		return markupStart;
	}


	// console.log(markupArr)
	// console.log([...reply].find(([key, val]) => val === `chest`)[0])
	return markup;
	// return keyboards.main;
};

export const keyboards = {
	main: {
		"reply_markup": {
			"keyboard": [[`${emoji.house} Дом.`, `${emoji.tree} Улица`, `Разное`]],
			"resize_keyboard": true
		}
	},

	weatherlampExitOn: {
		"reply_markup": {
			"inline_keyboard":
				[[{ "text": `${emoji.lamp} включить`, "callback_data": `lampExitOn` }],
				[{ "text": `${emoji.umbrella} погода`, "callback_data": `weather` }]]
		}
	},

	weatherLampExitOff: {
		"reply_markup": {
			"inline_keyboard":
				[[{ "text": `${emoji.lamp} выключить`, "callback_data": `lampExitOff` }],
				[{ "text": `${emoji.umbrella} погода`, "callback_data": `weather` }]]
		}
	},

	other: {
		"reply_markup": { "inline_keyboard": [[{ "text": `${emoji.man} Упражнения`, "callback_data": `${emoji.man}` }]] }
	},

	sport: {
		"reply_markup": {
			"inline_keyboard": [
				[{ "text": `${emoji.man} Спина`, "callback_data": `Спина` }],
				[{ "text": `${emoji.man} Трицепс`, "callback_data": `Трицепс` }],
				[{ "text": `${emoji.man} Ноги`, "callback_data": `Ноги` }],
				[{ "text": `${emoji.man} Плечи`, "callback_data": `Плечи` }],
				[{ "text": `${emoji.man} Грудь`, "callback_data": `Грудь` }],
				[{ "text": `${emoji.man} Бицепс`, "callback_data": `Бицепс` }]]
		}
	},

	houseOff: {
		"reply_markup": {
			"inline_keyboard": [
				[{ "text": `${emoji.hot} выключить`, "callback_data": `houseOff` }],
				[{ "text": `${emoji.gear} ${emoji.hammer} ${emoji.therm}`, "callback_data": `gear` }],
				[{ "text": `${emoji.clock} счетчики`, "callback_data": `counter` }]]
		}
	},

	houseOn: {
		"reply_markup": {
			"inline_keyboard": [
				[{ "text": `${emoji.hot} включить`, "callback_data": `houseOn` }],
				[{ "text": `${emoji.gear} ${emoji.hammer} ${emoji.therm}`, "callback_data": `gear` }],
				[{ "text": `${emoji.clock} счетчики`, "callback_data": `counter` }]]
		}
	},

	rpiOn: {
		"reply_markup": {
			"inline_keyboard": [
				[{ "text": `${emoji.hot} включить обогрев`, "callback_data": `rpiOn` }]]
		}
	},

	rpiOff: {
		"reply_markup": {
			"inline_keyboard": [
				[{ "text": `${emoji.hot} выключить обогрев`, "callback_data": `rpiOff` }]]
		}
	},

	reply: { "reply_markup": { "force_reply": true } }
};
