import fs from "fs";

const postSchedule = (data: any) => {
	fs.writeFile(
		"./src/data/index.json",
		JSON.stringify(data, null, " "),
		(err) => {
			if (err) {
				return false;
			}
		}
	);
	return true;
};

const deleteSchedule = (data: any) => {
	fs.writeFile(
		"./src/data/index.json",
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
	const data = fs.readFileSync("./src/data/index.json");
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
