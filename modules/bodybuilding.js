import { randomInt } from "./utils.js"
import { exersises } from "./exersises.js"
import { line } from "./weather.js";

const exersiseTypes = new Map([
	[`Спина`, `back`],
	[`Трицепс`, `triceps`],
	[`Ноги`, `legs`],
	[`Плечи`, `shoulders`],
	[`Грудь`, `chest`],
	[`Бицепс`, `biceps`]
]);

export const createExerisesPlan = (section) => {
	const type = exersises.get(exersiseTypes.get(section));

	const planToday = type.map((item) => {

		const data = item[randomInt(item.length - 1)];

		return (typeof data[0] === `string`) ?
			`${line}${data[0]}` :
			`${line}${data.map(elem => elem[0]).join(`, `)}`;

	}).join(``);

	return planToday;
};
