import { randomInt } from "./utils.js"
import { exersises } from "./exersises.js"

export const createExerisesPlan = (section) => {
  const planToday = exersises.get(`${section}`).map((item) => {
		const data = item[randomInt(item.length - 1)];
		return (typeof data[0] === `string`) ?
			data[0] :
			data.map((elem) => elem[0]).join(`, `);
	});

	return planToday;
};
