import { randomInt } from "./utils.js"
import { exersises } from "./exersises.js"
import { line } from "./weather.js";


export const createExerisesPlan = (section) => {
	const type = exersises.get(section);

	const planToday = type.map((item) => {
		const data = item[randomInt(item.length - 1)];
		return (typeof data[0] === `string`) ?
			`${data[0]}${line}` :
			`${data.map(elem => elem[0]).join(`, `)}${line}`;
	}).join(``);

	return planToday;
};
