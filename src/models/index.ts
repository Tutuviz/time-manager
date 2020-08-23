import fs from "fs";

const postSchedule = (data: any) => {
	fs.writeFile(
		"./src/data/data.json",
		JSON.stringify(data, null, " "),
		(err) => {
			if (err) {
				return false;
			}
		}
	);
	return true;
};

const deleteSchedule = (index: number) => {
	const data = getSchedule();
	data.splice(index, 1);
	fs.writeFile(
		"./src/data/data.json",
		JSON.stringify(data, null, " "),
		(err) => {
			if (err) {
				return false;
			}
		}
	);
	return true;
};

const getSchedule = () => {
	const data = fs.readFileSync("./src/data/data.json");
	const newData = JSON.parse(data.toString());
	return newData;
};

const getScheduleFiltered = (filter: any) => {
	const data = getSchedule();
	const response = data.filter(filter);
	return response;
};

export default {
	postSchedule,
	deleteSchedule,
	getSchedule,
	getScheduleFiltered,
};
