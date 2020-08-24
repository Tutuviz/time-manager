import { Request, Response } from "express";

import Model from "../models";
import totalDays from "../util/totalDays";
import isDate from "../util/isDate";

export interface schedule {
	day: string;
	intervals: [
		{
			start: string;
			end: string;
		}
	];
}

interface intervalInterface {
	start: string;
	end: string;
}

const createTime = (req: Request, res: Response) => {
	const { day, intervals } = req.body;
	const data = Model.getSchedule();

	if (
		intervals.some((input: intervalInterface) => input.start >= input.end) ||
		(typeof day == "number" && (day < 0 || day > 6)) ||
		(typeof day == "string" && !isDate(day) && day != "everyday")
	) {
		return res.status(400).json({
			message: "Bad Request",
		});
	}

	const index = data.findIndex((schedule: schedule) => schedule.day === day);

	let updated = false;
	if (index >= 0) {
		let conflicting = false;
		intervals.forEach((input: intervalInterface) => {
			data[index].intervals.forEach((appointment: intervalInterface) => {
				if (input.start > appointment.end || input.end < appointment.start) {
					data[index].intervals.push(...intervals);
					updated = true;
				} else {
					conflicting = true;
				}
			});
		});
		if (conflicting) {
			return res.status(409).json({
				message: "Conflict",
			});
		}
	} else {
		data.push({ day, intervals });
	}

	const response = Model.postSchedule(data);
	if (!response) {
		res.status(503).json({
			message: "Internal Error",
		});
	}

	if (updated) {
		return res.status(200).json({
			message: "Updated",
		});
	}

	return res.status(201).json({
		message: "Created",
	});
};

const deleteTime = (req: Request, res: Response) => {
	const { day, intervals } = req.body;

	const data = Model.getSchedule();

	const index = data.findIndex(
		(schedule: schedule) =>
			schedule.day === day &&
			JSON.stringify(schedule.intervals) === JSON.stringify(intervals)
	);

	if (index < 0) {
		return res.status(404).json({
			message: "Not Found",
		});
	}

	const response = Model.deleteSchedule(index);
	if (!response) {
		return res.status(503).json({
			message: "Internal Error",
		});
	}

	return res.json({
		message: "Delete Successful",
	});
};

const listTime = (req: Request, res: Response) => {
	const response = Model.getSchedule();

	if (!response.length) {
		return res.status(404).json({
			message: "Not found",
		});
	}
	return res.json(response);
};

const listTimeInterval = (req: Request, res: Response) => {
	const { from, to } = req.body;

	if (!isDate(from) || !isDate(to) || from >= to) {
		return res.status(400).json({
			message: "Bad Request",
		});
	}

	function filterData(schedule: schedule) {
		if (
			typeof schedule.day === "string" &&
			(schedule.day === "everyday" ||
				(totalDays(schedule.day) >= totalDays(from) &&
					totalDays(schedule.day) <= totalDays(to)))
		) {
			return true;
		}
		return false;
	}

	const response = Model.getScheduleFiltered(filterData);

	if (!response.length) {
		return res.status(404).json({
			message: "Not found",
		});
	}
	res.json(response);
};

export default { createTime, deleteTime, listTime, listTimeInterval };
