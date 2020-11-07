'use strict';
(function () {
	const emoji = {
		tree: `\u{1F332}`,
		therm: `\u{1F321}`,
		lamp: `\u{1F4A1}`,
		man: `\u{1f3cb}`,
		house: `\u{1F3E1}`,
		umbrella: `\u{2602}`,
		envelope: `\u{2709}`,
		backhand: `\u{1F447}`,
		hot: `\u{2668}`,
		gear: `\u{2699}`,
		hammer: `\u{1f6e0}`,
		clock: `\u{1f55b}`,
		proc: `\u{1F4BB}`,
		face: `\u{1F636}`,
		pouting: `\u{1F621}`
	};

	exports.objects = {
		emoji,

		main: {
			"reply_markup": {
				"keyboard": [[`${emoji.house} Дом`, `${emoji.tree} Улица`, `${emoji.man} Разное`]],
				"resize_keyboard": true}},

		weatherlampExitOn: {
			"reply_markup": {"inline_keyboard":
			[[{"text": `${emoji.lamp} включить`, "callback_data": `lampExitOn`}],
				[{"text": `${emoji.umbrella} погода`, "callback_data": `weather`}]]}
		},

		weatherLampExitOff: {
			"reply_markup": {"inline_keyboard":
			[[{"text": `${emoji.lamp} выключить`, "callback_data": `lampExitOff`}],
				[{"text": `${emoji.umbrella} погода`, "callback_data": `weather`}]]}
		},

		other: {
			"reply_markup": {"inline_keyboard":	[[{"text": `${emoji.man} Упражнения`, "callback_data": `body`}]]}
		},

		sport: {"reply_markup": {"inline_keyboard": [
			[{"text": `${emoji.man} Спина`, "callback_data": `back_exercises`}],
			[{"text": `${emoji.man} Трицепс`, "callback_data": `triceps_exercises`}],
			[{"text": `${emoji.man} Ноги`, "callback_data": `legs_exercises`}],
			[{"text": `${emoji.man} Плечи`, "callback_data": `shoulders_exercises`}],
			[{"text": `${emoji.man} Грудь`, "callback_data": `chest_exercises`}],
			[{"text": `${emoji.man} Бицепс`, "callback_data": `biceps_exercises`}]]}
		},

		houseOff: {"reply_markup": {"inline_keyboard": [
			[{"text": `${emoji.hot} выключить`, "callback_data": `houseOff`}],
			[{"text": `${emoji.gear} ${emoji.hammer} ${emoji.therm}`, "callback_data": `gear`}],
			[{"text": `${emoji.clock} счетчики`, "callback_data": `counter`}]]}
		},

		houseOn: {"reply_markup": {"inline_keyboard": [
			[{"text": `${emoji.hot} включить`, "callback_data": `houseOn`}],
			[{"text": `${emoji.gear} ${emoji.hammer} ${emoji.therm}`, "callback_data": `gear`}],
			[{"text": `${emoji.clock} счетчики`, "callback_data": `counter`}]]}
		},

		rpiOn: {"reply_markup": {"inline_keyboard": [
			[{"text": `${emoji.hot} включить обогрев`, "callback_data": `rpiOn`}]]}
		},

		rpiOff: {"reply_markup": {"inline_keyboard": [
			[{"text": `${emoji.hot} выключить обогрев`, "callback_data": `rpiOff`}]]}
		},

		reply: {"reply_markup": {"force_reply": true}}
	};
})();
