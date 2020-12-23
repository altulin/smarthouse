import { randomInt } from "./utils.js"
import { exersises } from "./exersises.js"
import { line } from "./weather.js";

export const createExerisesPlan = (section) => {
	const planToday = exersises.get(`${section}`)
  // const planToday = exersises.get(`${section}`).map((item) => {
	// 	const data = item[randomInt(item.length - 1)];
	// 	console.log(data)
	// 	return (typeof data[0] === `string`) ?
	// 		`${line}`+ data[0].split(`, `) :
	// 		data.map((elem) => elem[0]).join(`, `);
	// });
	console.log(planToday)

	return planToday;
};
